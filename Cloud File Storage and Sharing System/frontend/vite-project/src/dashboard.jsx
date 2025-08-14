import React, { useEffect, useState, useRef } from "react";
import FileList from "./components/FileList";
import FileUpload from "./components/FileUpload";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [folders, setFolders] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0); // increment to trigger refresh
    const fetchedRef = useRef(false); // prevent double fetch in dev

    const fetchFolders = async () => {
        try {
            const res = await fetch("http://localhost:5000/folders");
            if (!res.ok) throw new Error("Failed to fetch folders");
            const data = await res.json();
            setFolders(data);
        } catch (err) {
            console.error(err);
            toast.error("Error fetching folders");
        }
    };

    useEffect(() => {
        if (fetchedRef.current) return; // skip second StrictMode mount
        fetchedRef.current = true;
        fetchFolders();
    }, []);

    // Function to trigger a refresh from child components
    const triggerRefresh = () => setRefreshCount(prev => prev + 1);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-700 text-white p-4 flex-shrink-0">
                <h1 className="text-2xl font-bold mb-6">Cloud Storage</h1>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-600 transition">
                                Dashboard
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-600 transition">
                                My Files
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-3 py-2 rounded hover:bg-gray-600 transition">
                                Shared with Me
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Cloud File Storage</h2>

                {/* Upload Section */}
                <div className="mb-6">
                    <FileUpload
                        folders={folders}
                        setFolders={setFolders}
                        onUploaded={triggerRefresh} // increment counter
                    />
                </div>

                {/* File List */}
                <FileList
                    folders={folders}
                    refreshTrigger={refreshCount} // use counter for refresh
                />
            </main>
        </div>
    );
}
