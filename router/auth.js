import express from "express";
import { loginUser, keepLogin } from "../controller/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/keeplogin", keepLogin);

export default router;
