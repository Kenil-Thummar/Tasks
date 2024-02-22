import { Router } from 'express';
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
    try {
        console.log(req.query);
        res.render("changepassword.ejs", { userid: req.query.userid });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const hashpassword = bcrypt.hashSync(req.body.password, saltRounds);
        await db.query("UPDATE users SET password=$1 WHERE userid=$2", [hashpassword, req.body.userid]);
        res.redirect(`/dashboard?userId=${req.body.userid}&alert=Password has been updated successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
