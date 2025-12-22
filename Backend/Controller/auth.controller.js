import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from "../db.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY_CHANGE_THIS';

// ----------------------------
//        LOGIN
// ----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user by email
    const [rows] = await db.query(
      'SELECT id_user, nom, prenom, email, id_role, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    const user = rows[0];

    // 2. Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id_user: user.id_user, email: user.email, id_role: user.id_role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Return success
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        id_role: user.id_role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
//     CREATE USER
// ----------------------------
export const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, id_role } = req.body;

    if (!nom || !prenom || !email || !password || !id_role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Check if email exists
    const [existing] = await db.query(
      "SELECT id_user FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user
    const [result] = await db.query(
      `INSERT INTO users (nom, prenom, email, password, id_role)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, prenom, email, hashedPassword, id_role]
    );

    // 4. Generate JWT
    const token = jwt.sign(
      { id_user: result.insertId, nom, prenom, email, id_role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Return success
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id_user: result.insertId,
        nom,
        prenom,
        email,
        id_role
      }
    });

  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
