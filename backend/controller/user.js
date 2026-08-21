const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. Signup Controller
const userSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already exists. Please Login" });
    }

    const hashPwd = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashPwd
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" } // Good practice: Set token expiration
    );

    // Send status 201 with user info (excluding password)
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 2. Login Controller

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    let user = await User.findOne({ email });
//if the user has logged in it will store its login info till 7days
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email
        }
      });

    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 3. Get User Controller
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ email: user.email, id: user._id });
  } catch (error) {
    return res.status(500).json({ error: "Invalid User ID or server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  getUser
};
