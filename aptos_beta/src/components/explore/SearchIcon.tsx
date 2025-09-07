"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchIcon() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="relative">
      {!isSearchOpen ? (
        <button
          onClick={handleSearchToggle}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Open search"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 focus:ring-0 min-w-64"
            autoFocus
          />
          <button
            onClick={handleSearchToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}
