import express from "express";
import formationRoutes from "./Routes/formation.routes.js";
import authRoutes from "./Routes/auth.routes.js";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.routes.js";

import cors from 'cors';
const app = express();
app.use(cors({
  origin: 'http://localhost:4200', // Angular frontend
  credentials: true                // allows cookies/auth headers
}));
app.use(express.json());
dotenv.config();

app.use("/api/User", userRoutes);
app.use("/api", formationRoutes);
app.use('/api/auth', authRoutes);
app.listen(3000, () => console.log("Server running on port 3000"));
