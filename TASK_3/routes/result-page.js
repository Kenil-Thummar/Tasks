import { Router } from "express";
import nodemailer from "nodemailer";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const alertMessage = req.query.alert;
    const answerData = await db.query(
      `SELECT questions.correct_answer,answers.answer_text FROM questions JOIN answers ON questions.question_text = answers.question_text WHERE user_id=${req.query.userid};`
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
      `SELECT questions.question_text,questions.correct_answer,answers.answer_text FROM questions JOIN answers ON questions.question_text = answers.question_text WHERE user_id=${req.query.userid};`
    );

    const totalQuestions = await db.query("SELECT question_text FROM questions");

    await db.query("UPDATE users SET score=$1 WHERE user_id=$2;", [
      score,
      req.query.userid,
    ]);

    res.render("result-page.ejs", {
      questions: questions.rows,
      score,
      totalQuestions: totalQuestions.rowCount,
      userid: req.query.userid,
      alertMessage,
    });
  } catch (err) {
    console.error("Error processing quiz results:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const userEmail = await db.query(
      `SELECT email FROM users WHERE user_id=${req.body.userid}`
    );
    const email = userEmail.rows[0].email;
    console.log(email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: "kenil1919@gmail.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const resultlink = `http://localhost:3000/emailResult?userid=${req.body.userid}`;

    const mailOptions = {
      from: "kenil1919@gmail.com",
      to: email,
      subject: "Quiz Result",
      text: `Hello,\n\nClick the following link to view your quiz result:\n${resultlink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.redirect(
          `/result-page?userid=${req.body.userid}&alert=Result has been sent to the user!`
        );
      }
    });
  } catch (err) {
    console.error("Error processing quiz result email:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
