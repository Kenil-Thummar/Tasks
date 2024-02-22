import express from "express";
import bodyParser from "body-parser";
// import session from "express-session";
import login from "./routes/login.js";
import register from "./routes/register.js";
import forget from "./routes/forget.js";
import resetpassword from "./routes/resetpassword.js";
import dashboard from "./routes/dashboard.js";
import changepassword from "./routes/changepassword.js";
import admin from "./routes/admin.js";
import survey from "./routes/survey.js";
import admin_dashboard from "./routes/admin_dashboard.js";
import survey_response from "./routes/survey_response.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/", login);
app.use("/register", register);
app.use("/forget", forget);
app.use("/resetpassword", resetpassword);
app.use("/dashboard", dashboard);
app.use("/changepassword", changepassword);
app.use("/admin", admin);
app.use("/survey", survey);
app.use("/admin_dashboard", admin_dashboard);
app.use("/survey_response", survey_response);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Respond with No Content status code
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
