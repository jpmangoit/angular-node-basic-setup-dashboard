"use strict";

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface, Sequelize) {
        const encryptedPassword = await bcrypt.hash("Any!23456", 10);

        const adminUser = [
            {
                firstName: "Admin",
                lastName: "Account",
                email: "admin@gmail.com",
                password: encryptedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        // Insert admin user
        const admin = await queryInterface.bulkInsert("Users", adminUser, {
            returning: ["id"],
        });

        const rolesData = [
            {
                roleName: "admin",
                roleDescription: "adminRole",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleName: "user",
                roleDescription: "userRole",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        // Insert roles
        const roles = await queryInterface.bulkInsert("Roles", rolesData, {
            returning: ["id"],
        });

        const userRoleData = [
            {
                userId: "1",
                roleId: "1",
            },
        ];

        // Insert user roles
        await queryInterface.bulkInsert("UserRoles", userRoleData);
    },

    async down(queryInterface, Sequelize) {
        // Delete rows from tables with foreign key references first
        await queryInterface.bulkDelete("UserRoles", null, {});
        await queryInterface.bulkDelete("Roles", null, {});
        await queryInterface.bulkDelete("Users", null, {});
    },
};
