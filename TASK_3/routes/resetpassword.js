import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
  try {
    const userid = req.query.userId;
    const checker = await db.query("SELECT token FROM users WHERE user_id=$1", [
      req.query.userId,
    ]);

    if (checker.rows.length > 0 && checker.rows[0].token === req.query.token) {
      res.render("resetpassword.ejs", {
        userid: userid,
      });
    } else {
      res.redirect("/?alert=Token invalid!");
    }
  } catch (err) {
    console.error("Error processing password reset request:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const hash = await db.query("SELECT password FROM users WHERE user_id=$1", [
      req.body.userId,
    ]);

    if (hash.rows.length > 0 && bcrypt.compareSync(req.body.password, hash.rows[0].password)) {
      res.redirect(`/?alert=Same as your old password`);
    } else {
      const newpassword = req.body.password;
      const newhash = bcrypt.hashSync(newpassword, saltRounds);
      await db.query("UPDATE users SET password =$1 WHERE user_id=$2", [
        newhash,
        req.body.userId,
      ]);
      res.redirect("/?alert=Your password has been updated");
    }
  } catch (err) {
    console.error("Error processing password reset request:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
