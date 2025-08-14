import mongoose from "mongoose";

const shareLinkSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    linkId: String,
    expiresAt: Date
}, { timestamps: true });

export default mongoose.model("ShareLink", shareLinkSchema);
