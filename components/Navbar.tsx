"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, LogOut, User, Wallet, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3Auth } from "@/context/Web3AuthProvider";
import Image from "next/image";

export function Navbar() {
    const { loggedIn, login, logout, userInfo, isReady } = useWeb3Auth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-oxford-blue border-b-2 border-[rgba(205,127,50,0.2)] sticky top-0 z-50 shadow-sm h-[70px] flex items-center">
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
                <Link href="/" className="font-serif text-[1.4rem] font-bold tracking-tight text-white flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-antique-copper" />
                    Advice Accord
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#client-trust"
                        className="text-[0.9rem] font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        The Vault
                    </Link>
                    <Link
                        href="#advisors"
                        className="text-[0.9rem] font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        For Advisors
                    </Link>

                    {loggedIn ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {userInfo?.profileImage ? (
                                    <Image
                                        src={userInfo.profileImage}
                                        alt={userInfo.name || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full border border-slate-700"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <User className="w-4 h-4 text-slate-300" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white leading-none">
                                        {userInfo?.name || "User"}
                                    </span>
                                    <span className="text-[0.7rem] text-slate-400 flex items-center gap-1">
                                        <Wallet className="w-3 h-3" />
                                        Connected
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => login()}
                            disabled={!isReady}
                            className={`bg-white text-oxford-blue px-4 py-2 rounded flex items-center gap-2 text-[0.9rem] transition-colors ${!isReady ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                        >
                            {isReady ? (
                                <>
                                    <LogIn className="w-3.5 h-3.5" />
                                    Sign In
                                </>
                            ) : (
                                "Loading..."
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 bg-oxford-blue border-b border-slate-800 p-6 md:hidden shadow-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="#client-trust"
                                className="text-lg font-medium text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                The Vault
                            </Link>
                            <Link
                                href="#advisors"
                                className="text-lg font-medium text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                For Advisors
                            </Link>
                            {loggedIn ? (
                                <>
                                    <div className="flex items-center gap-3 py-2 border-t border-slate-800 mt-2 pt-4">
                                        {userInfo?.profileImage && (
                                            <Image
                                                src={userInfo.profileImage}
                                                alt={userInfo.name || "User"}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        )}
                                        <span className="font-medium text-white">{userInfo?.name || "User"}</span>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full py-3 text-base font-medium text-red-400 bg-red-900/20 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => login()}
                                    disabled={!isReady}
                                    className={`w-full py-3 text-base font-medium text-oxford-blue bg-white rounded flex items-center justify-center gap-2 ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isReady ? (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </>
                                    ) : (
                                        "Loading..."
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

