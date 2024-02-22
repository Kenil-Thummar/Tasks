import express from "express";
import bodyParser from "body-parser";
// import session from "express-session";
import login from "./routes/login.js";
import register from "./routes/register.js";
import forget from "./routes/forget.js";
import resetpassword from "./routes/resetpassword.js";
import work_break_timer from "./routes/work_break_timer.js";

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
app.use("/work_break_timer", work_break_timer)

app.get("/favicon.ico", (req, res) => {
    res.status(204).end(); // Respond with No Content status code
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});