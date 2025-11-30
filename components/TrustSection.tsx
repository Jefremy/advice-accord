"use client";

import { motion } from "framer-motion";

export function TrustSection() {
    return (
        <section id="client-trust" className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div>
                        <span className="inline-block border border-oxford-blue text-oxford-blue bg-[#F1F5F9] px-3 py-1 rounded text-xs uppercase tracking-widest font-semibold mb-4">
                            The Accord Network
                        </span>
                        <h2 className="text-[2.5rem] font-bold font-serif text-oxford-blue leading-tight mb-2">
                            One Vault.<br />Trusted Access.
                        </h2>
                        <p className="text-text-slate mb-8 text-base">
                            Stop emailing sensitive PDFs. The Accord Vault allows you to grant granular, read-only access to your verified professional team.
                        </p>

                        <div className="flex gap-8 mb-8">
                            <div>
                                <h4 className="font-serif font-bold text-oxford-blue m-0">Bank-Grade Encrypt</h4>
                                <p className="text-[0.85rem] text-text-slate mt-1">Secured via Lit Protocol & MPC technology.</p>
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-oxford-blue m-0">Zero Client Cost</h4>
                                <p className="text-[0.85rem] text-text-slate mt-1">Your vault is paid for by your primary advisor.</p>
                            </div>
                        </div>

                        <a href="#" className="text-oxford-blue font-semibold underline decoration-antique-copper hover:text-deep-navy transition-colors">
                            See how the permissioning works &rarr;
                        </a>
                    </div>

                    {/* Visual: Stacking Cards */}
                    <div className="relative h-[400px] bg-[radial-gradient(circle,#F8FAFC_0%,#E2E8F0_100%)] rounded-lg border border-border-grey flex items-center justify-center">

                        {/* Card 1: Lawyer */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-sm border border-border-grey border-t-[3px] border-t-oxford-blue cursor-default hover:-translate-y-1 hover:shadow-md hover:border-t-antique-copper hover:z-10 transition-all duration-300"
                            style={{ transform: "translate(-40px, 40px) scale(0.95)", zIndex: 4, opacity: 0.9 }}
                        >
                            <div className="text-xs text-antique-copper uppercase font-semibold mb-1">Estate Attorney</div>
                            <h4 className="font-serif font-bold text-base mb-4">Sarah Jenkins, Esq.</h4>
                            <div className="flex items-center gap-1.5 text-[0.8rem] text-text-slate">
                                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                                Access Granted: <strong>Will & Trust</strong>
                            </div>
                        </motion.div>

                        {/* Card 2: Accountant (Center Focus) */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-sm border border-border-grey border-t-[3px] border-t-oxford-blue cursor-default hover:-translate-y-1 hover:shadow-md hover:border-t-antique-copper hover:z-10 transition-all duration-300"
                            style={{ zIndex: 5 }}
                        >
                            <div className="text-xs text-antique-copper uppercase font-semibold mb-1">Chartered Accountant</div>
                            <h4 className="font-serif font-bold text-base mb-4">Marcus Lim & Assoc.</h4>
                            <div className="flex items-center gap-1.5 text-[0.8rem] text-text-slate mb-4">
                                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                                Access Granted: <strong>Tax Docs</strong>
                            </div>
                            <div className="pt-2 border-t border-dashed border-[#eee] text-[0.7rem] text-[#999] uppercase tracking-wide">
                                Verified by Google Auth
                            </div>
                        </motion.div>

                        {/* Card 3: Real Estate */}
                        <motion.div
                            className="absolute bg-white w-[260px] p-6 rounded-md shadow-sm border border-border-grey border-t-[3px] border-t-oxford-blue cursor-default hover:-translate-y-1 hover:shadow-md hover:border-t-antique-copper hover:z-10 transition-all duration-300"
                            style={{ transform: "translate(40px, -40px) scale(0.95)", zIndex: 3, opacity: 0.9 }}
                        >
                            <div className="text-xs text-antique-copper uppercase font-semibold mb-1">Commercial Real Estate</div>
                            <h4 className="font-serif font-bold text-base mb-4">David Wong</h4>
                            <div className="flex items-center gap-1.5 text-[0.8rem] text-text-slate">
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
