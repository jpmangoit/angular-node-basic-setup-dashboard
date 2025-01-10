var express = require("express");
const RoleController = require("./rolesController");
const adminCanAccess = require("../../../middleware/admin/adminCanAccess");

var roleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Operations related to roles
 */

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Get all roles (admin)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page (max 50)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., roleName)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "615cbb038441e11e8c37bb28"
 *                       roleName:
 *                         type: string
 *                         example: "admin"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
roleRouter.get("/", adminCanAccess, RoleController.get);

/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Create a role (admin)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: admin
 *               description:
 *                 type: string
 *                 example: Role description
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["615cbb038441e11e8c37bb28"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
roleRouter.post("/", adminCanAccess, RoleController.create);

/**
 * @swagger
 * /admin/role/{id}:
 *   put:
 *     summary: Update a role (admin)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The role ID
 *         example: "615cbb038441e11e8c37bb28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: updatedRole
 *               description:
 *                 type: string
 *                 example: Updated role description
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
roleRouter.put("/:id", adminCanAccess, RoleController.update);

/**
 * @swagger
 * /admin/role/{id}:
 *   delete:
 *     summary: Delete a role (admin)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The role ID
 *         example: "615cbb038441e11e8c37bb28"
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
roleRouter.delete("/:id", adminCanAccess, RoleController.delete);

module.exports = roleRouter;
