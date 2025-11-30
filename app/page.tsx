import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <Navbar />
      <Hero />

      {/* Placeholder for other sections */}
      <div id="features" className="h-screen bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center">
        <p className="text-zinc-500">Features Section (Coming Soon)</p>
      </div>
      <div id="network" className="h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500">Network Section (Coming Soon)</p>
      </div>
    </main>
  );
}
