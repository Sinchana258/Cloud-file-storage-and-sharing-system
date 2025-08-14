// src/controllers/authController.js
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Temporary in-memory store (replace with DB later)
const users = [];

export const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
    };

    users.push(user);

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
    });
};

export const loginUser = (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
    });
};
