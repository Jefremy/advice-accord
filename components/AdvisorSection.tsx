"use client";

export function AdvisorSection() {
    return (
        <section id="advisors" className="bg-oxford-blue text-white py-16 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-[700px] mx-auto mb-12">
                    <span className="inline-block bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] px-3 py-1 rounded text-xs uppercase tracking-widest font-semibold mb-4">
                        For Advisors
                    </span>
                    <h2 className="text-[2.2rem] font-bold font-serif text-white mb-2">
                        The "Reverse SaaS" Model.
                    </h2>
                    <p className="text-[#94A3B8] text-base">
                        We view software as a utility, not a liability. Advice Accord removes the friction of monthly subscriptions, replacing it with a high-margin, pay-per-success infrastructure.
                    </p>
                </div>

                {/* Dense Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]">

                    {/* Block 1: Pricing */}
                    <div className="bg-deep-navy p-8 hover:bg-[#0F1623] transition-colors">
                        <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">Transparency</h3>
                        <p className="text-[#94A3B8] text-[0.9rem] mb-6">
                            No hidden "per-seat" costs. You only pay when value is delivered to the client.
                        </p>

                        <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] py-3 text-[0.9rem]">
                            <span>Monthly Fixed Cost</span>
                            <span className="text-antique-copper font-semibold font-sans">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] py-3 text-[0.9rem]">
                            <span>Client Vault Access</span>
                            <span className="text-antique-copper font-semibold font-sans">FREE</span>
                        </div>
                        <div className="flex justify-between items-center py-3 text-[0.9rem]">
                            <span>Per Generated Report</span>
                            <span className="text-antique-copper font-semibold font-sans">$3.00</span>
                        </div>
                    </div>

                    {/* Block 2: Retention */}
                    <div className="bg-deep-navy p-8 hover:bg-[#0F1623] transition-colors">
                        <h3 className="font-serif text-xl font-bold text-white mb-4">The Golden Handcuff</h3>
                        <p className="text-[#94A3B8] text-[0.9rem] mb-6">
                            By providing the "Accord Vault" to your clients, you become the central node in their financial network. Firing you means losing their organized digital legacy.
                        </p>
                        <div className="mt-8 border border-[rgba(255,255,255,0.2)] p-4 rounded text-center">
                            <span className="text-[2rem] font-bold block text-white">98%</span>
                            <span className="text-[0.75rem] uppercase tracking-widest text-antique-copper">Projected Retention</span>
                        </div>
                    </div>

                    {/* Block 3: Security */}
                    <div className="bg-deep-navy p-8 hover:bg-[#0F1623] transition-colors">
                        <h3 className="font-serif text-xl font-bold text-white mb-4">Auditable Trust</h3>
                        <p className="text-[#94A3B8] text-[0.9rem] mb-6">
                            Every permission grant is recorded. Your clients own their data keys; you facilitate the organization.
                        </p>
                        <ul className="p-0 list-none mt-4 text-[#CBD5E1] text-[0.9rem] space-y-2">
                            <li className="flex gap-2.5">
                                <span className="text-success-green">✓</span> SOC2 Compliant Infrastructure
                            </li>
                            <li className="flex gap-2.5">
                                <span className="text-success-green">✓</span> Lit Protocol Encryption
                            </li>
                            <li className="flex gap-2.5">
                                <span className="text-success-green">✓</span> Google Auth Integration
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="text-center mt-12">
                    <button className="bg-white border border-[#DADCE0] text-[#3C4043] px-6 py-3 rounded font-medium inline-flex items-center gap-3 shadow-sm hover:shadow-md hover:bg-[#F8FAFC] transition-all">
                        Start Advisor Trial with Google
                    </button>
                </div>

            </div>
        </section>
    );
}
