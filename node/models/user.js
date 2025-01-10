"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.Role, {
                through: models.UserRole,
                onDelete: "cascade",
                foreignKey: {
                    name: "userId",
                    allowNull: false,
                },
                as: "roles",
            });
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING(32),
                allowNull: false,
                validate: {
                    notNull: { msg: "First name is required." },
                    len: {
                        args: [3],
                        msg: "First name must be at least 3 characters long.",
                    },
                },
            },
            lastName: {
                type: DataTypes.STRING(32),
                allowNull: false,
                validate: {
                    notNull: { msg: "Last name is required." },
                    len: {
                        args: [3],
                        msg: "Last name must be at least 3 characters long.",
                    },
                },
            },
            email: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: { msg: "Email already exists." },
                validate: {
                    notNull: { msg: "Email is required." },
                    isEmail: { msg: "Invalid email format." },
                    len: {
                        args: [5],
                        msg: "Email must be at least 5 characters long.",
                    },
                },
            },
            password: {
                type: DataTypes.STRING(64),
                allowNull: false,
                validate: {
                    notNull: { msg: "Password is required." },
                },
            },
            verifyToken: { type: DataTypes.STRING },
            isEmailVerified: { type: DataTypes.STRING },
            resetLinkToken: { type: DataTypes.STRING },
        },
        {
            sequelize,
            modelName: "User",
        }
    );

    return User;
};
