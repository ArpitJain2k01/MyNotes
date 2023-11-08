const express = require("express");
const User = require("../Models/User.model");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser= require('../Middleware/FetchUser')


//JWT secure key
const JWT_SECURE_KEY = "arpitjain2k01";

//Route 1: create user using POST => "/api/auth/createuser" => no login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").notEmpty(),
    body("username", "Enter a valid username").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be minimum 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //if we find any error then display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: result.array() });
    }

    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ error: "username already exist!" });
      }
  
      user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "email already exist!" });
      }
  
      //Generating a salt using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
  
      user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: securePassword,
      });
  
      //using id as index to get the userdata
      const data = {
        user: {
          id: user.id,
        },
      };
  
      //Creating an authtoken and sending it to the db
      const authToken = jwt.sign(data, JWT_SECURE_KEY);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error")
    }
  }
);

// Route 2: Authenticating user => "/api/auth/login"
router.post(
  "/login",
  [body("password", "Password cannot be blank").exists()],
  async (req, res) => {
    //if we find any error then display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: result.array() });
    }

    const { username, password } = req.body;

    try {
      //Trying to find user with given username
      let user = await User.findOne({ username });

      //if user doesnot exists
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }

      //else compare password
      const passwordCompare = await bcrypt.compare(password, user.password);

      //if wrong password then
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }

      //else
      //using id as index to get the userdata
      const data = {
        user: {
          id: user.id,
        },
      };

      //Creating an authtoken and sending it to the db
      const authToken = jwt.sign(data, JWT_SECURE_KEY);
      res.json({ authToken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error")
    }
  }
);

// Route 3: Get loggedin users details => "/api/auth/getuser" & login is required
router.post("/getuser",fetchUser, async (req, res) => {
  try {
    const userID= req.user.id;
    const user= await User.findById(userID).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error")
  }
})

module.exports = router;
