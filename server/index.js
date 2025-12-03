// server/index.js – ĐÃ SỬA 100%, CHẠY NGON NGAY
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadUserData, saveUserData } from './storage.js';
import { faker } from '@faker-js/faker';

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

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
  // Tạo dữ liệu mẫu siêu đẹp bằng Faker
  const fakeTasks = Array.from({ length: 15 }, () => ({
    id: faker.string.uuid(),
    title: faker.hacker.phrase().replace(/^./, str => str.toUpperCase()),
    completed: faker.datatype.boolean({ probability: 0.3 }),
    dueDate: faker.date.soon({ days: 14 }).toISOString().split('T')[0],
    tags: faker.helpers.arrayElements(['work', 'personal', 'urgent', 'health', 'learning'], { min: 0, max: 3 })
  }));

  const fakeNotes = Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    content: faker.lorem.paragraphs({ min: 1, max: 4 }),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    tags: faker.helpers.arrayElements(['idea', 'journal', 'meeting', 'book'], { min: 1, max: 2 })
  }));

  const fakeGoals = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    progress: faker.number.int({ min: 10, max: 90 }),
    deadline: faker.date.future({ years: 2 }).toISOString().split('T')[0],
    category: faker.helpers.arrayElement(['career', 'health', 'finance', 'relationship', 'learning'])
  }));

  const fakeHabits = Array.from({ length: 7 }, () => ({
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Uống 2 lít nước', 'Đọc sách 30p', 'Tập gym', 'Thiền 10p', 'Viết nhật ký', 'Ngủ trước 11h', 'Học 1 kỹ năng mới']),
    streak: faker.number.int({ min: 0, max: 120 }),
    completedToday: faker.datatype.boolean({ probability: 0.7 })
  }));

  const newUserData = {
    email,
    name: name || email.split('@')[0],
    tasks: fakeTasks,
    notes: fakeNotes,
    goals: fakeGoals,
    habits: fakeHabits,
    areas: ["Work", "Personal", "Health", "Learning"]
  };

  saveUserData(email, newUserData);
  res.json({ success: true, user: { email, name: newUserData.name } });
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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend Life OS chạy tại http://localhost:${PORT}`);
  console.log(`Dữ liệu lưu tại: ${path.join(__dirname, 'data/users')}`);
});