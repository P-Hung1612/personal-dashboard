// server/index.js – PHIÊN BẢN HOÀN HẢO, SẠCH SẼ, KHÔNG LỖI
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

// Danh sách user (chỉ để login, không dùng JWT cũng được vì dev)
const VALID_USERS = {
  "phuoc@lifeos.app": "123456",
  "demo@lifeos.app": "demo",
  "admin@gmail.com": "admin123",
  "you@gmail.com": "123123"
};

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ====================== AUTH ======================
// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (VALID_USERS[email] && VALID_USERS[email] === password) {
    const userData = loadUserData(email);
    return res.json({
      success: true,
      user: { email, name: userData.name || email.split('@')[0] }
    });
  }

  res.status(401).json({ error: "Email hoặc mật khẩu sai!" });
});

// Register – chỉ tạo user rỗng, để frontend tự gen data
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (VALID_USERS[email]) {
    return res.status(400).json({ error: "Email đã tồn tại!" });
  }

  VALID_USERS[email] = password;

  // Tạo file user rỗng
  saveUserData(email, {
    email,
    name: name || email.split('@')[0],
    tasks: null,
    habits: null,
    notes: null,
    goals: null,
    dailyReviews: null,
    overview: null // frontend sẽ tự fill khi tạo demo data
  });

  res.json({
    success: true,
    user: { email, name: name || email.split('@')[0] }
  });
});

// ================== MIDDLEWARE XÁC THỰC ==================
// CHỈ bảo vệ route /api/data, không ảnh hưởng đến /auth/*
const requireAuth = (req, res, next) => {
  const email = req.headers['x-user-email'];

  if (!email || !VALID_USERS[email]) {
    return res.status(401).json({ error: "Unauthorized – thiếu hoặc sai email" });
  }

  req.user = { email };
  next();
};

// ================== DATA ROUTES (có bảo vệ) ==================
app.get('/api/data', requireAuth, (req, res) => {
  const data = loadUserData(req.user.email);

  // Nếu frontend chưa gửi overview → tự tính (tùy chọn, an toàn)
  if (!data.overview) {
    data.overview = generateOverview(data); // bạn có thể thêm hàm này sau nếu muốn
  }

  res.json(data);
});

app.post('/api/data', requireAuth, (req, res) => {
  const dataToSave = {
    ...req.body,
    email: req.user.email,
    name: req.body.name || req.user.email.split('@')[0]
  };

  // Nếu frontend quên gửi overview → để nguyên null (frontend sẽ tự fill)
  saveUserData(req.user.email, dataToSave);
  res.json({ success: true });
});

// (Tùy chọn) Hàm tự tính overview ở backend nếu cần
function generateOverview(data) {
  // Bạn có thể copy hàm từ frontend vào đây nếu muốn backend tự tính
  // Hoặc để null → frontend tự làm (khuyên dùng)
  return null;
}

// ====================== KHỞI ĐỘNG ======================
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend Life OS chạy tại http://localhost:${PORT}`);
  console.log(`Dữ liệu lưu tại: ${path.join(__dirname, 'data/users')}`);
});