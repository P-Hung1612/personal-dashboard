import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_DIR = path.join(__dirname, "../../data/users");

if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
}

const getUserFile = (email) =>
    path.join(USERS_DIR, `${email.replace(/[@.]/g, "_")}.json`);

export const loadUserData = (email) => {
    const file = getUserFile(email);
    if (!fs.existsSync(file))
        return {
            email,
            name: email.split("@")[0],
            tasks: [],
            notes: [],
            goals: [],
            habits: [],
            areas: [],
        };
    return JSON.parse(fs.readFileSync(file));
};

export const saveUserData = (email, data) => {
    fs.writeFileSync(getUserFile(email), JSON.stringify(data, null, 2));
};
