
import express from "express"
import { login, logout, me, devLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login)
router.post("/dev-login", devLogin)
router.post("/logout", logout)
router.get("/me", me)

export default router