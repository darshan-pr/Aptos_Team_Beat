"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { projectStore, type Milestone, type ProjectImage } from "@/lib/projectStore";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { createProject } from "@/entry-functions/createProject";
import { 
  Target, 
  Calendar,
  MapPin, 
  DollarSign,
  PlusCircle,
  Wallet,
  ImageIcon,
  Trash2
} from "lucide-react";

interface FormMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  fundingAmount: string;
}

export function RequestFunding() {
  const { toast } = useToast();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [location, setLocation] = useState("");
  const [totalFunding, setTotalFunding] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [milestones, setMilestones] = useState<FormMilestone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addMilestone = () => {
    const newMilestone: FormMilestone = {
      id: Date.now().toString(),
      title: "",
      description: "",
      dueDate: "",
      fundingAmount: ""
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateMilestone = (id: string, field: keyof FormMilestone, value: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Get wallet functions from wallet adapter
  const { signAndSubmitTransaction } = useWallet();

  const handleSubmit = async () => {
    if (!projectTitle || !projectDescription || !totalFunding) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for blockchain transaction
      const totalFundingRequired = parseFloat(totalFunding) * 10**8; // Convert to octas (blockchain amount format)
      
      // Create the transaction payload
      const transaction = createProject({
        title: projectTitle,
        description: projectDescription,
        totalFundingRequired: totalFundingRequired,
      });

      // Submit the transaction to the blockchain
      const result = await signAndSubmitTransaction(transaction);
      console.log("Transaction submitted:", result);

      // After blockchain transaction is successful, store in local state
      // Convert form data to project format for local state
      const projectImages: ProjectImage[] = imageUrls
        .filter(url => url.trim())
        .map(url => ({
          url: url.trim(),
          uploadDate: new Date().toISOString()
        }));

      const projectMilestones: Milestone[] = milestones.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        dueDate: m.dueDate,
        fundingAmount: parseFloat(m.fundingAmount) || 0,
        originalFundingAmount: parseFloat(m.fundingAmount) || 0,
        isCompleted: false,
        verificationStatus: "pending" as const,
        verifications: [],
        escrowReleased: false
      }));

      // Create the project in local state (after blockchain confirmation)
      const newProject = projectStore.createProject({
        title: projectTitle,
        description: projectDescription,
        organizationId: "0x123...abc", // Current wallet address
        organizationName: "Water For Life Foundation",
        location: location || "Not specified",
        targetAmount: parseFloat(totalFunding),
        images: projectImages,
        milestones: projectMilestones,
        status: "active"
      });

      console.log("Created new project:", newProject.id);

      toast({
        title: "Project Created Successfully! 🎉",
        description: `Your project "${projectTitle}" has been created on the blockchain and is now live on the platform with ID: ${newProject.id}`
      });

      // Reset form
      setProjectTitle("");
      setProjectDescription("");
      setLocation("");
      setTotalFunding("");
      setImageUrls([""]);
      setMilestones([]);

    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error Creating Project",
        description: "Failed to create project on the blockchain. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-blue-600" />
            Request Funding - Create New Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
            
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter your project title"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Brief description of your project goals and impact..."
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="funding">Total Funding Required (USD) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="funding"
                    type="number"
                    value={totalFunding}
                    onChange={(e) => setTotalFunding(e.target.value)}
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Connected Wallet</span>
              </div>
              <p className="text-sm text-blue-700">
                Organization ID: <code className="bg-white px-2 py-1 rounded">0x123...abc</code>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This wallet address will be used to identify your organization and receive funds.
              </p>
            </div>
          </div>

          {/* Project Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Images</h3>
                <p className="text-sm text-gray-600">Add image URLs to showcase your project</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>
            </div>

            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {imageUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImageUrl(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
                <p className="text-sm text-gray-600">Define milestones to track progress and receive phased funding</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {milestones.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add milestones to receive funds in phases based on community verification
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMilestone}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Milestone
                  </Button>
                </div>
              </div>
            )}

            {milestones.map((milestone, index) => (
              <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Milestone Title</Label>
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                        placeholder="e.g., Site preparation completed"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(milestone.id, "dueDate", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Milestone Description</Label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                        placeholder="Describe what will be accomplished in this milestone..."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Funding Amount (USD)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={milestone.fundingAmount}
                          onChange={(e) => updateMilestone(milestone.id, "fundingAmount", e.target.value)}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Funds for this milestone will be held in escrow until community verification is complete.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" disabled={isSubmitting}>
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
