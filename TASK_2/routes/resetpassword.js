import { Router } from 'express';
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = new Router();
let saltRounds = 10;

router.get("/", async (req, res) => {
    try {
        let userid = req.query.userId;
        let checker = await db.query("SELECT token FROM users WHERE userid=$1", [req.query.userId]);

        if (checker.rows[0].token == req.query.token) {
            res.render("resetpassword.ejs", {
                userid: userid
            });
        } else {
            res.redirect("/?alert=Token error!");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/", async (req, res) => {
    try {
        let newpassword = req.body.password;

        // Add validation for form data here if needed

        const hashpassword = bcrypt.hashSync(newpassword, saltRounds);
        await db.query("UPDATE users SET password =$1 WHERE userid=$2", [hashpassword, req.body.userId]);
        res.redirect("/?alert=Your password has been updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
