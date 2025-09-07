"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectStore, type Project, type Milestone } from "@/lib/projectStore";
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  MessageSquare,
  ThumbsUp,
  Calendar,
  DollarSign,
  Camera,
  Target,
  FileText,
  Users,
  MapPin,
  Building2,
  Mail
} from "lucide-react";

interface CommunityProjectViewProps {
  projectId: string;
}

export function CommunityProjectView({ projectId }: CommunityProjectViewProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [milestoneId: string]: string }>({});
  const [showVerificationForm, setShowVerificationForm] = useState<{ [milestoneId: string]: boolean }>({});
  const [verificationComment, setVerificationComment] = useState<{ [milestoneId: string]: string }>({});

  useEffect(() => {
    const projectData = projectStore.getProjectById(projectId);
    setProject(projectData || null);
  }, [projectId]);

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
        <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const getTotalEscrowForProject = () => {
    const escrowDonations = projectStore.getEscrowDonationsForProject(projectId);
    return escrowDonations.reduce((sum, donation) => sum + donation.amount, 0);
  };

  const getProgressPercentage = () => {
    const totalEscrow = getTotalEscrowForProject();
    return Math.round((totalEscrow / project.targetAmount) * 100);
  };

  const getCompletedMilestones = () => {
    return project.milestones.filter(m => m.isCompleted).length;
  };

  const getStatusIcon = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    if (dueDate < now) {
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
    return <Clock className="h-6 w-6 text-blue-500" />;
  };

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    if (dueDate < now) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const handleVerifyMilestone = (milestoneId: string, approved: boolean) => {
    const comment = verificationComment[milestoneId] || "";
    if (!comment.trim()) {
      alert("Please provide verification comments");
      return;
    }

    const success = projectStore.addMilestoneVerification(
      projectId, 
      milestoneId, 
      "current_user",
      "Community Verifier",
      approved ? "approved" : "rejected",
      comment
    );

    if (success) {
      const updatedProject = projectStore.getProjectById(projectId);
      setProject(updatedProject || null);
      setVerificationComment({ ...verificationComment, [milestoneId]: "" });
      setShowVerificationForm({ ...showVerificationForm, [milestoneId]: false });
    }
  };

  const handleCommentSubmit = (milestoneId: string) => {
    const comment = commentText[milestoneId];
    if (!comment?.trim()) return;

    // In a real app, this would add a comment to the milestone
    console.log(`Comment for milestone ${milestoneId}: ${comment}`);
    setCommentText({ ...commentText, [milestoneId]: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* Left Side - Milestones (Larger, More Prominent) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{project.organizationName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Community Project</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${getTotalEscrowForProject().toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">
                  of ${project.targetAmount.toLocaleString()} goal (in escrow)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {getCompletedMilestones()}/{project.milestones.length}
                </div>
                <div className="text-gray-600 mb-3">milestones completed</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(getCompletedMilestones() / project.milestones.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Milestones */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            Project Milestones
          </h2>
          
          {project.milestones.map((milestone) => (
            <Card key={milestone.id} className="overflow-hidden border-2 hover:border-purple-200 transition-colors">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(milestone)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(milestone)}`}>
                          {milestone.isCompleted ? "Completed" : (new Date(milestone.dueDate) < new Date() ? "Overdue" : "In Progress")}
                        </span>
                        {milestone.verificationStatus === 'verified' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${milestone.fundingAmount.toLocaleString()}</span>
                        </div>
                        {milestone.verifications.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            <span>{milestone.verifications.filter(v => v.status === 'approved').length} verifications</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    {selectedMilestone === milestone.id ? "−" : "+"}
                  </Button>
                </div>
              </CardHeader>

              {selectedMilestone === milestone.id && (
                <CardContent className="border-t bg-gray-50 p-6">
                  {/* Completion Images */}
                  {milestone.completionImages && milestone.completionImages.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Evidence Photos
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {milestone.completionImages.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={image.url}
                              alt={image.caption || "Milestone evidence"}
                              className="w-full h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg">
                                {image.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verifications */}
                  {milestone.verifications.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Community Verifications
                      </h4>
                      <div className="space-y-3">
                        {milestone.verifications.map((verification, vIndex) => (
                          <div key={vIndex} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{verification.verifierName}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  verification.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {verification.status}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(verification.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{verification.comments}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Actions */}
                  {milestone.isCompleted && milestone.verificationStatus !== 'verified' && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Verify This Milestone</h4>
                      {!showVerificationForm[milestone.id] ? (
                        <Button 
                          onClick={() => setShowVerificationForm({ ...showVerificationForm, [milestone.id]: true })}
                          className="w-full"
                        >
                          Verify Milestone Completion
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            value={verificationComment[milestone.id] || ""}
                            onChange={(e) => setVerificationComment({ ...verificationComment, [milestone.id]: e.target.value })}
                            placeholder="Please provide your verification comments and observations..."
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleVerifyMilestone(milestone.id, true)}
                              variant="green"
                              className="flex-1"
                            >
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleVerifyMilestone(milestone.id, false)}
                              variant="destructive"
                              className="flex-1"
                            >
                              Reject
                            </Button>
                            <Button 
                              onClick={() => setShowVerificationForm({ ...showVerificationForm, [milestone.id]: false })}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments & Discussion
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <textarea
                          value={commentText[milestone.id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [milestone.id]: e.target.value })}
                          placeholder="Share your thoughts on this milestone..."
                          className="flex-1 p-3 border rounded-lg resize-none"
                          rows={2}
                        />
                        <Button 
                          onClick={() => handleCommentSubmit(milestone.id)}
                          disabled={!commentText[milestone.id]?.trim()}
                          className="self-end"
                        >
                          Comment
                        </Button>
                      </div>
                      
                      {/* Sample comments - in real app these would come from the data */}
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Community Member</span>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700 text-sm">Great progress! The water quality tests look very promising.</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-purple-600">
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">5</span>
                          </button>
                          <button className="text-xs text-gray-500 hover:text-purple-600">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side - Project Description */}
      <div className="space-y-6">
        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Project Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Project Images */}
        {project.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {project.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.caption || project.title}
                      className="w-full h-40 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* NGO Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              About {project.organizationName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>Contact via wallet: {project.organizationId}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Location: {project.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((getCompletedMilestones() / project.milestones.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Milestones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {getProgressPercentage()}%
                </div>
                <div className="text-xs text-gray-600">Secured in Escrow</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}