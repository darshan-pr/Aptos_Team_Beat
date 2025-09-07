"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  MapPin, 
  Tag, 
  DollarSign
} from "lucide-react";
import { projectStore } from "@/lib/projectStore";

interface SearchAndFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    category: string;
    location: string;
    fundingRange: string;
  }) => void;
}

export function SearchAndFilters({ onFiltersChange }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [fundingRange, setFundingRange] = useState("all");
  const [projectCount, setProjectCount] = useState(0);

  // Get unique categories and locations from projects
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "poverty", label: "Poverty Alleviation" },
    { value: "disaster", label: "Disaster Relief" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "water", label: "Water & Sanitation" }
  ];

  const [locations, setLocations] = useState([
    { value: "all", label: "All Locations" }
  ]);

  useEffect(() => {
    // Get all projects and update available filters
    const projects = projectStore.getAllProjects();
    setProjectCount(projects.length);

    // Extract unique locations
    const uniqueLocations = [...new Set(projects.map(p => p.location))];
    setLocations([
      { value: "all", label: "All Locations" },
      ...uniqueLocations.map(loc => ({ value: loc.toLowerCase(), label: loc }))
    ]);
  }, []);

  const fundingRanges = [
    { value: "all", label: "Any Amount" },
    { value: "0-1000", label: "$0 - $1,000" },
    { value: "1000-5000", label: "$1,000 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000-50000", label: "$10,000 - $50,000" },
    { value: "50000+", label: "$50,000+" }
  ];

  // Apply filters whenever any filter changes
  useEffect(() => {
    onFiltersChange({
      searchTerm,
      category: selectedCategory,
      location: selectedLocation,
      fundingRange
    });
  }, [searchTerm, selectedCategory, selectedLocation, fundingRange, onFiltersChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setFundingRange("all");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedLocation !== "all" || fundingRange !== "all";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <Label htmlFor="search">Search Projects</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by title, description, or NGO name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category">Category</Label>
          <div className="relative mt-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Funding Range */}
        <div>
          <Label htmlFor="funding">Funding Goal</Label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="funding"
              value={fundingRange}
              onChange={(e) => setFundingRange(e.target.value)}
              className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {fundingRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            {hasActiveFilters ? "Filtering" : "Showing all"} {projectCount} project{projectCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
