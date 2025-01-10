const validateUpdateUser = ({ password, firstName, lastName, email }) => {
    const errors = [];

    if (password && (typeof password !== "string" || password.length < 6)) {
        errors.push("Password must be a string of at least 6 characters.");
    }

    if (firstName && typeof firstName !== "string") {
        errors.push("First name must be a string.");
    }

    if (lastName && typeof lastName !== "string") {
        errors.push("Last name must be a string.");
    }

    if (email && typeof email !== "string") {
        errors.push("Email must be a string.");
    } else if (email && !isValidEmail(email)) {
        errors.push("Invalid email format.");
    }

    return errors.length ? errors.join(" ") : null;
};

function isValidEmail(email) {
    // Basic email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
    validateUpdateUser,
};
