// server/storage.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_DIR = path.join(__dirname, 'data/users');

if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
}

const getUserFilePath = (email) => {
    const safeEmail = email.replace(/[@.]/g, '_');
    return path.join(USERS_DIR, `${safeEmail}.json`);
};

export const loadUserData = (email) => {
    const filePath = getUserFilePath(email);
    if (!fs.existsSync(filePath)) {
        return { email, name: email.split('@')[0], tasks: [], notes: [], goals: [], habits: [], areas: [] };
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
        return { email, name: email.split('@')[0], tasks: [], notes: [], goals: [], habits: [], areas: [] };
    }
};

export const saveUserData = (email, data) => {
    const filePath = getUserFilePath(email);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};