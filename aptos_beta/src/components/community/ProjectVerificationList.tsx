"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectStore, type Project, type Milestone } from "@/lib/projectStore";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Building2,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Search,
  Lock,
  Shield
} from "lucide-react";

export function ProjectVerificationList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [currentWallet] = useState("0x1234567890abcdef"); // This would come from wallet connection

  useEffect(() => {
    const allProjects = projectStore.getAllProjects();
    setProjects(allProjects);
  }, []);

  const handleVote = (projectId: string, milestoneId: string, vote: "approved" | "rejected") => {
    try {
      projectStore.addMilestoneVerification(
        projectId, 
        milestoneId, 
        currentWallet,
        "Community Verifier", // Default verifier name
        vote,
        "" // Empty comments for now
      );
      // Refresh projects to show updated verification
      const updatedProjects = projectStore.getAllProjects();
      setProjects(updatedProjects);
      console.log(`Voted ${vote} for milestone ${milestoneId}`);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getStatusIcon = (milestone: Milestone) => {
    if (milestone.isCompleted && milestone.verificationStatus === 'verified') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (milestone.isCompleted && milestone.verificationStatus === 'awaiting_verification') {
      return <Clock className="h-4 w-4 text-orange-600" />;
    } else if (milestone.verificationStatus === 'rejected') {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.isCompleted && milestone.verificationStatus === 'verified') {
      return "text-green-600 bg-green-100";
    } else if (milestone.isCompleted && milestone.verificationStatus === 'awaiting_verification') {
      return "text-orange-600 bg-orange-100";
    } else if (milestone.verificationStatus === 'rejected') {
      return "text-red-600 bg-red-100";
    }
    return "text-gray-600 bg-gray-100";
  };

  const getStatusText = (milestone: Milestone) => {
    if (milestone.isCompleted && milestone.verificationStatus === 'verified') {
      return "Verified";
    } else if (milestone.isCompleted && milestone.verificationStatus === 'awaiting_verification') {
      return "Awaiting Verification";
    } else if (milestone.verificationStatus === 'rejected') {
      return "Rejected";
    }
    return "In Progress";
  };

  const getUserVoteForMilestone = (milestone: Milestone) => {
    const userVerification = milestone.verifications.find(v => v.verifierId === currentWallet);
    return userVerification?.status || null;
  };

  const getApprovalCount = (milestone: Milestone) => {
    return milestone.verifications.filter(v => v.status === 'approved').length;
  };

  const getRejectionCount = (milestone: Milestone) => {
    return milestone.verifications.filter(v => v.status === 'rejected').length;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "pending") {
      return matchesSearch && project.milestones.some(m => 
        m.isCompleted && m.verificationStatus === 'awaiting_verification'
      );
    }
    if (selectedFilter === "approved") {
      return matchesSearch && project.milestones.some(m => m.verificationStatus === 'verified');
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Verification</h1>
        <p className="text-gray-600">Help verify project milestones and release funds to NGOs</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Projects</option>
                <option value="pending">Pending Verification</option>
                <option value="approved">Recently Verified</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    {project.title}
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Escrow Secured</span>
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {project.organizationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {project.milestones.length} Milestones
                    </span>
                    <span>
                      ${project.targetAmount.toLocaleString()} target
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{project.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {expandedProject === project.id && (
              <CardContent className="border-t bg-gray-50">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Milestones for Verification</h3>
                  {project.milestones.map((milestone) => {
                    const userVote = getUserVoteForMilestone(milestone);
                    const approvals = getApprovalCount(milestone);
                    const rejections = getRejectionCount(milestone);
                    const isAwaitingVerification = milestone.isCompleted && milestone.verificationStatus === 'awaiting_verification';
                    
                    return (
                      <Card key={milestone.id} className="bg-white">
                        <CardHeader 
                          className="cursor-pointer"
                          onClick={() => setExpandedMilestone(expandedMilestone === milestone.id ? null : milestone.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(milestone)}
                                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone)}`}>
                                  {getStatusText(milestone)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  ${milestone.fundingAmount.toLocaleString()}
                                </span>
                                {milestone.completionDate && (
                                  <span>
                                    Completed: {new Date(milestone.completionDate).toLocaleDateString()}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  {approvals} approvals, {rejections} rejections
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        {expandedMilestone === milestone.id && (
                          <CardContent className="border-t space-y-4">
                            {/* Milestone Details */}
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Milestone Details</h5>
                              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">Funding Amount:</span> ${milestone.fundingAmount.toLocaleString()}
                                </div>
                                {milestone.completionDate && (
                                  <div className="text-sm">
                                    <span className="font-medium">Completion Date:</span> {new Date(milestone.completionDate).toLocaleDateString()}
                                  </div>
                                )}
                                {milestone.verificationDeadline && (
                                  <div className="text-sm">
                                    <span className="font-medium">Verification Deadline:</span> {new Date(milestone.verificationDeadline).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Voting */}
                            {isAwaitingVerification && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Your Verification</h5>
                                <div className="flex gap-2 mb-4">
                                  <Button
                                    variant={userVote === "approved" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleVote(project.id, milestone.id, "approved")}
                                    className="flex items-center gap-2"
                                    disabled={!!userVote}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    Approve ({approvals})
                                  </Button>
                                  <Button
                                    variant={userVote === "rejected" ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => handleVote(project.id, milestone.id, "rejected")}
                                    className="flex items-center gap-2"
                                    disabled={!!userVote}
                                  >
                                    <ThumbsDown className="h-4 w-4" />
                                    Reject ({rejections})
                                  </Button>
                                </div>
                                {userVote && (
                                  <div className="text-sm text-gray-600">
                                    ✓ You have already voted: <span className="font-medium">{userVote}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Verification Status */}
                            {milestone.verifications.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Community Verifications</h5>
                                <div className="space-y-2">
                                  {milestone.verifications.map((verification, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <span className="text-sm font-mono">{verification.verifierId.slice(0, 8)}...</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        verification.status === 'approved' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {verification.status}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(verification.timestamp).toLocaleDateString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find projects that need verification.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
