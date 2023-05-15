const express = require("express");
const router = express.Router();

// DB
const mongoose = require("mongoose");

// User
const User = require("../models/User.model");

// Password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Route access
const isLoggedOut = require("../middleware/isLoggedOut");

// Home page
router.get("/", (req, res, next) => {
  res.render("public/home", {logged: req.session.currentUser});
});

// Signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("public/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("public/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("public/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  // Checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("public/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(500)
          .render("public/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("public/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// Login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("public/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  // Check that email and password are provided
  if (email === "" || password === "") {
    res.status(400).render("public/login", {
      errorMessage:
        "All fields are mandatory. Please provide email and password.",
    });

    return;
  }

  // Length based parameters to check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("public/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found
      if (!user) {
        res
          .status(400)
          .render("public/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found
      bcrypt.compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("public/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

module.exports = router;
