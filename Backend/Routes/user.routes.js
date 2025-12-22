import express from "express";
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser ,
  getRoles
} from "../Controller/user.controller.js";

const router = express.Router();

router.get("/users", getUsers);

router.get("/user/:id", getUserById);

router.put("/user/:id", updateUser);

router.delete("/user/:id", deleteUser);
router.get("/roles", getRoles);
export default router;
