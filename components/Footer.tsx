export function Footer() {
    return (
        <footer className="bg-white py-8 border-t border-border-grey text-[0.85rem] text-text-slate">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div>
                    <strong className="text-oxford-blue">Advice Accord.</strong>
                    <span className="ml-4 text-[#94A3B8]">&copy; 2025</span>
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
