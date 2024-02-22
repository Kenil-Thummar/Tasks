import { Router } from 'express';
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = new Router();
const saltRounds = 10;

router.get("/", async (req, res) => {
    try {
        res.render("register.ejs");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', async (req, res) => {
    try {
        const { firstName, middleName, lastName, mobileNumber, email, password } = req.body;

        // Add validation for form data here if needed

        const hashpassword = bcrypt.hashSync(password, saltRounds);

        const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);

        if (checkResult.rows.length > 0) {
            res.redirect('/?alert=User already exists');
        } else {
            await db.query("INSERT INTO users (firstname, middlename, lastname, mobilenumber, email, password) VALUES ($1,$2,$3,$4,$5,$6);", [firstName, middleName, lastName, mobileNumber, email, hashpassword]);
            res.redirect('/?alert=Registration has been done. Now you can login with your credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
