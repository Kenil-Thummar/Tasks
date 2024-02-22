import { Router } from "express";
import { resetPage, resetPasssword } from "../controllers/resetpassword.js";
const router = new Router();

router.route("/").get(resetPage).post(resetPasssword);

export default router;