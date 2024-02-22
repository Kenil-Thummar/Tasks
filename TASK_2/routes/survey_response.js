import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    // Use parameterized query to avoid SQL injection
    let user = await db.query(
      `SELECT u.userid, u.firstname, sq.question, sr.response 
      FROM users u 
      JOIN survey_questions sq ON u.userid = u.userid 
      LEFT JOIN survey_responses sr ON sq.id = sr.question_id AND u.userid = sr.user_id 
      WHERE u.userid = $1;`,
      [req.query.userid]
    );

    // Use parameterized query to avoid SQL injection
    let feeback = await db.query(
      `SELECT surveyresponse, suggestion, email FROM feedback WHERE userid=$1;`,
      [req.query.userid]
    );

    res.render("survey_response.ejs", {
      data: user.rows,
      feedback: feeback.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
