import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import { db } from '../config/database'; // Create this file to configure your PostgreSQL database

function initializePassport(passport) {
    const authenticateUser = async(email, password, done) => {
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (result.rows.length > 0) {
                const user = result.rows[0];

                // Compare hashed password
                if (await compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } else {
                return done(null, false, { message: 'User not found' });
            }
        } catch (error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            const user = result.rows[0];
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

export default { initializePassport };