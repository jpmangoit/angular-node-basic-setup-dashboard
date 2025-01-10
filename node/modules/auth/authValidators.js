const validateRegistration = ({
    email,
    password,
    firstName,
    lastName,
    role_type,
}) => {
    if (!email || !password || !firstName || !lastName || !role_type) {
        return "Email, password, first name, last name, and role type are required.";
    }
    return null;
};

const validateForgotPassword = ({ email }) => {
    if (!email) {
        return "Email is required.";
    }
    return null;
};

const validateResetPassword = ({ token, password }) => {
    if (!token || !password) {
        return "Token and password are required.";
    }
    return null;
};

module.exports = {
    validateRegistration,
    validateForgotPassword,
    validateResetPassword,
};
