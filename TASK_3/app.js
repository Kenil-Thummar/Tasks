import express from "express";
import bodyParser from "body-parser";
// import session from "express-session";
import login from "./routes/login.js";
import register from "./routes/register.js";
import admin_panel from "./routes/admin_panel.js";
import forget from "./routes/forget.js";
import resetpassword from "./routes/resetpassword.js";
import user_panel from "./routes/user_panel.js";
import quiz from "./routes/quiz.js";
import viewUsersResult from "./routes/viewUsersResult.js";
import result_page from "./routes/result-page.js";
import emailResult from "./routes/emailResult.js";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/", login);
app.use("/register", register);
app.use("/admin_panel", admin_panel);
app.use("/forget", forget);
app.use("/resetpassword", resetpassword);
app.use("/user_panel", user_panel);
app.use("/quiz", quiz);
app.use("/viewUsersResult", viewUsersResult);
app.use("/result-page", result_page);
app.use("/emailResult", emailResult);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Respond with No Content status code
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
