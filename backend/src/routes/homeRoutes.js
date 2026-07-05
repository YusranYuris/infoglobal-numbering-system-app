import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getAllEngineeringData } from "../controllers/homeController.js";

const router = express.Router();

// ------- HOME ROUTES ROUTES -------

// Get All Engineering Data
router.get("/", authenticate, getAllEngineeringData);

export default router;