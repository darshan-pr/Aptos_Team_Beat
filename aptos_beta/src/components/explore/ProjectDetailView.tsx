"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DonationWidget } from "@/components/DonationWidget";
import { projectStore, type Project, type Milestone } from "@/lib/projectStore";
import { 
  Heart, 
  Share2, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Shield,
  DollarSign,
  Lock
} from "lucide-react";

interface ProjectDetailViewProps {
  projectId: string;
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const projectData = projectStore.getProjectById(projectId);
    setProject(projectData || null);
  }, [projectId]);

  const refreshProject = () => {
    const projectData = projectStore.getProjectById(projectId);
    setProject(projectData || null);
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
        <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const getTotalEscrow = () => {
    const escrowDonations = projectStore.getEscrowDonationsForProject(projectId);
    return escrowDonations.reduce((sum: number, donation) => sum + donation.amount, 0);
  };

  const getDisplayTargetAmount = () => {
    // DISPLAY RULES: On the Explore page, the initial total target amount for the project 
    // must be followed as same like current one
    return project.targetAmount; // Always show original target amount
  };

  const getProgressPercentage = () => {
    const totalEscrow = getTotalEscrow();
    const displayTarget = getDisplayTargetAmount();
    return Math.round((totalEscrow / displayTarget) * 100);
  };

  const getCompletedMilestones = () => {
    return project.milestones.filter(m => m.isCompleted).length;
  };

  const getCurrentMilestone = () => {
    return project.milestones.find(m => !m.isCompleted) || project.milestones[0];
  };

  const getStatusIcon = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <Clock className="h-6 w-6 text-blue-500" />;
  };

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const totalEscrow = getTotalEscrow();
  const progressPercentage = getProgressPercentage();
  const currentMilestone = getCurrentMilestone();
  const displayTarget = getDisplayTargetAmount();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden">
          <div className="relative">
            {/* Project Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                  <p className="text-purple-100 text-lg">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`${isLiked ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-purple-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">By {project.organizationId ? project.organizationId.slice(0, 8) + '...' : 'Unknown Organization'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      <Lock className="h-6 w-6 text-purple-600" />
                      ${totalEscrow.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      in escrow of ${displayTarget.toLocaleString()} goal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {progressPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">secured</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-800 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Funds secured in escrow</span>
                  <span>${(displayTarget - totalEscrow).toLocaleString()} needed</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Milestone */}
        {currentMilestone && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Current Milestone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(currentMilestone)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{currentMilestone.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentMilestone)}`}>
                        {currentMilestone.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{currentMilestone.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>${currentMilestone.originalFundingAmount.toLocaleString()} target</span>
                          {currentMilestone.escrowReleased && (
                            <span className="text-xs text-green-600">
                              ✅ Funds Released
                            </span>
                          )}
                        </div>
                      </div>
                      {currentMilestone.verifications.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Shield className="h-4 w-4" />
                          <span>{currentMilestone.verifications.filter(v => v.status === 'approved').length} verifications</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Donation Widget */}
        <DonationWidget
          projectId={project.id}
          projectTitle={project.title}
          targetAmount={displayTarget}
          raisedAmount={totalEscrow}
          onDonationComplete={refreshProject}
        />

        {/* Milestones Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Project Milestones
            </CardTitle>
            <div className="text-sm text-gray-600">
              {getCompletedMilestones()} of {project.milestones.length} completed
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Connection Line */}
                {index < project.milestones.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-12 bg-gray-200" />
                )}
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(milestone)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{milestone.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone)}`}>
                        {milestone.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex flex-col">
                        <span>${milestone.originalFundingAmount.toLocaleString()} target</span>
                      </div>
                      <div className="flex flex-col text-right">
                        {milestone.verifications.length > 0 && (
                          <span className="text-blue-600">
                            {milestone.verifications.filter(v => v.status === 'approved').length} verified
                          </span>
                        )}
                        {milestone.escrowReleased && (
                          <span className="text-green-600 text-xs">
                            ✅ Funds Released
                          </span>
                        )}
                      </div>
                    </div>
                    {milestone.completionDate && (
                      <div className="text-xs text-green-600 mt-1">
                        Completed: {new Date(milestone.completionDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {Math.round((getCompletedMilestones() / project.milestones.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Progress</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {progressPercentage}%
                </div>
                <div className="text-xs text-gray-600">Secured</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
