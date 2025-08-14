import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
// Load env variables
dotenv.config();

// Create app instance FIRST
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", fileRoutes);
app.use("/folders", folderRoutes);


// DB connection

connectDB()
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});









