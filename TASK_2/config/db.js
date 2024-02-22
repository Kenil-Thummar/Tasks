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

// CREATE TABLE IF NOT EXISTS feedback
//     (
//         id integer NOT NULL DEFAULT ,
//         userid integer UNIQUE,
//         surveyresponse character varying(50) NOT NULL,
//         suggestion text,
//         email character varying(100) NOT NULL,
//         CONSTRAINT feedback_pkey PRIMARY KEY(id),
//         CONSTRAINT feedback_userid_key UNIQUE(userid)
//     );

// CREATE TABLE IF NOT EXISTS public.survey_questions
//     (
//         id integer NOT NULL DEFAULT nextval('survey_questions_id_seq':: regclass),
//         question text COLLATE pg_catalog."default" NOT NULL,
//         options text COLLATE pg_catalog."default" NOT NULL,
//         type character varying(20) COLLATE pg_catalog."default" NOT NULL,
//         CONSTRAINT survey_questions_pkey PRIMARY KEY(id)
//     )

// CREATE TABLE IF NOT EXISTS public.survey_responses
//     (
//         id integer NOT NULL DEFAULT nextval('survey_responses_id_seq':: regclass),
//         user_id integer,
//         question_id integer,
//         response text COLLATE pg_catalog."default" NOT NULL,
//         CONSTRAINT survey_responses_pkey PRIMARY KEY(id),
//         UNIQUE(question_id,user_id)
//     )

// CREATE TABLE IF NOT EXISTS public.users
//     (
//         userid integer NOT NULL DEFAULT nextval('users_userid_seq':: regclass),
//         firstname character varying(50) COLLATE pg_catalog."default" NOT NULL,
//         middlename character varying(50) COLLATE pg_catalog."default",
//         lastname character varying(50) COLLATE pg_catalog."default" NOT NULL,
//         mobilenumber character varying(15) COLLATE pg_catalog."default",
//         email character varying(100) COLLATE pg_catalog."default" NOT NULL,
//         password character varying(255) COLLATE pg_catalog."default" NOT NULL,
//         token character varying(255) COLLATE pg_catalog."default",
//         CONSTRAINT users_pkey PRIMARY KEY(userid),
//         CONSTRAINT users_email_key UNIQUE(email)
//     )

export default db;