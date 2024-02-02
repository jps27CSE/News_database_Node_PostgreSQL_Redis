import { Router } from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/Authentication.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// profile routes
router.get("/profile", authMiddleware, ProfileController.index); //private route
router.put("/profile/:id", authMiddleware, ProfileController.update); //private route

// news routes
router.get("/news", NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
