"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, Lock } from "lucide-react";
import { useWeb3Auth } from "@/context/Web3AuthProvider";
import { litManager } from "@/lib/lit";
import { TablelandManager } from "@/lib/tableland";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

export function FileUploader() {
    const { provider, address } = useWeb3Auth();
    const [file, setFile] = useState<File | null>(null);
    const [manualTableName, setManualTableName] = useState("");
    const [showTableInput, setShowTableInput] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("Uncategorized");

    const CATEGORIES = [
        "Uncategorized",
        "Lawyers",
        "Accountants",
        "Realtors",
        "Financial Advisors",
        "Business Consultants"
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    });

    const handleUpload = async () => {
        if (!file || !provider || !address) return;
        setIsUploading(true);
        setStatus("Initializing...");

        try {
            // 1. Get AuthSig (Signature from wallet to prove identity to Lit)
            setStatus("Requesting Signature for Encryption...");

            // We need to manually sign the SIWE message because checkAndSignAuthMessage 
            // defaults to window.ethereum, but we are using Web3Auth.
            const { BrowserProvider } = await import("ethers");
            const { SiweMessage } = await import("siwe");

            const ethersProvider = new BrowserProvider(provider as any);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();

            // Check Network
            const network = await ethersProvider.getNetwork();
            if (network.chainId !== 11155111n) {
                throw new Error("Wrong Network. Please connect to Sepolia.");
            }

            await litManager.connect();
            const nonce = await litManager.client.getLatestBlockhash();

            const siweMessage = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: "I am creating an account to use Lit Protocol at 2025-12-01T12:00:00.000Z", // Lit requires a specific statement sometimes, but let's try standard SIWE
                uri: window.location.origin,
                version: "1",
                chainId: 11155111, // Sepolia
                nonce: nonce,
                expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
            });

            const messageToSign = siweMessage.prepareMessage();
            const signature = await signer.signMessage(messageToSign);

            const authSig = {
                sig: signature,
                derivedVia: "web3.eth.personal.sign",
                signedMessage: messageToSign,
                address: address,
            };

            // 2. Encrypt File
            setStatus("Encrypting File...");
            const { ciphertext, dataToEncryptHash, accessControlConditions } = await litManager.encryptFile(
                file,
                address,
                authSig
            );

            // 3. Sign Metadata with EIP-712
            setStatus("Signing Data (EIP-712)...");
            const { signVaultEntry } = await import("@/lib/eip712");

            const timestamp = new Date().toISOString();
            const vaultEntryData = {
                name: file.name,
                category: category,
                hash: dataToEncryptHash,
                size: file.size.toString(),
                timestamp: timestamp
            };

            const eip712Signature = await signVaultEntry(signer, vaultEntryData);
            console.log("EIP-712 Signature:", eip712Signature);

            // 4. Store Metadata in Tableland
            setStatus("Writing to Tableland Database...");
            // Reuse the same signer/provider we just created
            const db = new TablelandManager(signer);

            // Try to get table name from LocalStorage or Manual Input
            let tableName = localStorage.getItem("vault_table");

            if (!tableName && manualTableName) {
                // Sanitize input in case user pasted the whole log message
                tableName = manualTableName
                    .replace("Vault Table Created:", "")
                    .replace("Vault Table Found:", "")
                    .trim();

                if (tableName) {
                    localStorage.setItem("vault_table", tableName);
                }
            }

            if (!tableName) {
                setStatus("Searching for existing Vault Table...");
                try {
                    const tables = await db.listVaultTables(address);
                    if (tables.length > 0) {
                        tableName = tables[0];
                        localStorage.setItem("vault_table", tableName);
                        console.log("Found existing table:", tableName);
                    } else {
                        // Fallback to manual input if no tables found
                        setShowTableInput(true);
                        setIsUploading(false);
                        setStatus("Could not find a Vault Table. Please enter it manually below.");
                        return;
                    }
                } catch (err) {
                    console.error("Auto-discovery failed:", err);
                    // Fallback to manual input on error
                    setShowTableInput(true);
                    setIsUploading(false);
                    setStatus("Connection Error. Please enter Table Name manually.");
                    return;
                }
            }

            console.log("Writing to table:", tableName);

            // Create a metadata object that includes the filename, hash, AND the EIP-712 signature
            const metadata = JSON.stringify({
                name: file.name,
                hash: dataToEncryptHash,
                type: file.type,
                size: file.size,
                category: category,
                timestamp: timestamp,
                signature: eip712Signature, // Storing the EIP-712 signature
                eip712_data: vaultEntryData // Storing the data that was signed for verification
            });

            // Write to Tableland
            await db.createVaultEntry(tableName, address, metadata);

            setStatus("Success! Document Encrypted, Signed & Stored.");

            // Trigger refresh of VaultList
            window.dispatchEvent(new Event("vault-refresh"));

            alert(`File Securely Stored!\n\nTable: ${tableName}\nHash: ${dataToEncryptHash}`);

        } catch (error) {
            console.error("Upload failed:", error);
            setStatus("Error: " + (error as Error).message);
        } finally {
            if (!showTableInput) {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 bg-white border border-border-grey rounded-md text-sm text-oxford-blue focus:outline-none focus:border-antique-copper"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-antique-copper bg-orange-50' : 'border-slate-300 hover:border-oxford-blue hover:bg-slate-50'}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-antique-copper' : 'text-slate-400'}`} />
                        <p className="text-sm font-medium">
                            {isDragActive ? "Drop it here..." : "Drag & drop a file here"}
                        </p>
                        <p className="text-xs text-slate-400">or click to select (PDF, PNG, JPG)</p>
                    </div>
                </div>
            ) : (
                <div className="border border-border-grey rounded-lg p-4 bg-slate-50 relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setStatus(""); setShowTableInput(false); }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200">
                            <File className="w-5 h-5 text-antique-copper" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-oxford-blue truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                </div>
            )}

            {showTableInput && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                    <p className="font-bold text-yellow-800 mb-2">Table Name Required</p>
                    <p className="mb-2 text-yellow-700">
                        We couldn't automatically find your Vault Table. Please paste it below.
                        (You can find it in the "Trust Section" on the Home Page).
                    </p>
                    <input
                        type="text"
                        placeholder="advice_accord_vault_11155111_..."
                        className="w-full p-2 border border-slate-300 rounded mb-2 font-mono text-xs"
                        value={manualTableName}
                        onChange={(e) => setManualTableName(e.target.value)}
                    />
                    <button
                        onClick={handleUpload}
                        className="bg-oxford-blue text-white px-4 py-2 rounded hover:bg-deep-navy w-full"
                    >
                        Save & Retry Upload
                    </button>
                </div>
            )}

            {status && (
                <div className="text-xs text-center font-mono text-oxford-blue bg-blue-50 p-2 rounded">
                    {status}
                </div>
            )}

            {!showTableInput && (
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                        ${!file || isUploading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-oxford-blue text-white hover:bg-deep-navy shadow-md hover:shadow-lg'
                        }
                    `}
                >
                    {isUploading ? (
                        "Processing..."
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Encrypt & Upload
                        </>
                    )}
                </button>
            )}

            <div className="flex justify-center">
                <button
                    onClick={() => setShowTableInput(!showTableInput)}
                    className="text-[0.65rem] text-slate-400 hover:text-oxford-blue underline decoration-dotted"
                >
                    {showTableInput ? "Hide manual input" : "Manually enter table name"}
                </button>
            </div>

            <p className="text-[0.7rem] text-center text-slate-400">
                Files are encrypted client-side before storage.
            </p>
        </div>
    );
}
