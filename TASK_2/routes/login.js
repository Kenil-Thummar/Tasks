import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.get("/", async (req, res) => {
  try {
    const alertMessage = req.query.alert;
    res.render("login.ejs", { alertMessage });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    if (enteredPassword == ADMIN_PASSWORD && enteredEmail == ADMIN_EMAIL) {
      res.redirect(`/admin?alert=Welcome ADMIN`);
      return;
    }

    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      enteredEmail,
    ]);

    if (result.rows.length === 0) {
      res.redirect("/?alert=User not found. You need to register first.");
      return;
    }

    const user = result.rows[0];

    if (bcrypt.compareSync(enteredPassword, user.password)) {
      res.redirect(`/dashboard?userId=${user.userid}`);
    } else {
      res.redirect("/?alert=Password invalid. Try again.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
