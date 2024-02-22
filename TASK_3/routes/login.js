import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("login.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  try {
    if (
      req.body.password == process.env.ADMIN_PASSWORD &&
      req.body.email == process.env.ADMIN_EMAIL
    ) {
      res.redirect(`/admin_panel?alert=Welcome ADMIN`);
    } else {
      const userResult = await db.query("SELECT user_id FROM users WHERE email=$1", [
        req.body.email,
      ]);

      if (userResult.rows.length > 0) {
        const userid = userResult.rows[0].user_id;
        res.redirect(`/user_panel?userid=${userid}`);
      } else {
        res.redirect(`/login?alert=User not found. Please register first.`);
      }
    }
  } catch (err) {
    console.error("Error processing login request:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
