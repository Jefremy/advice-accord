import { Link } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white py-8 border-t border-border-grey text-[0.85rem] text-text-slate">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <strong className="text-oxford-blue flex items-center gap-2 font-serif text-lg">
                        <Link className="w-5 h-5 text-antique-copper" />
                        Advice Accord
                    </strong>
                    <span className="ml-2 text-[#94A3B8]">&copy; 2025</span>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-oxford-blue transition-colors">Security</a>
                    <a href="#" className="hover:text-oxford-blue transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-oxford-blue transition-colors">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}
