"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/entry-functions/createProject";
import { donateToProject } from "@/entry-functions/donateToProject";
import { getProjectDetails, getProjectCount, ProjectDetails } from "@/view-functions/charitableFunding";
import { useToast } from "@/components/ui/use-toast";

export function CharitableFunding() {
  const { signAndSubmitTransaction, account, connected: isConnected } = useWallet();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingRequired, setFundingRequired] = useState("");

  const [projectId, setProjectId] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);

  // Convert APT to octas (1 APT = 10^8 octas)
  const aptToOctas = (apt: string) => {
    try {
      return BigInt(parseFloat(apt) * 10**8);
    } catch (e) {
      return BigInt(0);
    }
  };

  // Convert octas to APT for display
  const octasToApt = (octas: bigint) => {
    return (Number(octas) / 10**8).toFixed(2);
  };

  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      const count = await getProjectCount();
      const projectsList: ProjectDetails[] = [];
      
      for (let i = 0; i < count; i++) {
        const project = await getProjectDetails(i);
        projectsList.push(project);
      }
      
      setProjects(projectsList);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      loadProjects();
    }
  }, [isConnected, account]);

  const handleCreateProject = async () => {
    if (!title || !description || !fundingRequired) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const transaction = createProject({
        title,
        description,
        totalFundingRequired: aptToOctas(fundingRequired),
      });

      const result = await signAndSubmitTransaction(transaction);
      console.log("Transaction submitted:", result);
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });

      // Reset form fields
      setTitle("");
      setDescription("");
      setFundingRequired("");

      // Reload projects after a short delay to allow transaction to finalize
      setTimeout(() => {
        loadProjects();
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const transaction = donateToProject({
        projectId,
        amount: aptToOctas(donationAmount),
      });

      const result = await signAndSubmitTransaction(transaction);
      console.log("Transaction submitted:", result);
      
      toast({
        title: "Success",
        description: "Donation successful",
      });

      // Reset form fields
      setDonationAmount("");

      // Reload projects after a short delay to allow transaction to finalize
      setTimeout(() => {
        loadProjects();
      }, 2000);
    } catch (error) {
      console.error("Error donating to project:", error);
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || !account) {
    return (
      <div className="flex justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Charitable Funding</CardTitle>
            <CardDescription>Please connect your wallet to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Project Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Create a new charitable funding project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fundingRequired">Funding Required (APT)</Label>
                <Input
                  id="fundingRequired"
                  placeholder="Enter amount in APT"
                  type="number"
                  min="0"
                  value={fundingRequired}
                  onChange={(e) => setFundingRequired(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreateProject}
              disabled={loading || !title || !description || !fundingRequired}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Donate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Donate to a Project</CardTitle>
            <CardDescription>Support a charitable project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID</Label>
                <select
                  id="projectId"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                >
                  {projects.map((project, index) => (
                    <option key={index} value={index}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donationAmount">Donation Amount (APT)</Label>
                <Input
                  id="donationAmount"
                  placeholder="Enter amount in APT"
                  type="number"
                  min="0"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleDonate}
              disabled={loading || !donationAmount || projects.length === 0}
              className="w-full"
            >
              {loading ? "Processing..." : "Donate"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Projects List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found. Create a new project to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>Project #{index}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{project.description}</p>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span>Creator:</span>
                      <span className="text-sm font-mono truncate max-w-[180px]">{project.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span>{octasToApt(project.totalFundingRequired)} APT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span>{octasToApt(project.currentFunding)} APT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(
                            Number(project.currentFunding) / Number(project.totalFundingRequired) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
