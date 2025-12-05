import { loadUserData, saveUserData } from "../storage/file.storage.js";

const VALID_USERS = {
    "phuoc@lifeos.app": "123456",
    "demo@lifeos.app": "demo",
    "admin@gmail.com": "admin123",
    "you@gmail.com": "123123",
};

export const userService = {
    login(email, password) {
        if (!email || VALID_USERS[email] !== password) return null;

        const data = loadUserData(email) || {};
        return {
            email,
            name: data.name || email.split("@")[0],
        };
    },

    register(email, password, name) {
        if (!email || VALID_USERS[email]) return null;

        VALID_USERS[email] = password;
        const user = {
            email,
            name: name || email.split("@")[0],
        };

        saveUserData(email, user);
        return user;
    },

    exists(email) {
        return Boolean(VALID_USERS[email]);
    },

    getPassword(email) {
        return VALID_USERS[email];
    },
};
