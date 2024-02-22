import { Router } from 'express';
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
    try {
        const alertMessage = req.query.alert;
        let result = await db.query("SELECT * FROM users WHERE userid=$1;", [req.query.userId]);
        res.render("dashboard.ejs", { user: result.rows[0], alert: alertMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
