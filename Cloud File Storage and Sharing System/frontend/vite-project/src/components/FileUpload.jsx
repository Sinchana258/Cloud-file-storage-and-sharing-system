import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FileUpload({ onUploaded }) {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("Root");
    const [newFolderName, setNewFolderName] = useState("");
    const dropRef = useRef();

    // Fetch folders dynamically
    const fetchFolders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/folders");
            setFolders(Array.isArray(res.data.folders) ? res.data.folders : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch folders");
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    // Create a new folder
    const createNewFolder = async () => {
        const folderName = newFolderName.trim();
        if (!folderName) return toast.error("Folder name cannot be empty");
        if (folders.includes(folderName)) return toast.error("Folder already exists");

        try {
            const res = await axios.post("http://localhost:5000/folders", { name: folderName });
            toast.success(`Folder "${res.data.name || folderName}" created`);
            setNewFolderName("");
            fetchFolders();
            onUploaded?.();
        } catch (err) {
            console.error(err);
            toast.error("Error creating folder");
        }
    };

    const handleFileChange = (e) => setFiles(Array.from(e.target.files));
    const handleDrop = (e) => { e.preventDefault(); setFiles(Array.from(e.dataTransfer.files)); };
    const handleDragOver = (e) => e.preventDefault();

    // Upload files
    const uploadFiles = async () => {
        if (files.length === 0) return toast.error("Please choose files to upload");

        const folder = selectedFolder || "Root";
        const formData = new FormData();
        formData.append("folder", folder);
        for (let f of files) formData.append("files", f);

        try {
            await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(`Files uploaded to "${folder}" successfully`);
            setFiles([]);
            onUploaded?.();
        } catch (err) {
            console.error(err);
            toast.error("Error uploading files");
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            {/* Create folder */}
            <div className="mb-2 flex space-x-2">
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="border px-2 py-1 rounded"
                />
                <button
                    onClick={createNewFolder}
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                    Create
                </button>
            </div>

            {/* Folder selection */}
            <div className="mb-4 flex items-center space-x-2">
                <label className="font-semibold">Select Folder:</label>
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                >
                    <option value="Root">Root</option>
                    {folders.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            {/* Drag & drop */}
            <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-400 p-6 mb-4 rounded bg-white text-center cursor-pointer hover:bg-gray-50"
            >
                {files.length ? (
                    <ul className="text-left">{files.map((f) => <li key={f.name}>{f.name}</li>)}</ul>
                ) : "Drag & drop files here"}

                <div className="flex justify-center items-center space-x-4 mt-4">
                    <input type="file" multiple id="fileInput" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="fileInput" className="bg-gray-700 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
                        Select Files
                    </label>
                    <button
                        onClick={uploadFiles}
                        disabled={!files.length}
                        className={`px-4 py-2 rounded text-white ${files.length ? "bg-gray-700 hover:bg-gray-500" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
