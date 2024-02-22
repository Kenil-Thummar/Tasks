import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// CREATE TABLE IF NOT EXISTS public.your_table_name(
//     userid integer,
//     work_time timestamp,
//     break_time timestamp,
//     created_date timestamp
// );

export default db;