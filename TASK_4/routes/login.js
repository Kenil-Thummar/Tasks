import { Router } from "express";
import { loginpage, authenticateUser } from "../controllers/login.js";
const router = new Router();

router.route("/").get(loginpage).post(authenticateUser);

export default router;
