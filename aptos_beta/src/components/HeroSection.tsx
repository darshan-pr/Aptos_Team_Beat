"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-white via-purple-50/40 to-white py-24 md:py-32 overflow-hidden">
      {/* Dynamic Background with Noise Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient noise pattern similar to attached image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Animated noise texture */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '400px 400px'
          }}
        />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full opacity-80 animate-ping animation-delay-1000" />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-500 rounded-full opacity-70 animate-ping animation-delay-2000" />
        
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-3000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-10 blur-3xl animate-pulse animation-delay-1500" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 px-6 py-2 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Sparkles className="h-4 w-4" />
            Blockchain-Powered Transparency
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight font-[var(--font-playfair)]">
            Giving you the power to see, trust, and transform
            <span className="block bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent mt-2 font-[var(--font-playfair)]">
              every donation 
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-[var(--font-inter)]">
            Open Hands ensures full transparency and accountability in charitable donations 
            through smart contracts, milestone-based releases, and community verification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 ">
            <Link href="/explore">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/ngo">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg  border-2 border-purple-600 text-purple-600   rounded-xl shadow-lg  transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm">
                Create Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 hover:bg-white/80 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 font-[var(--font-playfair)]">$2.5M+</div>
            <div className="text-gray-600 font-medium font-[var(--font-inter)]">Total Donations</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 hover:bg-white/80 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 font-[var(--font-playfair)]">150+</div>
            <div className="text-gray-600 font-medium font-[var(--font-inter)]">Active Projects</div>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 hover:bg-white/80 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 font-[var(--font-playfair)]">50+</div>
            <div className="text-gray-600 font-medium font-[var(--font-inter)]">Verified NGOs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
