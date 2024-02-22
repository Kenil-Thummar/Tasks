import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    let user = await db.query("SELECT * FROM users");
    res.render("admin_dashboard.ejs", { user: user.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
