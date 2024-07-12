import express from "express";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../services/database.js";

dotenv.config();

const router = express.Router();

// LOGIN;
router.route("/log-in").post(async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const sqlQueryExecutor = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [usernameOrEmail]
  );
  const user =
    sqlQueryExecutor.rows.length > 0 ? sqlQueryExecutor.rows[0] : null;

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          username: user.username,
          password: user.password,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.json({ status: "ok", token: token, user: user.username });
    } else {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid credentials" });
    }
  } else {
    return res.json({
      status: "error",
      message: "Username or email not found",
    });
  }
});

// SIGNUP;
router.route("/sign-up").post(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      const existingUser = userCheck.rows[0];
      if (existingUser.username === username) {
        return res.status(409).json({
          success: false,
          message: "Username is already in use",
        });
      }
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    const encryptedPassword = await bcrypt.hash(password, 15);

    const sqlQueryExecutor = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, encryptedPassword]
    );
    const createdUser = sqlQueryExecutor.rows[0];
    console.log(createdUser);
    res.status(201).json({ success: true, data: createdUser });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
