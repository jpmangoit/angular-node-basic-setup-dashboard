const bcrypt = require("bcrypt");
const User = require("../../../models").User;
const dotenv = require("dotenv");
const { validateUpdateUser } = require("./userValidators");

dotenv.config();

module.exports = {
    async get(req, res) {
        try {
            const userCollection = await User.findOne({
                include: ["role"],
                where: { id: req.user.id },
            });

            let response = {
                data: userCollection,
            };

            return res.status(200).json(response);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const validationError = validateUpdateUser(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const user = await User.findOne({
                where: { id: req.user.id },
            });

            if (!user) {
                return res.status(404).json({ message: "User Not Found" });
            }

            const [updateCount, updatedUsers] = await User.update(req.body, {
                where: { id: req.user.id },
                returning: true,
            });

            if (updateCount > 0) {
                return res.status(200).json({
                    updatedUser: updatedUsers[0],
                    message: "User Updated successfully",
                });
            } else {
                return res.status(404).json({ message: "User Not Found" });
            }
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    },
};
