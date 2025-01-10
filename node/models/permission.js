"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            Permission.belongsToMany(models.Role, {
                through: models.RolePermission,
                onDelete: "cascade",
                foreignKey: { name: "permissionId", allowNull: false },
                as: "user", // Assuming this should be "roles" instead of "user"
            });
        }
    }

    Permission.init(
        {
            permissionName: {
                type: DataTypes.STRING(32),
                allowNull: false,
                validate: {
                    notNull: { msg: "Permission name is required." },
                    len: {
                        args: [3, 30],
                        msg: "Permission name must be between 3 and 30 characters.",
                    },
                },
            },
            permissionDescription: {
                type: DataTypes.STRING(64),
                allowNull: false,
                validate: {
                    notNull: { msg: "Permission description is required." },
                    len: {
                        args: [3, 64],
                        msg: "Permission description must be between 3 and 64 characters.",
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Permission",
        }
    );

    return Permission;
};
