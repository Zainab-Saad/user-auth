const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const pool = require("./dbConfig");

// initialize local strategy
const initialize = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        pool.query(
          `SELECT * FROM users WHERE email = $1`,
          [email],
          (err, results) => {
            if (err) {
              throw err;
            }
            if (results.rows.length > 0) {
              const users = results.rows[0];
              bcrypt.compare(password, users.password, (err, isMatch) => {
                if (err) {
                  throw err;
                }
                if (isMatch) {
                  // pass err = null, user (to store in session cookie)
                  return done(null, users);
                } else {
                  return done(null, false, {
                    message: "Password is not correct",
                  });
                }
              });
            } else {
              return done(null, false, { message: "Email is not registered" });
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      } else {
        return done(null, results.rows[0]);
      }
    });
  });
};
module.exports = initialize;
