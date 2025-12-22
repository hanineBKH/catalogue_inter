import { db } from "../db.js";

// GET ALL USERS with ROLE LABEL
export const getUsers = async (req, res) => {
  try {
    const sql = `
      SELECT u.id_user, u.nom, u.prenom, u.email, r.libelle AS role
      FROM users u
      JOIN roles r ON u.id_role = r.id_role
    `;
    
    const [rows] = await db.query(sql); // ✅ no callback
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT u.id_user, u.nom, u.prenom, u.email, r.libelle AS role
      FROM users u
      JOIN roles r ON u.id_role = r.id_role
      WHERE u.id_user = ?
    `;
    const [rows] = await db.query(sql, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, id_role } = req.body;
    const sql = `
      UPDATE users
      SET nom = ?, prenom = ?, email = ?, id_role = ?
      WHERE id_user = ?
    `;
    await db.query(sql, [nom, prenom, email, id_role, id]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE id_user = ?`;
    await db.query(sql, [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getRoles = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM roles");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
