export const isEmpty = (value) => !value || value.trim() === '';
export const isEmailValid = (email) => !/^\S+@\S+\.\S+$/.test(email);
export const isPasswordValid = (password) => password.length < 6;
export const passwordcheck = (password, confirmPassword) => password !== confirmPassword;
