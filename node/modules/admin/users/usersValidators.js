const validateUserCreation = ({ email, firstName, lastName, password, role_type }) => {
    if (!email || !firstName || !lastName || !password || !role_type) {
        return "Missing required fields.";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    // Password validation (example: at least 6 characters)
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    return null;
};

module.exports = { validateUserCreation };
