const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");

const pool = require("../dbConfig");

exports.getHome = (req, res, next) => {
	if (req.isAuthenticated()){
		res.redirect('/dashboard');
	} else{
		res.render("index", {
			pageTitle: "User Authentication",
		});
	}
};

exports.getLogin = (req, res, next) => {
	if(req.isAuthenticated()){
		res.redirect('/dashboard');
	} else{
		res.render("login", {
			pageTitle: "Login",
		});
	}
};

exports.getSignup = (req, res, next) => {
	if(req.isAuthenticated()){
		res.redirect('/dashboard');
	} else{
		res.render("signup", {
			pageTitle: "Sign Up",
		});
	}
};

exports.getDashboard = (req, res, next) => {
	if (!req.isAuthenticated()){
		res.redirect('/login');
	} else{
			res.render("dashboard", {
			pageTitle: "Dashboard",
			userName: req.user.name,
		});
	}
};

exports.getLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      throw err;
    }
  });
  req.flash("success_msg", "You have been logged out");
  res.redirect("/login");
};

exports.postSignup = async (req, res, next) => {
  let { name, email, password, repeatPassword } = req.body;

  const errors = [];
  // input validation
  if (password.length < 6) {
    errors.push({
      message: "Password should be at least 6 characters long",
    });
  }

  if (password !== repeatPassword) {
    errors.push({
      message: "Passwords do not match",
    });
  }

  if (errors.length > 0) {
    return res.render("signup", {
      pageTitle: "Sign Up",
      errors: errors,
    });
  }

  let hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    "SELECT COUNT(*) FROM users WHERE email = $1",
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      // results.rows[0].countss
      if (results.rows[0].count !== "0") {
        errors.push({
          message: "Email already registered",
        });
        res.render("signup", {
          errors: errors,
          pageTitle: "Sign Up",
        });
      } else {
        pool.query(
          `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3) RETURNING id
                        `,
          [name, email, hashedPassword],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "You are now registered, Please Login");
            res.redirect("/login");
          }
        );
      }
    }
  );
};
