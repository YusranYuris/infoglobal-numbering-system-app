import express from "express";
import {
    createUser,
    login
} from "../controllers/userController.js"

const router = express.Router();

// All Routes
router.post("/", createUser);

router.post("/login", login);

export default router;