var express = require("express");
const userController = require("./usersController");
const adminCanAccess = require("../../../middleware/admin/adminCanAccess");

var userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users on admin section
 */


/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of results per page
 *         example: 10
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "615cbb038441e11e8c37bb28"
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   role_type:
 *                     type: string
 *                     example: admin
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", adminCanAccess, userController.get);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     examples:
 *       example:
 *         summary: Example request body
 *         value:
 *           email: "newuser@example.com"
 *           password: "newpassword123"
 *           firstName: "New"
 *           lastName: "User"
 *           role_type: "admin"
 */
userRouter.post("/", adminCanAccess, userController.create);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *         example: "615cbb038441e11e8c37bb28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     examples:
 *       example:
 *         summary: Example request body
 *         value:
 *           email: "updateduser@example.com"
 *           firstName: "Updated"
 *           lastName: "User"
 */
userRouter.put("/:id", adminCanAccess, userController.update);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *         example: "615cbb038441e11e8c37bb28"
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.delete("/:id", adminCanAccess, userController.delete);

module.exports = userRouter;
