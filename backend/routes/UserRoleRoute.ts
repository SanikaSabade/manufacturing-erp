import express from "express";
import bcrypt from "bcrypt";
import User from "../models/Admin&Miscellaneous/User";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password_hash,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});
