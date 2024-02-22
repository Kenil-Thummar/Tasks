import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    console.log("This is running");
    console.log(req.query);

    const answerData = await db.query(
      `SELECT questions.correct_answer, answers.answer_text FROM questions JOIN answers ON questions.question_text = answers.question_text WHERE user_id=${req.query.userid};`
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

    const questions = await db.query(
      `SELECT questions.question_text, questions.correct_answer, answers.answer_text FROM questions JOIN answers ON questions.question_text = answers.question_text WHERE user_id=${req.query.userid};`
    );

    const totalQuestions = await db.query("SELECT question_text FROM questions");

    // Print the final score
    console.log("Final Score:", score);

    res.render("emailResult.ejs", {
      questions: questions.rows,
      score,
      totalQuestions: totalQuestions.rowCount,
      userid: req.query.userid,
    });
  } catch (err) {
    console.error("Error processing quiz results:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
