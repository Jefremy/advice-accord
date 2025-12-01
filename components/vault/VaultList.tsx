"use client";

import { FileText, MoreVertical, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "@/context/Web3AuthProvider";
import { TablelandManager, VaultSchema } from "@/lib/tableland";

export function VaultList() {
    const { provider, address } = useWeb3Auth();
    const [files, setFiles] = useState<VaultSchema[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("All");

    const CATEGORIES = [
        "All",
        "Lawyers",
        "Accountants",
        "Realtors",
        "Financial Advisors",
        "Business Consultants",
        "Uncategorized"
    ];

    const handleDelete = async (id: number) => {
        if (!provider || !address || isDeleting) return;

        if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const tableName = localStorage.getItem("vault_table");
            if (!tableName) return;

            const { BrowserProvider } = await import("ethers");
            const ethersProvider = new BrowserProvider(provider as any);
            const network = await ethersProvider.getNetwork();

            if (network.chainId !== 11155111n) {
                alert("Please switch to Sepolia network to delete files.");
                setIsDeleting(false);
                return;
            }

            const signer = await ethersProvider.getSigner();
            const db = new TablelandManager(signer);

            console.log(`Deleting file ${id} from ${tableName}...`);
            await db.deleteVaultEntry(tableName, id);

            // Refresh list
            setOpenMenuId(null);
            fetchFiles();
        } catch (err: any) {
            console.error("Error deleting file:", err);
            alert(`Failed to delete file: ${err.message || err}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchFiles = async () => {
        if (!provider || !address) return;
        setIsLoading(true);
        setError("");

        try {
            const tableName = localStorage.getItem("vault_table");
            console.log("VaultList: Fetching from table:", tableName);
            console.log("VaultList: Using address:", address);

            if (!tableName) {
                console.log("VaultList: No table name found.");
                setIsLoading(false);
                return; // No table yet
            }

            // We can use a read-only connection if we don't have a signer, 
            // but since we have the provider, let's use it.
            const { BrowserProvider } = await import("ethers");
            const ethersProvider = new BrowserProvider(provider as any);
            const signer = await ethersProvider.getSigner();

            const db = new TablelandManager(signer);
            const results = await db.getVaultsByOwner(tableName, address);

            console.log("VaultList: Results:", results);

            // Sort by newest first
            setFiles(results.sort((a, b) => b.created_at - a.created_at));

        } catch (err) {
            console.error("Error fetching vault:", err);
            setError("Failed to load documents.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (provider && address) {
            fetchFiles();
        }
    }, [provider, address]);

    // Listen for a custom event to refresh the list (triggered by FileUploader)
    useEffect(() => {
        const handleRefresh = () => {
            console.log("VaultList: Refresh event received");
            fetchFiles();
        };
        window.addEventListener("vault-refresh", handleRefresh);
        return () => window.removeEventListener("vault-refresh", handleRefresh);
    }, [provider, address]);

    // Filter files based on active tab
    const filteredFiles = files.filter(file => {
        if (activeTab === "All") return true;

        try {
            if (typeof file.encrypted_metadata === 'string' && file.encrypted_metadata.startsWith("{")) {
                const metadata = JSON.parse(file.encrypted_metadata);
                // If the file has a category, match it. 
                // If activeTab is "Uncategorized", match if category is missing or "Uncategorized"
                if (activeTab === "Uncategorized") {
                    return !metadata.category || metadata.category === "Uncategorized";
                }
                return metadata.category === activeTab;
            }
        } catch (e) {
            // If parsing fails, it's uncategorized
            return activeTab === "Uncategorized";
        }
        return activeTab === "Uncategorized";
    });

    if (isLoading) {
        return (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-antique-copper" />
                <p>Loading your vault...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center text-red-400">
                <p>{error}</p>
                <button onClick={fetchFiles} className="text-sm underline mt-2">Try Again</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap
                                ${activeTab === cat
                                    ? 'bg-oxford-blue text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={fetchFiles}
                    className="text-xs text-slate-400 hover:text-oxford-blue flex items-center gap-1 shrink-0"
                >
                    <RefreshCw className="w-3 h-3" /> Refresh
                </button>
            </div>

            {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    <p>No documents found in {activeTab}.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-border-grey">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-border-grey">
                            <tr>
                                <th className="px-4 py-3">Document</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Uploaded</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-grey bg-white">
                            {filteredFiles.map((file) => {
                                // Try to parse the metadata as JSON
                                let fileName = `Doc #${file.id}`;
                                let fileHash: string | any = file.encrypted_metadata;
                                let fileSize = "";
                                let fileCategory = "Uncategorized";

                                try {
                                    let metadata: any = null;

                                    if (typeof file.encrypted_metadata === 'object' && file.encrypted_metadata !== null) {
                                        metadata = file.encrypted_metadata;
                                    } else if (typeof file.encrypted_metadata === 'string' && file.encrypted_metadata.startsWith("{")) {
                                        metadata = JSON.parse(file.encrypted_metadata);
                                    }

                                    if (metadata) {
                                        if (metadata.name) fileName = metadata.name;
                                        if (metadata.hash) fileHash = String(metadata.hash);
                                        if (metadata.size) fileSize = (metadata.size / 1024 / 1024).toFixed(2) + " MB";
                                        if (metadata.category) fileCategory = metadata.category;
                                    }
                                } catch (e) {
                                    // Not JSON or error parsing, treat as raw hash
                                    if (typeof fileHash !== 'string') {
                                        fileHash = JSON.stringify(fileHash);
                                    }
                                }

                                // Final safety check for rendering
                                const displayHash = typeof fileHash === 'string' ? fileHash : JSON.stringify(fileHash);

                                return (
                                    <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <p className="font-medium text-oxford-blue truncate" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                    <div className="flex gap-2 text-xs text-slate-400">
                                                        {fileSize && <span>{fileSize}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                                {fileCategory}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(file.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                                                className="p-2 text-slate-400 hover:text-oxford-blue transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {openMenuId === file.id && (
                                                <div className="absolute right-8 top-8 w-32 bg-white rounded-md shadow-lg border border-border-grey z-10 overflow-hidden">
                                                    <button
                                                        onClick={() => handleDelete(file.id)}
                                                        disabled={isDeleting}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
