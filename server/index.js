// server/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadUserData, saveUserData } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// =============== USER DATABASE (DEMO) ==================
// const VALID_USERS = {
//     "phuoc@lifeos.app": "123456",
//     "demo@lifeos.app": "demo",
//     "admin@gmail.com": "admin123",
//     "you@gmail.com": "123123"
// };

// =============== HEALTH CHECK ==========================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// =============== AUTH ==========================
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (VALID_USERS[email] && VALID_USERS[email] === password) {
        const data = loadUserData(email) || {};
        res.json({
            success: true,
            user: {
                email,
                name: data.name || email.split('@')[0]
            }
        });
    } else {
        res.status(401).json({ error: "Email hoặc mật khẩu sai!" });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    if (VALID_USERS[email]) {
        return res.status(400).json({ error: "Email đã tồn tại!" });
    }

    VALID_USERS[email] = password;

    const newUser = {
        email,
        name: name || email.split('@')[0],
        tasks: [],
        notes: [],
        goals: [],
        habits: [],
        areas: []
    };

    saveUserData(email, newUser);

    res.json({ success: true, user: { email, name: newUser.name } });
});

// =============== AUTH MIDDLEWARE (CHỈ CHO /api/data) ===========
const authMiddleware = (req, res, next) => {
    const email = req.headers['x-user-email'];

    if (!email || !VALID_USERS[email]) {
        return res.status(401).json({ error: "Chưa đăng nhập" });
    }

    req.user = { email };
    next();
};

// =============== USER DATA API ==========================
app.get('/api/data', authMiddleware, (req, res) => {
    const data = loadUserData(req.user.email);
    res.json(data || null);
});

app.post('/api/data', authMiddleware, (req, res) => {
    saveUserData(req.user.email, { ...req.body, email: req.user.email });
    res.json({ success: true });
});

// =============== DEFAULT ROOT ==========================
app.get('/', (req, res) => {
    res.send('LifeOS Backend is running');
});

// =============== SERVER START ==========================
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Backend LifeOS chạy tại http://localhost:${PORT}`);
    console.log(`Dữ liệu lưu tại: ${path.join(__dirname, 'data/users')}`);
});
