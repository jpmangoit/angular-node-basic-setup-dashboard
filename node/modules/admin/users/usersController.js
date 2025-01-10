const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
const { User, Role, UserRole } = require("../../../models");
const { sendVerificationEmail } = require("../../../helpers/sendEmail");
const { validateUserCreation } = require("./usersValidators");

dotenv.config();

const UsersController = {
    async get(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const offset = (page - 1) * limit;

            const { count, rows: userCollection } = await User.findAndCountAll({
                include: ["role"],
                offset,
                limit,
            });

            const totalPages = Math.ceil(count / limit);

            res.status(200).json({
                data: userCollection,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { email, firstName, lastName, password, role_type } =
                req.body;

            // Validate user creation input
            const validationError = validateUserCreation(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            // Check if user exists
            const oldUser = await User.findOne({ where: { email } });
            if (oldUser) {
                return res
                    .status(409)
                    .send("User Already Exists. Please Login.");
            }

            // Hash password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword,
                isEmailVerified: "0",
            });

            // Assign role if provided
            const role = await Role.findOne({ where: { roleName: role_type } });
            if (role) {
                await UserRole.create({
                    userId: user.id,
                    roleId: role.id,
                });
            }

            // Generate and save verification token
            const verifyToken = crypto.randomBytes(10).toString("hex");
            await User.update({ verifyToken }, { where: { id: user.id } });

            // Send verification email
            await sendVerificationEmail(user);

            res.status(201).json({
                user,
                role,
                message: "User created successfully.",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { password, ...rest } = req.body;

            // Hash password if provided
            if (password) {
                rest.password = await bcrypt.hash(password, 10);
            }

            // Update user
            const [updateCount, updatedUsers] = await User.update(rest, {
                where: { id: req.params.id },
                returning: true,
            });

            if (updateCount) {
                res.status(200).json({
                    user: updatedUsers[0],
                    message: "User updated successfully.",
                });
            } else {
                res.status(404).send("User not found.");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            // Find and delete user
            const user = await User.findOne({ where: { id: req.params.id } });
            if (user) {
                await User.destroy({ where: { id: req.params.id } });
                res.status(200).json({ message: "User deleted successfully." });
            } else {
                res.status(404).send("User not found.");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = UsersController;
