import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const userdata = await db.query(
      `SELECT * FROM users WHERE user_id=${req.query.userid}`
    );
    console.log(userdata.rows);
    res.render("user_panel.ejs", { user: userdata.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  // If there's nothing specific to do in the POST route, you can leave it empty.
  // If you have specific functionality, add it here.
  // For example, you might handle form submissions or other actions.
});

export default router;
