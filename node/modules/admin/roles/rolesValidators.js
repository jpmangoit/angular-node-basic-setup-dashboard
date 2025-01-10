const validateRoleCreation = ({ name, description, permissionIds }) => {
    if (
        !name ||
        !description ||
        !permissionIds ||
        !Array.isArray(permissionIds) ||
        permissionIds.length === 0
    ) {
        return "Name, description, and permissions are required.";
    }
    return null;
};

module.exports = { validateRoleCreation };
