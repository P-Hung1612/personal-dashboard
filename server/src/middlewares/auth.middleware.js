import { userService } from "../services/user.service.js";

export const requireAuth = (req, res, next) => {
    const email = req.headers["x-user-email"];

    if (!email || !userService.exists(email)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = { email };
    next();
};
