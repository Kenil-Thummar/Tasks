import { Router } from "express";
import { register, registerUser } from "../controllers/register.js";
const router = new Router();

router.route("/").get(register).post(registerUser);

export default router;