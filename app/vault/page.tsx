"use client";

import { useWeb3Auth } from "@/context/Web3AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FileUploader } from "@/components/vault/FileUploader";
import { VaultList } from "@/components/vault/VaultList";

export default function VaultPage() {
    const { loggedIn, isReady } = useWeb3Auth();
    const router = useRouter();

    useEffect(() => {
        if (isReady && !loggedIn) {
            router.push("/");
        }
    }, [isReady, loggedIn, router]);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-paper-white flex items-center justify-center">
                <div className="animate-pulse text-oxford-blue font-serif text-xl">Loading Vault...</div>
            </div>
        );
    }

    if (!loggedIn) {
        return null; // Will redirect
    }

    return (
        <main className="min-h-screen bg-paper-white">
            <Navbar />

            <div className="container mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="font-serif text-4xl font-bold text-oxford-blue mb-2">My Vault</h1>
                    <p className="text-text-slate">Securely store and manage access to your most important documents.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Upload */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-grey sticky top-24">
                            <h2 className="font-serif text-xl font-bold text-oxford-blue mb-4">Upload Document</h2>
                            <FileUploader />
                        </div>
                    </div>

                    {/* Right Column: File List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-grey min-h-[500px]">
                            <h2 className="font-serif text-xl font-bold text-oxford-blue mb-6 flex items-center justify-between">
                                <span>Stored Documents</span>
                                <span className="text-xs font-sans font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                    Encrypted on Tableland
                                </span>
                            </h2>
                            <VaultList />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
