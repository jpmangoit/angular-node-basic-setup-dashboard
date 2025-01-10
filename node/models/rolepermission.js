"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
            RolePermission.belongsTo(models.Role, {
                foreignKey: "roleId",
                onDelete: "CASCADE",
            });
            RolePermission.belongsTo(models.Permission, {
                foreignKey: "permissionId",
                onDelete: "CASCADE",
            });
        }
    }

    RolePermission.init(
        {
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "Role ID is required." },
                },
            },
            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "Permission ID is required." },
                },
            },
        },
        {
            sequelize,
            modelName: "RolePermission",
            timestamps: false,
        }
    );

    return RolePermission;
};
