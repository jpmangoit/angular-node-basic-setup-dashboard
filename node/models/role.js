"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.User, {
                through: models.UserRole,
                onDelete: "cascade",
                foreignKey: { name: "roleId", allowNull: false },
                as: "users"
            });
            Role.belongsToMany(models.Permission, {
                through: models.RolePermission,
                onDelete: "cascade",
                foreignKey: { name: "roleId", allowNull: false },
                as: "permissions"
            });
        }
    }

    Role.init(
        {
            roleName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Role name is required." },
                    len: {
                        args: [3, 30],
                        msg: "Role name must be between 3 and 30 characters.",
                    },
                },
            },
            roleDescription: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Role description is required." },
                    len: {
                        args: [3, 30],
                        msg: "Role description must be between 3 and 30 characters.",
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Role",
        }
    );

    return Role;
};
