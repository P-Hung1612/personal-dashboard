// server/index.js – ĐÃ SỬA 100%, CHẠY NGON NGAY
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

// KHAI BÁO VALID_USERS TRƯỚC KHI DÙNG ← QUAN TRỌNG NHẤT
const VALID_USERS = {
  "phuoc@lifeos.app": "123456",
  "demo@lifeos.app": "demo",
  "admin@gmail.com": "admin123",
  "you@gmail.com": "123123"
};

// API: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (VALID_USERS[email] && VALID_USERS[email] === password) {
    const userData = loadUserData(email);
    res.json({ success: true, user: { email, name: userData.name || email.split('@')[0] } });
  } else {
    res.status(401).json({ error: "Email hoặc mật khẩu sai!" });
  }
});

// API: Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (VALID_USERS[email]) {
    return res.status(400).json({ error: "Email đã tồn tại!" });
  }
  VALID_USERS[email] = password;
  const newUser = { email, name: name || email.split('@')[0], tasks: [], notes: [], goals: [], habits: [], areas: [] };
  saveUserData(email, newUser);
  res.json({ success: true, user: { email, name: newUser.name } });
});

// MIDDLEWARE XÁC THỰC – ĐẶT SAU VALID_USERS
app.use((req, res, next) => {
  const email = req.headers['x-user-email'];
  if (email && VALID_USERS[email]) {
    req.user = { email };
    next();
  } else {
    res.status(401).json({ error: "Chưa đăng nhập" });
  }
});

// API: Load data
app.get('/api/data', (req, res) => {
  const data = loadUserData(req.user.email);
  res.json(data);
});

// API: Save data
app.post('/api/data', (req, res) => {
  saveUserData(req.user.email, { ...req.body, email: req.user.email });
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend Life OS chạy tại http://localhost:${PORT}`);
  console.log(`Dữ liệu lưu tại: ${path.join(__dirname, 'data/users')}`);
});