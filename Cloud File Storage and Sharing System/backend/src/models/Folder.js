// models/Folder.js
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });


export default mongoose.model("Folder", folderSchema);
