import express from "express";
import {
    createUser,
    login
} from "../controllers/userController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All Routes
router.post("/", authenticate, createUser);

router.post("/login", login);

export default router;