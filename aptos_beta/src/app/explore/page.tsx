"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/explore/ProjectsGrid";
import { SearchAndFilters } from "@/components/explore/SearchAndFilters";
import { ProjectDetailView } from "@/components/explore/ProjectDetailView";
import { ChevronRight, Home } from "lucide-react";

export default function ExplorePage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>("");
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    location: "all",
    fundingRange: "all"
  });

  const handleProjectSelect = (projectId: string, projectTitle: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectTitle(projectTitle);
  };

  const handleBackToExplore = () => {
    setSelectedProjectId(null);
    setSelectedProjectTitle("");
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16">
      <Navbar />
      
      {/* Fixed Breadcrumb Navigation */}
      {selectedProjectId && (
        <div className="bg-white border-b border-purple-100 fixed top-16 left-0 right-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToExplore}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <Home className="h-4 w-4 mr-1" />
                Explore Projects
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate max-w-md">
                {selectedProjectTitle}
              </span>
            </nav>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${selectedProjectId ? 'pt-24' : ''}`}>
        {selectedProjectId ? (
          <ProjectDetailView 
            projectId={selectedProjectId}
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Explore Projects
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Discover transparent charitable projects powered by blockchain technology
              </p>
              
              <SearchAndFilters onFiltersChange={handleFiltersChange} />
            </div>
            
            <ProjectsGrid 
              onProjectSelect={handleProjectSelect}
              filters={filters}
            />
          </>
        )}
      </div>
    </div>
  );
}
