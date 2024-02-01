import { Router } from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/Authentication.js";
import ProfileController from "../controllers/ProfileController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// profile routes
router.get("/profile", authMiddleware, ProfileController.index); //private route

export default router;
