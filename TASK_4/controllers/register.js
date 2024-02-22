import bcrypt from "bcrypt";
import db from "../config/db.js";

const register = async (req, res) => {
    const alertMessage = req.query.alert;
    res.render("register.ejs", { alertMessage });
};

const registerUser = async (req, res) => {
    try {
        // Basic input validation
        if (!req.body.fullName || !req.body.mobileNumber || !req.body.email || !req.body.password) {
            return res.redirect("/?alert=Please provide all required information for registration");
        }

        const saltRounds = 10;
        const hash = bcrypt.hashSync(req.body.password, saltRounds);

        await db.query(
            "INSERT INTO users (full_name, mobile_number, email, password) VALUES ($1, $2, $3, $4);",
            [req.body.fullName, req.body.mobileNumber, req.body.email, hash]
        );

        res.redirect(
            "/?alert=Registration has been done successfully. Now you can login with your credentials!"
        );
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Internal Server Error");
    }
};

export { register, registerUser };
