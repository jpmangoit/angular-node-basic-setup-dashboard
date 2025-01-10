const express = require("express");
const authController = require("./authController");
const authRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication Operations
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             examples:
 *               success:
 *                 summary: Successful login
 *                 value:
 *                   isError: false
 *                   result:
 *                     user:
 *                       id: 1
 *                       firstName: Judson
 *                       lastName: Wisozk
 *                       email: test@gmail.com
 *                       username: test
 *                       dob: 2024-06-30T00:00:00.000Z
 *                       mobileNumber: 854562512525
 *                       role:
 *                         - id: 1
 *                           roleName: user
 *                           UserRole:
 *                             roleId: 1
 *                             userId: 1
 *                     token: token
 *                   message: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/login", authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role_type
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role_type:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists. Please login
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/register", authController.register);

/**
 * @swagger
 * /auth/verify/{id}:
 *   get:
 *     tags: [Authentication]
 *     summary: Verify user email
 *     description: Verify a user's email address using a token.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Verified successfully or already verified
 *       500:
 *         description: Invalid token or internal server error
 */
authRoutes.get("/verify/:id", authController.verify);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Forgot password
 *     description: Send a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: You will get the email soon!
 *       500:
 *         description: User with this email does not exist or internal server error
 */
authRoutes.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset password
 *     description: Reset the user's password using a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: someRandomToken
 *               password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Your password has been changed
 *       400:
 *         description: Incorrect token or it is expired or user with this token does not exist
 *       401:
 *         description: Authentication error
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/reset-password", authController.resetPassword);

module.exports = authRoutes;
