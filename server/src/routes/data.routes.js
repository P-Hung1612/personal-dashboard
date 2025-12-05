import { Router } from "express";
import {
    getData,
    saveData,
    generateDemoData,
} from "../controllers/data.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getData);
router.post("/", requireAuth, saveData);
router.post("/generate-demo", requireAuth, generateDemoData);

export default router;
