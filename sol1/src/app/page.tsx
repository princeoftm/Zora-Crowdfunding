import { Play } from 'lucide-react';
import Link from 'next/link'; // ✅ 1. Import the Link component
import ConnectButton from './ConnectButton'; 

export default function Home() {
  return (
    // Main container: Dark background, flexbox for centering, and a subtle background pattern
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-[family-name:var(--font-geist-sans)] text-white relative overflow-hidden">
      {/* Subtle background gradient circles for visual effect */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"></div>

      <div className="z-10 text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center items-center mb-6">
          <div className="bg-white/10 p-4 rounded-full">
            <Play className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Welcome to Pay-Per-View
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400">
          Powered by the Zora Protocol
        </p>

        {/* Action Buttons */}
        <div className="pt-8 flex justify-center items-center space-x-4">
          <ConnectButton />

        <Link href="/mint">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Mint New NFT 🚀
          </button>
        </Link>

          
        </div>
      </div>
    </main>
  );
}


