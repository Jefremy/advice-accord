"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-black dark:bg-white rounded-lg group-hover:scale-105 transition-transform">
                        <Shield className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Advice Accord
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#network"
                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Network
                    </Link>
                    <Link
                        href="#security"
                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Security
                    </Link>
                    <button className="px-5 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-600 dark:text-zinc-400"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 p-6 md:hidden shadow-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="#features"
                                className="text-lg font-medium text-zinc-900 dark:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#network"
                                className="text-lg font-medium text-zinc-900 dark:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Network
                            </Link>
                            <Link
                                href="#security"
                                className="text-lg font-medium text-zinc-900 dark:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Security
                            </Link>
                            <button className="w-full py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
