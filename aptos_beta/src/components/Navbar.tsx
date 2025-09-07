"use client";

import { useState } from "react";
import Link from "next/link";
import { WalletSelector } from "@/components/WalletSelector";
import { 
  Users, 
  Building2, 
  Menu, 
  X,
  Search
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Explore",
      href: "/explore",
      icon: Search,
      description: "Discover projects"
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
      description: "Connect with donors"
    },
    {
      name: "Organizations",
      href: "/ngo",
      icon: Building2,
      description: "NGO Dashboard"
    }
  ];

  return (
    <nav className="bg-white border-b  fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="https://t3.ftcdn.net/jpg/15/47/28/08/360_F_1547280886_RZgEekwlWX5zczRqk6sBSbXJ70j9jLBh.jpg" 
              alt="Open Hands Logo" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Open Hands</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors group"
                >
                  <Icon className="h-4 w-4  transition-colors" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <WalletSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-100 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium transition-colors group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 group-hover:text-purple-800 transition-colors" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
