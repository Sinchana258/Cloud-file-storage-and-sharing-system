// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // Keep files in memory for S3 upload
const upload = multer({ storage });

export default upload;
