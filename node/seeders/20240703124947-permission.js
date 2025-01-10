"use strict";

/** @type {import('sequelize-cli').Migration} */

const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        // Define role data
        const permissions = [
            {
                permissionType: "get",
                permissionName: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "create",
                permissionName: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "update",
                permissionName: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "delete",
                permissionName: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "get",
                permissionName: "role",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "create",
                permissionName: "role",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "update",
                permissionName: "role",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                permissionType: "delete",
                permissionName: "role",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        // Bulk insert roles
        const userRole =
            await queryInterface.bulkInsert("Permissions", permissions, {
                returning: true,
            });

        const rolePermissionData = [];
        for (let index = 1; index < permissions.length; index++) {
            rolePermissionData.push({ roleId: 1, permissionId: index })
        }

        // Bulk insert permissionS
        await queryInterface.bulkInsert("RolePermissions", rolePermissionData, {
            returning: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([queryInterface.bulkDelete("Permissions", null, {})]);
    },
};
