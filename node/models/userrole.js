"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        static associate(models) {
            UserRole.belongsTo(models.Role, {
                foreignKey: "roleId",
                onDelete: "CASCADE",
            });
            UserRole.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
        }
    }

    UserRole.init(
        {
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "Role ID is required." },
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "User ID is required." },
                },
            },
        },
        {
            sequelize,
            modelName: "UserRole",
            timestamps: false,
        }
    );

    return UserRole;
};
