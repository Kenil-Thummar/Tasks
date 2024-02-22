import { Router } from "express";
import nodemailer from "nodemailer";
import db from "../config/db.js";
import crypto from "crypto";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("forget.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  const email = req.body.email;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: "kenil1919@gmail.com",
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      const resetToken = crypto.randomBytes(20).toString("hex");

      await db.query("UPDATE users SET token =$1 WHERE email=$2", [
        resetToken,
        email,
      ]);

      const resetLink = `http://localhost:3000/resetpassword?userId=${user.user_id}&token=${resetToken}`;

      const mailOptions = {
        from: "kenil1919@gmail.com",
        to: email,
        subject: "Reset Password",
        text: `Hello ${user.full_name},\n\nClick the following link to reset your password:\n${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email");
        } else {
          console.log("Email sent:", info.response);
          res.redirect(
            "/?alert=Check your email a reset link has been sent to you!"
          );
        }
      });
    } else {
      res.redirect("/?alert=User not found. You need to register first.");
    }
  } catch (err) {
    console.error("Error processing password reset request:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
