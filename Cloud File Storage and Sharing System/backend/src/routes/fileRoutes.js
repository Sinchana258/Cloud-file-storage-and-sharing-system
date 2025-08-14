// routes/fileRoutes.js
import express from "express";
import upload from "../middleware/upload.js"; // use the existing one
import { uploadFile, listFiles, createShareLink, accessSharedFile, downloadFile, deleteFile, deleteFolder } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.array("files"), uploadFile);
router.get("/files", listFiles);
router.post("/share/:id", createShareLink);
router.get("/share/:linkId", accessSharedFile);
router.get("/download/:key", downloadFile);
router.delete("/files/:id", deleteFile);
router.delete("/folders/:folderName", deleteFolder);

export default router;
