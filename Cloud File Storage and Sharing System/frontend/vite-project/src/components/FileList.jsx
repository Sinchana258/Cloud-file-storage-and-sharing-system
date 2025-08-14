import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FileList({ refreshTrigger }) {
    const [fileList, setFileList] = useState([]);
    const [foldersState, setFoldersState] = useState([]);
    const [shareLinks, setShareLinks] = useState({});
    const [openFolders, setOpenFolders] = useState({});

    // Fetch files from backend
    const fetchFiles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/files");
            setFileList(Array.isArray(res.data.files) ? res.data.files : []);
        } catch (err) {
            console.error(err);
            setFileList([]);
            toast.error("Error fetching files");
        }
    };

    // Fetch folders dynamically from backend
    const fetchFolders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/folders"); // backend endpoint that returns all folder names
            setFoldersState(Array.isArray(res.data.folders) ? res.data.folders : []);
        } catch (err) {
            console.error(err);
            setFoldersState([]);
            toast.error("Error fetching folders");
        }
    };

    useEffect(() => {
        fetchFiles();
        fetchFolders();
    }, [refreshTrigger]);

    const toggleFolder = (folder) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folder]: !prev[folder],
        }));
    };

    const handleDownload = (key) =>
        window.open(`http://localhost:5000/download/${key}`, "_blank");

    const handleShare = async (id) => {
        try {
            const res = await axios.post(`http://localhost:5000/share/${id}`, {
                expiresInHours: 1,
            });
            setShareLinks((prev) => ({ ...prev, [id]: res.data.link }));
            toast.success("Shareable link generated!");
        } catch {
            toast.error("Could not create shareable link");
        }
    };

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
    };

    const handleDeleteFile = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/files/${id}`);
            toast.success(res.data.message || "File deleted successfully!");
            fetchFiles();
        } catch (err) {
            toast.error(err.response?.data?.error || "Could not delete file");
        }
    };

    const handleDeleteFolder = async (folderName) => {
        if (!window.confirm(`Are you sure you want to delete folder "${folderName}"?`))
            return;

        try {
            const res = await axios.delete(`http://localhost:5000/folders/${folderName}`);
            toast.success(res.data.message || `Folder "${folderName}" deleted`);

            // Refresh both folders and files from backend
            fetchFolders();
            fetchFiles();
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to delete folder "${folderName}"`);
        }
    };

    // Prepare files grouped by folder
    const validFolders = ["Root", ...foldersState.filter((f) => f && f !== "Root")];
    const filesByFolder = validFolders.reduce((acc, folder) => {
        acc[folder] = fileList.filter(
            (file) =>
                (folder === "Root" && (!file.folder || file.folder === "Root")) ||
                file.folder === folder
        );
        return acc;
    }, {});

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            {validFolders.map((folder) => (
                <div key={folder} className="mb-6 border rounded">
                    {/* Folder header */}
                    <div
                        className="bg-gray-200 px-4 py-2 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleFolder(folder)}
                    >
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{folder}</h3>
                            <span>{openFolders[folder] ? "▲" : "▼"}</span>
                        </div>
                        {folder !== "Root" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(folder);
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Files table */}
                    {openFolders[folder] && (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">File Name</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filesByFolder[folder]?.length ? (
                                    filesByFolder[folder].map((file) => (
                                        <React.Fragment key={file._id}>
                                            <tr className="border-t">
                                                <td className="p-2">{file.filename}</td>
                                                <td className="p-2 flex space-x-2">
                                                    <button
                                                        onClick={() => handleDownload(file.key)}
                                                        className="bg-gray-700 hover:bg-gray-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Download
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare(file._id)}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                                    >
                                                        Share Link
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFile(file._id)}
                                                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                            {shareLinks[file._id] && (
                                                <tr>
                                                    <td colSpan="2" className="p-2 bg-gray-100 flex items-center space-x-2">
                                                        <a
                                                            href={shareLinks[file._id]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 text-blue-600 underline truncate"
                                                        >
                                                            {shareLinks[file._id]}
                                                        </a>
                                                        <button
                                                            onClick={() => handleCopy(shareLinks[file._id])}
                                                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                                                        >
                                                            Copy
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="p-2 text-center text-gray-500">
                                            No files
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    );
}
