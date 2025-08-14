// routes/folderRoutes.js
import express from "express";
import { createFolder, listFolders } from "../controllers/folderController.js";

const router = express.Router();

router.post("/", createFolder);
router.get("/", listFolders);

export default router;



