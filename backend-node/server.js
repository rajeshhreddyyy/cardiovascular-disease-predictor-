import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({ status: "ok", message: "API and DB connection are healthy." });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Database not reachable.", error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: "Unexpected server error.", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
