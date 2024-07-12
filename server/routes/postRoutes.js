import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import pool from "../services/database.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// GET ALL POSTS
router.route("/").get(authToken, async (req, res) => {
  try {
    const sqlQueryExecutor = await pool.query("SELECT * FROM posts");
    const posts = sqlQueryExecutor.rows;

    res
      .status(200)
      .json({ success: true, data: posts, user: req.user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// CREATE A POST
router.route("/").post(authToken, async (req, res) => {
  try {
    const { prompt, photo, name } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    
    const sqlQueryExecutor = await pool.query(
      "INSERT INTO posts (creator, prompt, photo_url) VALUES ($1, $2, $3)",
      [req.user.username, prompt, photoUrl.url]
    );
    const newPost = sqlQueryExecutor.rows[0];

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// DELETE A POST
router.route("/:id").delete(async (req, res) => {
  try {
    const id = req.params.id;
    const postToDelete = await pool.query(`DELETE FROM posts WHERE id = ${id}`);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Item not found" });
  }
});

export default router;
