import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("admin_panel.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  try {
    const adminData = Object.values(req.body);
    await db.query(
      "INSERT INTO questions (question_text, options_text, correct_answer) VALUES ($1, $2, $3);",
      adminData
    );
    res.redirect(`/admin_panel?alert=Question added successfully!`);
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
