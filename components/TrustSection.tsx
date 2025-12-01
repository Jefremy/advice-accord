"use client";

import { motion } from "framer-motion";
import { useWeb3Auth } from "@/context/Web3AuthProvider";
import { TablelandManager } from "@/lib/tableland";
import { useState } from "react";

export function TrustSection() {
    const { provider, loggedIn } = useWeb3Auth();
    const [isCreating, setIsCreating] = useState(false);
    const [tableInfo, setTableInfo] = useState<string>("");

    const handleInitializeVault = async () => {
        if (!provider) return;
        setIsCreating(true);
        try {
            // Dynamic import to avoid SSR issues with ethers
            const { BrowserProvider } = await import("ethers");
            const ethersProvider = new BrowserProvider(provider as any);
            const signer = await ethersProvider.getSigner();

            const db = new TablelandManager(signer);
            const tableName = await db.createVaultTable();

            // Save to LocalStorage for persistence
            localStorage.setItem("vault_table", tableName);

            setTableInfo(`Vault Table Created: ${tableName}`);
            console.log("Table Created:", tableName);
        } catch (error) {
            console.error("Failed to create table:", error);
            setTableInfo("Error creating table. Check console (and ensure you have Sepolia ETH).");
        } finally {
            setIsCreating(false);
        }
    };

    // Load existing table from local storage
    useState(() => {
        if (typeof window !== "undefined") {
            const savedTable = localStorage.getItem("vault_table");
            if (savedTable) {
                setTableInfo(`Vault Table Found: ${savedTable}`);
            }
        }
    });

    return (
        <section id="client-trust" className="bg-white py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div>
                        <span className="inline-block px-3 py-1 rounded text-xs font-semibold tracking-wider uppercase border border-oxford-blue text-oxford-blue bg-slate-50 mb-4">
                            The Accord Network
                        </span>
                        <h2 className="font-serif text-oxford-blue text-4xl font-bold leading-tight mb-4">
                            One Vault.<br />Trusted Access.
                        </h2>
                        <p className="text-text-slate mb-8 text-lg">
                            Stop emailing sensitive PDFs. The Accord Vault allows you to grant granular, read-only access to your verified professional team.
                        </p>

                        <div className="flex gap-8 mb-8">
                            <div>
                                <h4 className="font-bold text-oxford-blue mb-1">Bank-Grade Encrypt</h4>
                                <p className="text-sm text-text-slate">Secured via Lit Protocol & MPC technology.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-oxford-blue mb-1">Zero Client Cost</h4>
                                <p className="text-sm text-text-slate">Your vault is paid for by your primary advisor.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 items-start">
                            <a href="#" className="text-oxford-blue font-semibold underline decoration-antique-copper underline-offset-4 hover:text-antique-copper transition-colors">
                                See how the permissioning works &rarr;
                            </a>

                            {/* TEMP: Tableland Initialization Button */}
                            {loggedIn && (
                                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg w-full">
                                    <h5 className="font-bold text-sm mb-2">Developer Controls (Beta)</h5>
                                    <button
                                        onClick={handleInitializeVault}
                                        disabled={isCreating}
                                        className="bg-antique-copper text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                        {isCreating ? "Creating Table on Sepolia..." : "Initialize Vault Database"}
                                    </button>
                                    {tableInfo && (
                                        <p className="mt-2 text-xs font-mono text-slate-600 break-all bg-white p-2 border rounded">
                                            {tableInfo}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visual: Stacking Cards */}
                    <div className="relative h-[400px] bg-[radial-gradient(circle,#F8FAFC_0%,#E2E8F0_100%)] rounded-lg border border-border-grey flex items-center justify-center overflow-hidden">

                        {/* Card 1: Lawyer */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-sm border border-border-grey border-t-[3px] border-t-oxford-blue z-20"
                            initial={{ x: -40, y: 40, scale: 0.95, opacity: 0.9 }}
                            whileHover={{ y: 35, zIndex: 30, borderColor: "#CD7F32" }}
                        >
                            <div className="text-xs font-bold text-antique-copper uppercase mb-1">Estate Attorney</div>
                            <h4 className="font-bold text-oxford-blue mb-4">Sarah Jenkins, Esq.</h4>
                            <div className="text-xs text-text-slate flex items-center gap-2">
                                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                                Access Granted: <strong>Will & Trust</strong>
                            </div>
                        </motion.div>

                        {/* Card 2: Accountant (Center Focus) */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-md border border-border-grey border-t-[3px] border-t-oxford-blue z-30"
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            whileHover={{ y: -5, borderColor: "#CD7F32" }}
                        >
                            <div className="text-xs font-bold text-antique-copper uppercase mb-1">Chartered Accountant</div>
                            <h4 className="font-bold text-oxford-blue mb-4">Marcus Lim & Assoc.</h4>
                            <div className="text-xs text-text-slate flex items-center gap-2">
                                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                                Access Granted: <strong>Tax Docs</strong>
                            </div>
                            <div className="mt-4 pt-2 border-t border-dashed border-slate-100 text-[0.65rem] text-slate-400 uppercase tracking-wide">
                                Verified by Google Auth
                            </div>
                        </motion.div>

                        {/* Card 3: Real Estate */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-sm border border-border-grey border-t-[3px] border-t-oxford-blue z-10"
                            initial={{ x: 40, y: -40, scale: 0.95, opacity: 0.9 }}
                            whileHover={{ y: -45, zIndex: 30, borderColor: "#CD7F32" }}
                        >
                            <div className="text-xs font-bold text-antique-copper uppercase mb-1">Commercial Real Estate</div>
                            <h4 className="font-bold text-oxford-blue mb-4">David Wong</h4>
                            <div className="text-xs text-text-slate flex items-center gap-2">
                                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                                Access Granted: <strong>Deeds</strong>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
