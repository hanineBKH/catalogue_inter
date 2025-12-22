import express from 'express';
import { login,createUser } from '../Controller/auth.controller.js';
import { verifyToken } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/check", verifyToken, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});
router.post('/login', login);
router.post('/create', createUser);
export default router;
