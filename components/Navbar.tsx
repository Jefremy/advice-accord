"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b-[3px] border-antique-copper sticky top-0 z-50 shadow-sm h-[70px] flex items-center">
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
                <Link href="/" className="font-serif text-[1.4rem] font-bold tracking-tight text-oxford-blue">
                    Advice Accord.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#client-trust"
                        className="text-[0.9rem] font-medium text-text-slate hover:text-oxford-blue transition-colors"
                    >
                        The Vault
                    </Link>
                    <Link
                        href="#advisors"
                        className="text-[0.9rem] font-medium text-text-slate hover:text-oxford-blue transition-colors"
                    >
                        For Advisors
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full border border-border-grey"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-paper-white flex items-center justify-center border border-border-grey">
                                        <User className="w-4 h-4 text-text-slate" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-oxford-blue">
                                    {session.user?.name}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-text-slate hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="bg-oxford-blue text-white px-4 py-2 rounded flex items-center gap-2 text-[0.9rem] hover:bg-deep-navy transition-colors"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-text-slate"
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
                        className="absolute top-full left-0 right-0 bg-white border-b border-border-grey p-6 md:hidden shadow-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="#client-trust"
                                className="text-lg font-medium text-oxford-blue"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                The Vault
                            </Link>
                            <Link
                                href="#advisors"
                                className="text-lg font-medium text-oxford-blue"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                For Advisors
                            </Link>
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 py-2 border-t border-border-grey mt-2 pt-4">
                                        {session.user?.image && (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        )}
                                        <span className="font-medium text-oxford-blue">{session.user?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full py-3 text-base font-medium text-red-500 bg-red-50 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="w-full py-3 text-base font-medium text-white bg-oxford-blue rounded flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

