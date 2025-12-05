import { userService } from "../services/user.service.js";

export const login = (req, res) => {
    const { email, password } = req.body;
    const result = userService.login(email, password);
    if (!result)
        return res.status(401).json({ error: "Email hoặc mật khẩu sai!" });
    return res.json({ success: true, user: result });
};

export const register = (req, res) => {
    const { email, password, name } = req.body;
    const result = userService.register(email, password, name);
    if (!result) return res.status(400).json({ error: "Email đã tồn tại!" });
    return res.json({ success: true, user: result });
};
