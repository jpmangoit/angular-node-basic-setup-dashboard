var express = require("express");
const userController = require("./usersController");
const userCanAccess = require("../../../middleware/users/userCanAccess");
var userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to users
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   role:
 *                     type: string
 *                     example: user
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", userController.get);

/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.put("", userCanAccess, userController.update);

module.exports = userRouter;
