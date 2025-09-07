"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-16">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/20 to-white" />
        
        {/* Animated background patterns */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 60%),
              radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 60%),
              radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 80%)
            `,
          }}
        />
        
        {/* Floating noise pattern */}
        <div 
          className="absolute inset-0 opacity-10 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px'
          }}
        />
      </div>
      
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      
      {/* Call to Action Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Make a Transparent Impact?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of donors and NGOs who trust blockchain technology 
            to ensure every donation creates real change.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/explore"
              className="bg-white text-purple-700 px-10 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Projects
            </a>
            <a
              href="/ngo"
              className="border-2 border-white text-white px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your NGO Project
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="https://t4.ftcdn.net/jpg/04/34/24/97/360_F_434249726_Wt33ccJAgjX8PCsRXFiIWBT9jeJGpXJC.jpg" 
                  alt="Open Hands Logo" 
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Open Hands</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transparent charity powered by Aptos blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-300">Platform</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="/explore" className="hover:text-purple-300 transition-colors">Explore Projects</a></li>
                <li><a href="/community" className="hover:text-purple-300 transition-colors">Community</a></li>
                <li><a href="/ngo" className="hover:text-purple-300 transition-colors">For NGOs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-300">Resources</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-purple-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-300">Legal</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-purple-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Open Hands. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
