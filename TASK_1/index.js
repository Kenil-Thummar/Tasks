import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from "nodemailer";
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const handleError = (res, error, message = 'Internal Server Error') => {
    console.error('Error:', error);
    res.status(500).send(message);
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ".jpg");
    }
});

const upload = multer({ storage })

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/register", (req, res) => {
    const alertMessage = req.query.alert;
    res.render('register.ejs', { alertMessage });
});

app.get("/addUser", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", upload.single('profileImage'), async (req, res) => {
    try {
        // Destructuring request body
        const { firstName, middleName, lastName, dob, mobileNumber, email, password } = req.body;

        // Hashing password with bcrypt
        const hashPassword = bcrypt.hashSync(password, saltRounds);

        // Checking if the user already exists in the database
        const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);

        if (checkResult.rows.length > 0) {
            // Redirecting to login page with an alert if the user already exists
            return res.redirect('/login?alert=user already exists');
        } else {
            // Inserting user data into the database
            await db.query("INSERT INTO users (firstname, middlename, lastname, dob, mobilenumber, email, password, profileimage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
                [firstName, middleName, lastName, dob, mobileNumber, email, hashPassword, req.file.filename]);

            // Rendering the login page on successful registration
            return res.render("login.ejs");
        }
    } catch (err) {
        // Handling errors and sending a generic error message
        handleError(res, err, 'Error during user registration');
    }
});

// Function to handle errors and send a response
function handleError(res, err, message) {
    console.error(`${message}: ${err}`);
    res.status(500).send('Internal Server Error');
}

app.get("/login", (req, res) => {
    const alertMessage = req.query.alert;
    res.render('login.ejs', { alertMessage });
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const hash = user.password;

            if (bcrypt.compareSync(password, hash)) {
                sendEmail(email);
                const result = await db.query('SELECT * FROM users');
                const users = result.rows;
                res.render('dashboard.ejs', { users });
            } else {
                res.redirect('/login?alert=invalid Password try again');
            }
        } else {
            res.redirect('/register?alert=user not found you need to register first');
        }
    } catch (err) {
        handleError(res, err, 'Error during user login');
    }
});

function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: 'kenil1919@gmail.com',
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'kenil1919@gmail.com',
        to: email,
        subject: 'Login Successful',
        text: 'You have successfully logged in.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

app.post("/update", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE userid=$1", [req.body.userId]);
        const user = result.rows[0];
        let date = moment(user.dob).utc().format('YYYY-MM-DD')
        res.render("update.ejs", { user, date })
    } catch (err) {
        handleError(res, err, 'Error retrieving user data for update');
    }
});

app.post("/updateUser", upload.single('profileImage'), async (req, res) => {
    try {
        let data = req.body;
        if (data.profileImage == "") {
            delete data.profileImage;
        } else {
            data.profileImage = req.file.filename
        }
        const userId = req.body.userId;
        const updateFields = data;

        const queryParameters = [];
        const setClause = Object.keys(updateFields).map((key, index) => {
            queryParameters.push(updateFields[key]);
            return `${key} = $${index + 1}`;
        }).join(', ');

        await db.query(`UPDATE users SET ${setClause} WHERE userid = $${Object.keys(updateFields).length + 1}`, [...queryParameters, userId]);
        const result = await db.query('SELECT * FROM users');
        const users = result.rows;
        res.render('dashboard.ejs', { users });

    } catch (error) {
        handleError(res, error, 'Error updating user');
    }
});

app.post("/delete", async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE userid = $1;", [req.body.userId]);
        const result = await db.query('SELECT * FROM users');
        const users = result.rows;
        res.render('dashboard.ejs', { users });
    } catch (error) {
        handleError(res, error, 'Error deleting user');
    }
});

app.post("/logout", (req, res) => {
    res.redirect("/")
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
