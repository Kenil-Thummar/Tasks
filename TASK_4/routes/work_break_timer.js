import { Router } from "express";
import { work_break_timer, storingTimeInDatabase } from "../controllers/work_break_timer.js";
const router = new Router();

router.route("/").get(work_break_timer).post(storingTimeInDatabase);

export default router;