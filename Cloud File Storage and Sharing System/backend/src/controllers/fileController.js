import crypto from "crypto";
import File from "../models/file.js";
import ShareLink from "../models/shareLink.js";
import {
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";
import s3Client from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 📌 Upload file with folder support
export const uploadFile = async (req, res) => {
    try {
        if (!req.files?.length) return res.status(400).json({ error: "No files uploaded" });

        // Determine folder
        const folder = req.body.folder && req.body.folder !== "Root" ? req.body.folder : null;

        const uploadedFiles = [];
        for (const file of req.files) {
            const fileKey = folder
                ? `${folder}/${Date.now()}-${file.originalname}`
                : `${Date.now()}-${file.originalname}`;

            // Upload to S3
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));

            // Save metadata to MongoDB
            const dbFile = await File.create({
                filename: file.originalname,
                key: fileKey,
                folder: folder || "Root",
                size: file.size,
                mimetype: file.mimetype,
            });

            uploadedFiles.push(dbFile);
        }

        res.status(201).json({ message: "Files uploaded successfully", files: uploadedFiles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "File upload failed" });
    }
};

// 📌 List files and folders
export const listFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });

        const folderSet = new Set();
        files.forEach(file => folderSet.add(file.folder || "Root"));

        res.json({
            folders: Array.from(folderSet).sort(),
            files
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch files" });
    }
};

// 📌 Download file
export const downloadFile = async (req, res) => {
    try {
        const { key } = req.params;
        const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        res.redirect(url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not download file" });
    }
};

// 📌 Delete file
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: file.key }));
        await File.findByIdAndDelete(req.params.id);

        res.json({ message: "File deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not delete file" });
    }
};

// 📌 Delete folder
export const deleteFolder = async (req, res) => {
    const { folderName } = req.params;
    if (!folderName) return res.status(400).json({ error: "Folder name is required" });

    try {
        const listResponse = await s3Client.send(
            new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET_NAME, Prefix: `${folderName}/` })
        );

        const deleteObjects = (listResponse.Contents || []).map(file => ({ Key: file.Key }));
        if (deleteObjects.length > 0) {
            await s3Client.send(new DeleteObjectsCommand({ Bucket: process.env.S3_BUCKET_NAME, Delete: { Objects: deleteObjects } }));
        }

        await File.deleteMany({ key: { $regex: `^${folderName}/` } });
        res.json({ message: `Folder '${folderName}' and its contents deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete folder" });
    }
};

// 📌 Create share link
export const createShareLink = async (req, res) => {
    try {
        const { expiresInHours } = req.body;
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        const linkId = crypto.randomBytes(8).toString("hex");
        const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

        await ShareLink.create({ file: file._id, linkId, expiresAt });

        res.json({ message: "Share link created", link: `${process.env.BASE_URL}/share/${linkId}`, expiresAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create share link" });
    }
};

// 📌 Access shared file
export const accessSharedFile = async (req, res) => {
    try {
        const { linkId } = req.params;
        const shareLink = await ShareLink.findOne({ linkId }).populate("file");
        if (!shareLink) return res.status(404).send("Invalid link");
        if (shareLink.expiresAt < Date.now()) return res.status(410).send("Link expired");

        const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: shareLink.file.key }), { expiresIn: 3600 });
        res.redirect(url);
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not access shared file");
    }
};
