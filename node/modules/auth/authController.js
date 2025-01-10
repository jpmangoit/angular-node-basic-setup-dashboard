const bcrypt = require("bcrypt");
const { User, Role, UserRole } = require("../../models");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailHelper = require("../../helpers/sendEmail");
const {
    validateRegistration,
    validateForgotPassword,
    validateResetPassword,
} = require("./authValidators");

dotenv.config();

module.exports = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log("Login request body:", req.body);

            const user = await User.findOne({
                where: { email },
                include: ["role"],
            });

            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            if (user.isEmailVerified !== "1") {
                return res.status(401).json({
                    message: "Pending Account. Please Verify Your Email!",
                });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ message: "Invalid Credentials" });
            }

            const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
                expiresIn: "24h",
            });

            return res.status(200).json({
                user,
                token,
                message: "User Login successfully",
            });
        } catch (error) {
            console.error("Error in login:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    async register(req, res) {
        try {
            const { email, password, firstName, lastName, role_type } =
                req.body;

            // Validate registration input
            const validationError = validateRegistration(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res
                    .status(409)
                    .json({ message: "User Already Exists. Please Login" });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword,
            });

            const role = await Role.findOne({ where: { roleName: role_type } });
            if (role) {
                await UserRole.create({ userId: user.id, roleId: role.id });
            }

            const verifyToken = crypto.randomBytes(10).toString("hex");
            await User.update({ verifyToken }, { where: { id: user.id } });

            await emailHelper.sendEmail(
                email,
                "Please confirm your account",
                "../public/verify.ejs",
                { user }
            );

            return res.status(201).json({
                user,
                role,
                message: "User Created successfully",
            });
        } catch (error) {
            console.error("Error in register:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    async verify(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findOne({ where: { verifyToken: id } });

            if (!user) {
                return res.status(404).json({ message: "Invalid Token" });
            }

            if (user.isEmailVerified === "1") {
                return res.status(200).json({ message: "Already verified" });
            }

            await User.update(
                { isEmailVerified: "1" },
                { where: { verifyToken: id } }
            );

            return res.status(200).json({ message: "Verified Successfully" });
        } catch (error) {
            console.error("Error in verify:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Validate forgot password input
            const validationError = validateForgotPassword(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({
                    message: "User with this email does not exist",
                });
            }

            const token = jwt.sign(
                { _id: user.id },
                process.env.RESET_PASSWORD_SECRET + user.password,
                { expiresIn: "15m" }
            );

            await User.update(
                { resetLinkToken: token },
                { where: { id: user.id } }
            );

            await emailHelper.sendEmail(
                email,
                "Reset Account Password Link",
                "../public/forgot-password.ejs",
                { user,token,frontendUrl: process.env.FRONTEND_URL}
            );

            return res
                .status(200)
                .json({ message: "You will get the email soon!" });
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;

            // Validate reset password input
            const validationError = validateResetPassword(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            const user = await User.findOne({
                where: { resetLinkToken: token },
            });

            if (!user) {
                return res.status(404).json({
                    message: "User with this token does not exist",
                });
            }

            jwt.verify(
                token,
                process.env.RESET_PASSWORD_SECRET + user.password,
                async (error) => {
                    if (error) {
                        return res.status(400).json({
                            error: "Incorrect token or it is expired",
                        });
                    }

                    const encryptedPassword = await bcrypt.hash(password, 10);

                    await User.update(
                        { password: encryptedPassword },
                        { where: { id: user.id } }
                    );

                    return res.status(200).json({
                        message: "Your password has been changed",
                    });
                }
            );
        } catch (error) {
            console.error("Error in resetPassword:", error);
            return res.status(500).json({ error: error.message });
        }
    },
};
