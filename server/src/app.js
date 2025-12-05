import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/data.routes.js";

export const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Route modules
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
