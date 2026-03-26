export const validateEmail = (email) => {
    if (email.trim()) {
        const emailRegexBasic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegexBasic.test(email);
    }
    return false;
};
