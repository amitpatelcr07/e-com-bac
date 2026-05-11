import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ message: error.message || "Registration failed" });
//   }
// };

import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 generate token
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: token,
    });

    // 📧 send email
    await sendEmail(email, token);

    res.json({
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login data received:", { email });
  try {
    // 1. Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(`correct user h ${user}`);
    // 4. Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin registration with special code
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, adminCode } = req.body;

    // Validate admin code
    const ADMIN_REGISTRATION_CODE =
      process.env.ADMIN_CODE || "ADMIN_SECRET_2026";
    if (adminCode !== ADMIN_REGISTRATION_CODE) {
      return res.status(401).json({
        message: "Invalid admin registration code. Access denied.",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "admin",
      verificationToken: token,
    });

    // Send verification email
    await sendEmail(email, token);

    res.status(201).json({
      message: "Admin registered successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      message: error.message || "Admin registration failed",
    });
  }
};
