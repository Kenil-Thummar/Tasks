import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const quizData = await db.query("SELECT * FROM questions;");
    console.log(req.query);
    res.render("quiz.ejs", {
      questions: quizData.rows,
      userid: req.query.userid,
    });
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const userid = req.body.userid;
    const userData = req.body;
    delete userData.userid;

    for (const [key, value] of Object.entries(userData)) {
      const query =
        "INSERT INTO answers (user_id, question_text, answer_text) VALUES ($1,$2,$3) ON CONFLICT (user_id, question_text) DO UPDATE SET answer_text = $3;";
      const values = [userid, key, value];
      await db.query(query, values);
    }

    const answerData = await db.query(
      `SELECT questions.correct_answer,answers.answer_text FROM questions JOIN answers ON questions.question_text = answers.question_text WHERE user_id=${userid};`
    );

    const answers = answerData.rows;
    let score = 0;

    // Loop through each answer
    answers.forEach((answer) => {
      // Check if the answer_text matches the correct_answer
      if (answer.answer_text === answer.correct_answer) {
        // Increase the score if the answer is correct
        score++;
      }
    });

    await db.query("UPDATE users SET score=$1 WHERE user_id=$2;", [
      score,
      userid,
    ]);

    res.redirect(
      `/user_panel?userid=${userid}&alert=Quiz is completed. Thank you for taking the Quiz!!!`
    );
  } catch (err) {
    console.error("Error processing quiz submission:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
