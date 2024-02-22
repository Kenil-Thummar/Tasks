import bcrypt from "bcrypt";
import db from "../config/db.js";


let resetPage = async (req, res) => {
    let userid = req.query.userId;
    let checker = await db.query("SELECT token FROM users WHERE user_id=$1", [
        req.query.userId,
    ]);
    if (checker.rows[0].token == req.query.token) {
        res.render("resetpassword.ejs", {
            userid: userid,
        });
    } else {
        res.redirect("/?alert=Token invalid!");
    }
}

let resetPasssword = async (req, res) => {
    try {
        const saltRounds = 10;
        let hash = await db.query("SELECT password FROM users WHERE user_id=$1", [
            req.body.userId,
        ]);
        if (
            bcrypt.compareSync(req.body.password, hash.rows[0].password) // true
        ) {
            res.redirect(`/?alert=Same as your old password`);
        } else {
            let newpassword = req.body.password;
            const newhash = bcrypt.hashSync(newpassword, saltRounds);
            await db.query("UPDATE users SET password =$1 WHERE user_id=$2", [
                newhash,
                req.body.userId,
            ]);
            res.redirect("/?alert=yourpassword has been updated");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

export { resetPage, resetPasssword }