const { Role, RolePermission } = require("../../../models");
const { validateRoleCreation } = require("./rolesValidators");

module.exports = {
    async get(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const roleCollection = await Role.findAndCountAll({
                limit: +limit,
                offset: offset,
            });

            const response = {
                data: roleCollection.rows,
                totalItems: roleCollection.count,
                currentPage: page,
                totalPages: Math.ceil(roleCollection.count / limit),
            };

            res.status(200).json(response);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async create(req, res) {
        try {
            const { name, description, permissionIds } = req.body;

            // Validate role creation input
            const validationError = validateRoleCreation(req.body);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            // Check if role exists
            const existingRole = await Role.findOne({
                where: { roleName: name },
            });
            if (existingRole) {
                return res.status(400).json({ message: "Role already exists" });
            }

            // Create role
            const createdRole = await Role.create({
                roleName: name,
                roleDescription: description,
            });

            // Assign permissions
            for (const permissionId of permissionIds) {
                await RolePermission.create({
                    roleId: createdRole.id,
                    permissionId: permissionId,
                });
            }

            res.status(201).json({
                data: createdRole,
                message: "Role created successfully",
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedRole = await Role.update(req.body, {
                where: { id: id },
                returning: true,
            });

            if (updatedRole[0] === 0) {
                return res.status(404).json({ message: "Role not found" });
            }

            res.status(200).json({
                data: updatedRole[1][0],
                message: "Role updated successfully",
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedRole = await Role.destroy({
                where: { id: id },
            });

            if (!deletedRole) {
                return res.status(404).json({ message: "Role not found" });
            }

            res.status(200).json({
                data: deletedRole,
                message: "Role deleted successfully",
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    },
};
