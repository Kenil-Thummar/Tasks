import db from "../config/db.js";

const work_break_timer = async (req, res) => {
    res.render("work_break_timer.ejs", { userid: req.query.userid });
};

const storingTimeInDatabase = async (req, res) => {
    try {
        console.log(req.body);
        await db.query(
            "INSERT INTO PunchInPunchOut (userid, work_time, break_time) VALUES ($1, $2, $3)",
            [req.body.userid, req.body.currentTime, req.body.breakTime]
        );
        res.redirect("/?alert=Your time has been successfully stored");
    } catch (err) {
        console.error("Error storing time in the database:", err);
        res.status(500).send("Internal Server Error");
    }
};

export { work_break_timer, storingTimeInDatabase };
