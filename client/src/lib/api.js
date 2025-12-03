// src/lib/api.js – PHIÊN BẢN HOÀN CHỈNH 100% (copy-paste đè lên file cũ)
const BACKEND_URL = 'http://localhost:4000/api';

let backendAlive = null;
let lastCheck = 0;

const checkBackend = async () => {
    if (backendAlive !== null && Date.now() - lastCheck < 10000) return backendAlive;
    try {
        const res = await fetch(`${BACKEND_URL}/health`);
        backendAlive = res.ok;
    } catch {
        backendAlive = false;
    }
    lastCheck = Date.now();
    return backendAlive;
};

// HÀM ĐĂNG NHẬP
export const loginWithBackend = async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
    return data;
};

// HÀM ĐĂNG KÝ – BẮT BUỘC PHẢI CÓ export!!!
export const registerWithBackend = async (email, password, name) => {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
    return data;
};

// LOAD + SAVE DATA (dùng chung cho toàn app)
export const loadData = async (email) => {
    const useBackend = await checkBackend();
    if (!useBackend || !email) {
        const saved = localStorage.getItem('lifeos_data');
        return saved ? JSON.parse(saved) : null;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/data`, {
            headers: { 'x-user-email': email },
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error('Load backend lỗi → dùng LocalStorage');
        const saved = localStorage.getItem('lifeos_data');
        return saved ? JSON.parse(saved) : null;
    }
    return null;
};

let saveTimeout;
export const saveData = async (data) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        const useBackend = await checkBackend();
        if (!useBackend) {
            localStorage.setItem('lifeos_data', JSON.stringify(data));
            return;
        }
        try {
            await fetch(`${BACKEND_URL}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': data.email,
                },
                body: JSON.stringify(data),
            });
        } catch (err) {
            console.error('Backend lỗi → fallback LocalStorage');
            localStorage.setItem('lifeos_data', JSON.stringify(data));
        }
    }, 1500);
};