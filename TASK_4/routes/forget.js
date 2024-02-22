import { Router } from "express";
import { forget, forgetPassword } from "../controllers/forget.js";
const router = new Router();

router.route("/").get(forget).post(forgetPassword);

export default router;