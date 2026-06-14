import express from "express";
import { getUserHistory, savePatientRecord } from "../controllers/patientController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, savePatientRecord);
router.get("/history", verifyToken, getUserHistory);

export default router;
