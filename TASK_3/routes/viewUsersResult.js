import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    let userData = await db.query("SELECT * FROM users");
    let totalUser = userData.rowCount;
    let Questions = await db.query("SELECT question_text FROM questions");
    let totalQuestions = Questions.rowCount;
    let totalscore = totalUser * totalQuestions;
    let score = await db.query("SELECT SUM(score) FROM users;");
    console.log(score.rows[0].sum);
    res.render("viewUsersResult.ejs", {
      userData: userData.rows,
      correct: score.rows[0].sum,
      incorrect: totalscore - score.rows[0].sum,
    });
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
