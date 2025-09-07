"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectStore, type Project } from "@/lib/projectStore";
import { 
  MapPin, 
  Users, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign
} from "lucide-react";

interface ProjectsGridProps {
  onProjectSelect: (projectId: string, projectTitle: string) => void;
  filters?: {
    searchTerm: string;
    category: string;
    location: string;
    fundingRange: string;
  };
}

export function ProjectsGrid({ onProjectSelect, filters }: ProjectsGridProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load projects from the store
    const allProjects = projectStore.getActiveProjects();
    setProjects(allProjects);
  }, []);

  // Apply filters whenever projects or filters change
  useEffect(() => {
    let filtered = [...projects];

    if (filters) {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.organizationName.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower)
        );
      }

      // Location filter
      if (filters.location !== "all") {
        filtered = filtered.filter(project =>
          project.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Funding range filter
      if (filters.fundingRange !== "all") {
        const [min, max] = filters.fundingRange.split("-").map(v => parseInt(v.replace("+", "")));
        filtered = filtered.filter(project => {
          if (filters.fundingRange === "50000+") {
            return project.targetAmount >= 50000;
          } else if (max) {
            return project.targetAmount >= min && project.targetAmount <= max;
          } else {
            return project.targetAmount >= min;
          }
        });
      }
    }

    setFilteredProjects(filtered);
  }, [projects, filters]);

  const getTotalEscrowForProject = (project: Project) => {
    return project.milestones.reduce((total, milestone) => {
      return total + projectStore.getTotalEscrowForMilestone(project.id, milestone.id);
    }, 0);
  };

  const getProgressPercentage = (escrowTotal: number, project: Project) => {
    // DISPLAY RULES: On the Explore page, the initial total target amount for the project 
    // must be followed as same like current one... The updated, reduced target amount should 
    // be shown only after the "active" button
    return Math.min(100, Math.round((escrowTotal / project.targetAmount) * 100));
  };

  const getCompletedMilestones = (milestones: Project['milestones']) => {
    return milestones.filter(m => m.isCompleted).length;
  };

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "most-funded":
        return getTotalEscrowForProject(b) - getTotalEscrowForProject(a);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Header and Sorting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {sortedProjects.length} Project{sortedProjects.length !== 1 ? 's' : ''} Available
          </h2>
          <p className="text-gray-600">All projects are verified and blockchain-secured</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="most-funded">Most Funded</option>
            <option value="most-donors">Most Donors</option>
            <option value="urgent">Most Urgent</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {sortedProjects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 overflow-hidden hover:border-l-purple-700"
            onClick={() => onProjectSelect(project.id, project.title)}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Project Image */}
              <div className="lg:w-80 h-48 lg:h-auto flex-shrink-0">
                <img
                  src={project.images[0]?.url || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>

              {/* Project Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                        Project
                      </span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.organizationName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.status}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Progress and Stats */}
                    <div className="space-y-3">
                      {/* Funding Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900">
                            ${getTotalEscrowForProject(project).toLocaleString()} in escrow
                          </span>
                          <span className="text-gray-600">
                            {getProgressPercentage(getTotalEscrowForProject(project), project)}% of ${project.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(getTotalEscrowForProject(project), project)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{getCompletedMilestones(project.milestones)}/{project.milestones.length} milestones</span>
                          </div>
                          {project.currentMilestone && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>Current: {project.currentMilestone.title}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectSelect(project.id, project.title);
                          }}
                        >
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-600">
            No active projects available at the moment. Check back later or create a new project.
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" className="min-w-40">
            <TrendingUp className="h-4 w-4 mr-2" />
            Load More Projects
          </Button>
        </div>
      )}
    </div>
  );
}
