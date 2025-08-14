import Folder from "../models/Folder.js"; // Mongoose model
import s3Client from "../config/aws.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Create a new folder
export const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Folder name is required" });

        // Check if folder already exists
        const existing = await Folder.findOne({ name });
        if (existing) return res.status(400).json({ error: "Folder already exists" });

        // Create folder in MongoDB
        const folder = await Folder.create({ name });

        // Create empty "folder" in S3
        const folderKey = `${name}/`;
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: folderKey,
            Body: "",
        }));

        res.status(201).json({ message: "Folder created", name: folder.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create folder" });
    }
};

// List folders
export const listFolders = async (req, res) => {
    try {
        const folders = await Folder.find({}, { name: 1, _id: 0 }); // only get name
        res.json(folders.map(f => f.name));
    } catch (err) {
        console.error("Error fetching folders:", err);
        res.status(500).json({ error: "Failed to list folders" });
    }
};
