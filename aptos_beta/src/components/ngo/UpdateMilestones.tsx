"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { projectStore, type Project, type Milestone } from "@/lib/projectStore";
import { 
  Edit3, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  AlertCircle,
  Camera,
  MessageSquare
} from "lucide-react";

export function UpdateMilestones() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [updateNotes, setUpdateNotes] = useState<{ [key: string]: string }>({});
  const [completionImages, setCompletionImages] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const allProjects = projectStore.getAllProjects();
    setProjects(allProjects);
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0].id);
    }
  }, [selectedProject]);

  const currentProject = projects.find(p => p.id === selectedProject);

  const addCompletionImage = (milestoneId: string) => {
    setCompletionImages(prev => ({
      ...prev,
      [milestoneId]: [...(prev[milestoneId] || []), ""]
    }));
  };

  const updateCompletionImage = (milestoneId: string, index: number, url: string) => {
    setCompletionImages(prev => ({
      ...prev,
      [milestoneId]: (prev[milestoneId] || []).map((img, i) => i === index ? url : img)
    }));
  };

  const removeCompletionImage = (milestoneId: string, index: number) => {
    setCompletionImages(prev => ({
      ...prev,
      [milestoneId]: (prev[milestoneId] || []).filter((_, i) => i !== index)
    }));
  };

  const updateMilestoneStatus = async (milestoneId: string) => {
    if (!currentProject) return;

    try {
      // Prepare images data for storing locally
      const completionImagesList = (completionImages[milestoneId] || [])
        .filter(url => url.trim())
        .map(url => ({
          url: url.trim(),
          uploadDate: new Date().toISOString()
        }));

      // For a real blockchain integration, we would create and submit a transaction here
      // For milestone completion on the blockchain
      // Since our blockchain contract doesn't directly handle milestones (as per requirements)
      // we'll just simulate a transaction delay and update the local state
      
      toast({
        title: "Updating Milestone Status",
        description: "Submitting milestone update to the blockchain...",
      });
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      const success = projectStore.completeMilestone(
        currentProject.id, 
        milestoneId, 
        completionImagesList
      );
      
      if (success) {
        toast({
          title: "Milestone Completed! 🎉",
          description: "Milestone has been marked as completed on the blockchain and is now awaiting community verification."
        });

        // Refresh projects
        setProjects(projectStore.getAllProjects());
        
        // Clear the form
        setUpdateNotes(prev => ({ ...prev, [milestoneId]: "" }));
        setCompletionImages(prev => ({ ...prev, [milestoneId]: [] }));
      } else {
        throw new Error("Failed to update milestone status in local state");
      }
    } catch (error) {
      console.error("Error updating milestone status:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast({
        title: "Error",
        description: `Failed to update milestone: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const submitMilestoneUpdate = (milestoneId: string) => {
    const notes = updateNotes[milestoneId];
    if (!notes?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please add progress notes before submitting.",
        variant: "destructive"
      });
      return;
    }

    const project = projects.find(p => p.milestones.some(m => m.id === milestoneId));
    const milestone = project?.milestones.find(m => m.id === milestoneId);
    
    if (project && milestone) {
      // Create a community post for the progress update
      projectStore.createCommunityPost({
        type: "project_update",
        projectId: project.id,
        organizationId: project.organizationId,
        authorId: project.organizationId,
        authorName: project.organizationName,
        authorRole: "ngo",
        title: `Progress Update: ${milestone.title}`,
        content: `Progress update for milestone "${milestone.title}": ${notes}`,
        milestoneId,
        likes: 0,
        comments: []
      });
    }

    toast({
      title: "Update Submitted",
      description: "Your milestone progress update has been posted to the community."
    });

    // Clear the notes
    setUpdateNotes(prev => ({ ...prev, [milestoneId]: "" }));
  };

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return "text-green-600 bg-green-100";
    }
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    if (dueDate < now) {
      return "text-red-600 bg-red-100";
    }
    return "text-blue-600 bg-blue-100";
  };

  const getStatusIcon = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      return <CheckCircle className="h-4 w-4" />;
    }
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    if (dueDate < now) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-blue-600" />
            Update Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Project Selection */}
          <div className="mb-6">
            <Label htmlFor="project-select">Select Project</Label>
            <select
              id="project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Project Overview */}
          {currentProject && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{currentProject.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Funding:</span>
                  <span className="ml-2 font-medium">${currentProject.targetAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium capitalize">{currentProject.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Milestones:</span>
                  <span className="ml-2 font-medium">
                    {currentProject.milestones.filter(m => m.isCompleted).length} / {currentProject.milestones.length} completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      {currentProject?.milestones.map((milestone, index) => (
        <Card key={milestone.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Milestone {index + 1}: {milestone.title}
              </CardTitle>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone)}`}>
                {getStatusIcon(milestone)}
                {milestone.isCompleted ? "Completed" : (new Date(milestone.dueDate) < new Date() ? "Overdue" : "In Progress")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Milestone Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Due Date:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{new Date(milestone.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Funding Amount:</span>
                <div className="font-medium mt-1">${milestone.fundingAmount.toLocaleString()}</div>
              </div>
              {milestone.completionDate && (
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <div className="font-medium mt-1">{new Date(milestone.completionDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            <div>
              <span className="text-gray-600">Description:</span>
              <p className="mt-1 text-gray-900">{milestone.description}</p>
            </div>

            {/* Completion Images */}
            {milestone.completionImages && milestone.completionImages.length > 0 && (
              <div>
                <span className="text-gray-600">Completion Documentation:</span>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {milestone.completionImages.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative">
                      <img
                        src={image.url}
                        alt={image.caption || "Milestone completion"}
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {image.caption && (
                        <p className="text-xs text-gray-600 mt-1">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            {milestone.isCompleted && (
              <div>
                <span className="text-gray-600">Verification Status:</span>
                <div className="mt-2 space-y-2">
                  <div className={`p-3 rounded-lg ${
                    milestone.verificationStatus === 'verified' ? 'bg-green-50 border border-green-200' :
                    milestone.verificationStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
                    milestone.verificationStatus === 'awaiting_verification' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {milestone.verificationStatus === 'verified' ? 'Verified ✅' :
                         milestone.verificationStatus === 'rejected' ? 'Rejected ❌' :
                         milestone.verificationStatus === 'awaiting_verification' ? 'Awaiting Verification ⏳' :
                         'Pending'}
                      </span>
                      {milestone.verificationDeadline && milestone.verificationStatus === 'awaiting_verification' && (
                        <span className="text-xs text-gray-600">
                          Deadline: {new Date(milestone.verificationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {milestone.verificationStatus === 'awaiting_verification' && (
                      <p className="text-sm text-yellow-700">
                        Community members have {milestone.verificationDeadline ? 
                          Math.max(0, Math.ceil((new Date(milestone.verificationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) + ' days' : 
                          'time'} to verify this milestone.
                      </p>
                    )}
                    {milestone.escrowReleased && (
                      <p className="text-sm text-green-700 font-medium">
                        🎉 Funds released! ${milestone.fundingAmount.toLocaleString()} has been transferred to your account.
                      </p>
                    )}
                  </div>
                  
                  {milestone.verifications.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Community Verifications:</span>
                      {milestone.verifications.map((verification, verIndex) => (
                        <div key={verIndex} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{verification.verifierName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              verification.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {verification.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{verification.comments}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(verification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Update Section */}
            {!milestone.isCompleted && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-gray-900">Update Milestone Progress</h4>
                
                {/* Completion Images Input */}
                <div>
                  <Label>Add Completion Images (URLs)</Label>
                  <div className="mt-2 space-y-2">
                    {(completionImages[milestone.id] || [""]).map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => updateCompletionImage(milestone.id, index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {(completionImages[milestone.id] || []).length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompletionImage(milestone.id, index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCompletionImage(milestone.id)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Image URL
                    </Button>
                  </div>
                </div>

                {/* Progress Notes */}
                <div>
                  <Label htmlFor={`notes-${milestone.id}`}>Progress Notes</Label>
                  <textarea
                    id={`notes-${milestone.id}`}
                    value={updateNotes[milestone.id] || ""}
                    onChange={(e) => setUpdateNotes({ ...updateNotes, [milestone.id]: e.target.value })}
                    placeholder="Describe current progress, any challenges, or updates..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button 
                    onClick={() => submitMilestoneUpdate(milestone.id)}
                    variant="outline"
                    disabled={!updateNotes[milestone.id]?.trim()}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Post Update
                  </Button>
                  
                  <Button 
                    onClick={() => updateMilestoneStatus(milestone.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {currentProject && currentProject.milestones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones Yet</h3>
            <p className="text-gray-600">
              This project doesn't have any milestones set up yet. 
              Add milestones when creating or editing the project.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
