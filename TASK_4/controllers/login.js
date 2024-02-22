import bcrypt from "bcrypt";
import db from "../config/db.js";

const loginpage = async (req, res) => {
    const alertMessage = req.query.alert;
    res.render("login.ejs", { alertMessage });
};

const authenticateUser = async (req, res) => {
    try {
        const authenticationData = await db.query(
            "SELECT * FROM users WHERE email=$1", [req.body.email]
        );

        if (authenticationData.rowCount === 0) {
            res.redirect(`/?alert=Invalid user. Register yourself first`);
        } else {
            const user = authenticationData.rows[0];
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.redirect(`/work_break_timer?userid=${user.user_id}`);
            } else {
                res.redirect(`/?alert=Wrong password`);
            }
        }
    } catch (err) {
        console.error("Error authenticating user:", err);
        res.status(500).send("Internal Server Error");
    }
};

export { loginpage, authenticateUser };