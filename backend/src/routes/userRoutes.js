import express from "express";
import {
    createUser,
    login
} from "../controllers/userController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- USERS ROUTES -------

// Create New User
router.post("/", authenticate, createUser);

// Login
router.post("/login", login);

export default router;