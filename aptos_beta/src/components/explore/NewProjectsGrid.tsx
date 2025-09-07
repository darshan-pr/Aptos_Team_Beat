"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectStore, type Project } from "@/lib/projectStore";
import { 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Lock,
  Building2,
  Calendar
} from "lucide-react";

interface ProjectsGridProps {
  onProjectSelect: (projectId: string, projectTitle: string) => void;
}

export function ProjectsGrid({ onProjectSelect }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const allProjects = projectStore.getAllProjects();
    setProjects(allProjects);
  }, []);

  const getTotalEscrowForProject = (projectId: string) => {
    const escrowDonations = projectStore.getEscrowDonationsForProject(projectId);
    return escrowDonations.reduce((sum: number, donation) => sum + donation.amount, 0);
  };

  const getProgressPercentage = (escrowAmount: number, target: number) => {
    return Math.round((escrowAmount / target) * 100);
  };

  const getCompletedMilestones = (project: Project) => {
    return project.milestones.filter(m => m.isCompleted).length;
  };

  const getCurrentMilestone = (project: Project) => {
    return project.milestones.find(m => !m.isCompleted) || project.milestones[0];
  };

  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "most-funded":
        return getTotalEscrowForProject(b.id) - getTotalEscrowForProject(a.id);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header and Sorting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {projects.length} Projects Available
          </h2>
          <p className="text-gray-600">All projects use escrow-secured funding</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="most-funded">Most Funded</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {sortedProjects.map((project) => {
          const totalEscrow = getTotalEscrowForProject(project.id);
          const progressPercentage = getProgressPercentage(totalEscrow, project.targetAmount);
          const completedMilestones = getCompletedMilestones(project);
          const currentMilestone = getCurrentMilestone(project);

          return (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 overflow-hidden"
              onClick={() => onProjectSelect(project.id, project.title)}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Project Image */}
                <div className="lg:w-80 h-48 lg:h-auto flex-shrink-0 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-purple-400 text-center">
                      <Target className="h-12 w-12 mx-auto mb-2" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          Milestone-Based
                        </span>
                        <div className="flex items-center gap-1">
                          <Lock className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600">Escrow Secured</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{project.organizationName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      {/* Current Milestone */}
                      {currentMilestone && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-900">Current Milestone</span>
                          </div>
                          <p className="text-sm text-gray-600">{currentMilestone.title}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            ${currentMilestone.fundingAmount.toLocaleString()} allocated
                          </div>
                        </div>
                      )}

                      {/* Progress and Stats */}
                      <div className="space-y-3">
                        {/* Funding Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-900 flex items-center gap-1">
                              <Lock className="h-4 w-4 text-purple-500" />
                              ${totalEscrow.toLocaleString()} in escrow
                            </span>
                            <span className="text-gray-600">
                              {progressPercentage}% of ${project.targetAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              <span>{completedMilestones}/{project.milestones.length} milestones</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Verified by community</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700 text-white"
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
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600">Check back later for new charitable projects.</p>
        </div>
      )}

      {/* Load More (placeholder for pagination) */}
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
