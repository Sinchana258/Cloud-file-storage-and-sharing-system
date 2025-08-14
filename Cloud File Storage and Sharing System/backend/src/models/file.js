import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: String,
    key: String,
    size: Number,
    mimetype: String
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
