import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustSection } from "@/components/TrustSection";
import { AdvisorSection } from "@/components/AdvisorSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper-white selection:bg-antique-copper selection:text-white">
      <Navbar />
      <Hero />
      <TrustSection />
      <AdvisorSection />
      <Footer />
    </main>
  );
}
