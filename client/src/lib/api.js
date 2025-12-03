// src/lib/api.js
// Cầu nối thông minh: tự động dùng backend nếu chạy, không thì về LocalStorage

const BACKEND_URL = 'http://localhost:4000/api';

// Kiểm tra backend có sống không (chỉ check 1 lần mỗi 10 giây)
let backendAlive = null;
let lastCheck = 0;

const checkBackend = async () => {
    if (backendAlive !== null && Date.now() - lastCheck < 10000) {
        return backendAlive;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
        backendAlive = res.ok;
    } catch {
        backendAlive = false;
    }
    lastCheck = Date.now();
    return backendAlive;
};

// Lưu dữ liệu
export const saveData = async (data) => {
    const useBackend = await checkBackend();

    if (!useBackend) {
        // Dùng LocalStorage nếu backend tắt
        localStorage.setItem('lifeos_data', JSON.stringify(data));
        console.log('Lưu bằng LocalStorage (backend offline)');
        return;
    }

    // Dùng backend thật
    try {
        await fetch(`${BACKEND_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': data.email,
            },
            body: JSON.stringify(data),
        });
        console.log('Lưu thành công lên backend!');
    } catch (err) {
        console.error('Lỗi lưu lên backend:', err);
        // Fallback về LocalStorage nếu backend lỗi
        localStorage.setItem('lifeos_data', JSON.stringify(data));
    }
};

// Load dữ liệu
export const loadData = async (email) => {
    const useBackend = await checkBackend();

    if (!useBackend || !email) {
        // Dùng LocalStorage
        const saved = localStorage.getItem('lifeos_data');
        console.log('Load từ LocalStorage');
        return saved ? JSON.parse(saved) : null;
    }

    try {
        const res = await fetch(`${BACKEND_URL}/data`, {
            headers: { 'x-user-email': email },
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Load thành công từ backend!');
            return data;
        } else {
            throw new Error('Backend trả lỗi');
        }
    } catch (err) {
        console.error('Lỗi load từ backend → dùng LocalStorage:', err);
        const saved = localStorage.getItem('lifeos_data');
        return saved ? JSON.parse(saved) : null;
    }
};

// Đăng nhập (gọi API backend)
export const loginWithBackend = async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Đăng nhập thất bại');
    }

    return await res.json();
};

// Đăng ký
export const registerWithBackend = async (email, password, name) => {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Đăng ký thất bại');
    }

    return await res.json();
};