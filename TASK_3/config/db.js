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


// CREATE TABLE IF NOT EXISTS public.users
//     (
//         user_id integer NOT NULL DEFAULT nextval('users_user_id_seq':: regclass),
//         full_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
//         mobile_number character varying(15) COLLATE pg_catalog."default",
//         email character varying(100) COLLATE pg_catalog."default" NOT NULL,
//         password character varying(255) COLLATE pg_catalog."default" NOT NULL,
//         token character varying(255) COLLATE pg_catalog."default",
//         score integer,
//         CONSTRAINT users_pkey PRIMARY KEY(user_id),
//         CONSTRAINT users_email_key UNIQUE(email)
//     )

// CREATE TABLE IF NOT EXISTS public.questions
//     (
//         id integer NOT NULL DEFAULT nextval('questions_id_seq':: regclass),
//         question_text text COLLATE pg_catalog."default" NOT NULL,
//         options_text text COLLATE pg_catalog."default" NOT NULL,
//         correct_answer character varying(255) COLLATE pg_catalog."default" NOT NULL,
//         CONSTRAINT questions_pkey PRIMARY KEY(id)
//     )

// CREATE TABLE IF NOT EXISTS public.answers
//     (
//         answer_id integer NOT NULL DEFAULT nextval('answers_answer_id_seq':: regclass),
//         user_id integer,
//         question_text text COLLATE pg_catalog."default" NOT NULL,
//         answer_text text COLLATE pg_catalog."default" NOT NULL,
//         CONSTRAINT answers_pkey PRIMARY KEY(answer_id),
//         CONSTRAINT answers_user_id_question_text_key UNIQUE(user_id, question_text)
//     )


export default db;