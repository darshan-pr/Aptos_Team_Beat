"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { projectStore, type Project } from "@/lib/projectStore";
import { 
  DollarSign, 
  Download,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  Zap,
  RefreshCw
} from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { completeMilestone } from "@/entry-functions/completeMilestone";
import { verifyMilestone } from "@/entry-functions/verifyMilestone";
import { releaseMilestoneFunds } from "@/entry-functions/releaseMilestoneFunds";
import { getMilestoneDetails } from "@/view-functions/charitableFunding";

export function TrackFunds() {
  const { toast } = useToast();
  const { account, signAndSubmitTransaction } = useWallet();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [emergencyReason, setEmergencyReason] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const allProjects = projectStore.getAllProjects();
    setProjects(allProjects);
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0].id);
    }
  }, [selectedProject]);

  const currentProject = projects.find(p => p.id === selectedProject);

  const getValidationInfo = (milestoneId: string) => {
    if (!currentProject) return null;
    return projectStore.getFundReleaseValidation(currentProject.id, milestoneId);
  };

  const getEscrowSummary = () => {
    if (!currentProject) return { totalEscrow: 0, totalReleased: 0, milestoneData: [] };

    // Get total escrow and released for the entire project
    const allEscrowDonations = projectStore.getEscrowDonationsForProject(currentProject.id);
    const totalEscrow = allEscrowDonations.filter(d => !d.isReleased).reduce((sum, d) => sum + d.amount, 0);
    const totalReleased = allEscrowDonations.filter(d => d.isReleased).reduce((sum, d) => sum + d.amount, 0);
    
    // Calculate flowing escrow for each milestone
    let remainingEscrow = totalEscrow;
    const milestoneData = currentProject.milestones.map((milestone) => {
      const released = projectStore.getTotalReleasedForMilestone(currentProject.id, milestone.id);
      
      // For released milestones, show 0 escrow (funds already released)
      // For current milestone, show all remaining escrow
      // For future milestones, show 0 escrow (funds haven't reached them yet)
      let escrowForThisMilestone = 0;
      
      if (milestone.escrowReleased) {
        // Already released - no escrow
        escrowForThisMilestone = 0;
      } else {
        // Find the first unreleased milestone - it gets all remaining escrow
        const firstUnreleased = currentProject.milestones.find(m => !m.escrowReleased);
        if (firstUnreleased && firstUnreleased.id === milestone.id) {
          escrowForThisMilestone = remainingEscrow;
        } else {
          escrowForThisMilestone = 0;
        }
      }

      const totalDonated = projectStore.getTotalDonatedToMilestone(currentProject.id, milestone.id);
      
      return {
        milestone,
        escrowTotal: escrowForThisMilestone,     // Flowing escrow amount
        released,                                // Actually released amount  
        totalDonated,                           // Total ever donated to this milestone
        pending: Math.max(0, milestone.originalFundingAmount - released) // Target - Released
      };
    });

    return { totalEscrow, totalReleased, milestoneData };
  };

  const getStatusColor = (milestone: any) => {
    if (milestone.escrowReleased) return "text-green-600 bg-green-100";
    if (milestone.isCompleted && milestone.verificationStatus === 'verified') return "text-blue-600 bg-blue-100";
    if (milestone.isCompleted) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (milestone: any) => {
    if (milestone.escrowReleased) return <Unlock className="h-4 w-4" />;
    if (milestone.isCompleted) return <Clock className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  const getStatusText = (milestone: any) => {
    if (milestone.escrowReleased) return "Released";
    if (milestone.isCompleted && milestone.verificationStatus === 'verified') return "Verified - Ready for Release";
    if (milestone.isCompleted) return "Awaiting Verification";
    return "Locked in Escrow";
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    if (!currentProject || !account?.address) return;

    setIsProcessing(true);

    try {
      // Convert milestone ID to the projectId:milestoneId format for blockchain
      const transaction = completeMilestone({
        projectId: parseInt(currentProject.id, 10), 
        milestoneId: parseInt(milestoneId, 10),
      });

      // Submit the transaction to the blockchain
      const result = await signAndSubmitTransaction(transaction);
      console.log("Milestone completion transaction submitted:", result);

      // After blockchain transaction is successful, update local state
      // For now, we'll just refresh the projects list since we don't have the specific method
      toast({
        title: "Milestone Marked as Completed! 🎉",
        description: "The milestone has been marked as completed on the blockchain and awaits verification."
      });

      // Refresh data
      const updatedProjects = projectStore.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      console.error("Milestone completion error:", error);
      toast({
        title: "Completion Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyMilestone = async (milestoneId: string) => {
    if (!currentProject || !account?.address) return;

    setIsProcessing(true);

    try {
      // Create the transaction payload
      const transaction = verifyMilestone({
        projectId: parseInt(currentProject.id, 10),
        milestoneId: parseInt(milestoneId, 10),
      });

      // Submit the transaction to the blockchain
      const result = await signAndSubmitTransaction(transaction);
      console.log("Milestone verification transaction submitted:", result);

      // After blockchain transaction is successful, update local state
      // For now, we'll just refresh the projects list since we don't have the specific method
      toast({
        title: "Milestone Verified! ✅",
        description: "You have successfully verified this milestone on the blockchain."
      });

      // Refresh data
      const updatedProjects = projectStore.getAllProjects();
      setProjects(updatedProjects);

      // Check if verification count is now 2 or more, if so, show a message about release
      try {
        const blockchainMilestone = await getMilestoneDetails(
          parseInt(currentProject.id, 10), 
          parseInt(milestoneId, 10)
        );

        if (blockchainMilestone.verificationCount >= 2) {
          toast({
            title: "Milestone Ready for Fund Release! 💰",
            description: "This milestone has received enough verifications and funds can now be released."
          });
        }
      } catch (error) {
        console.log("Could not fetch milestone details for verification count check");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      console.error("Milestone verification error:", error);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefreshFundRelease = async (milestoneId: string) => {
    if (!currentProject || !account?.address) return;

    setIsProcessing(true);

    try {
      // Check if fund release is valid in local state
      const validation = projectStore.getFundReleaseValidation(currentProject.id, milestoneId);
      
      if (!validation.isValid) {
        toast({
          title: "Release Validation Failed",
          description: validation.message,
          variant: "destructive"
        });
        return;
      }
      
      // Create the transaction payload
      const transaction = releaseMilestoneFunds({
        projectId: parseInt(currentProject.id, 10),
        milestoneId: parseInt(milestoneId, 10),
      });

      toast({
        title: "Initiating Fund Release",
        description: "Submitting transaction to blockchain...",
      });
      
      // Submit the transaction to the blockchain
      const result = await signAndSubmitTransaction(transaction);
      console.log("Fund release transaction submitted:", result);
      
      // Execute the fund release in local state
      const localResult = projectStore.refreshFundRelease(currentProject.id, milestoneId);
      
      if (localResult.success) {
        toast({
          title: "Fund Release Successful! 💰",
          description: `${localResult.message} Transaction confirmed on blockchain.`
        });
        
        // Refresh data
        const updatedProjects = projectStore.getAllProjects();
        setProjects(updatedProjects);
      } else {
        toast({
          title: "Release Failed",
          description: localResult.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Fund release error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during fund release.";
      
      toast({
        title: "Release Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Test function to add donations (for testing refresh functionality)
  const handleAddTestDonation = (milestoneId: string) => {
    if (!currentProject) return;

    const success = projectStore.addDonationToEscrow(
      currentProject.id,
      milestoneId,
      5000,
      "0xtest...123",
      "Test Donor"
    );

    if (success) {
      toast({
        title: "Test Donation Added! 💝",
        description: "Added $5,000 to milestone escrow. Auto-checking for fund release..."
      });
      
      // Refresh data
      const updatedProjects = projectStore.getAllProjects();
      setProjects(updatedProjects);
    }
  };

  const handleValidateConsistency = () => {
    if (!currentProject) return;

    const result = projectStore.validateAndFixFundConsistency(currentProject.id);
    
    if (result.issues.length === 0) {
      toast({
        title: "No Issues Found ✅",
        description: "All fund releases are consistent with milestone targets."
      });
    } else {
      toast({
        title: result.fixed ? "Issues Fixed! 🔧" : "Issues Detected ⚠️",
        description: `Found ${result.issues.length} issue(s). ${result.fixed ? 'Automatically fixed data inconsistencies.' : 'Manual review may be needed.'}`,
        variant: result.fixed ? "default" : "destructive"
      });
      
      // Log issues to console for debugging
      console.log("Fund consistency issues:", result.issues);
      
      if (result.fixed) {
        // Refresh data if fixes were applied
        const updatedProjects = projectStore.getAllProjects();
        setProjects(updatedProjects);
      }
    }
  };

  const handleEmergencyRelease = (milestoneId: string) => {
    if (!currentProject || !emergencyReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for emergency release",
        variant: "destructive"
      });
      return;
    }

    const milestone = currentProject.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const result = projectStore.immediateReleaseFunds(currentProject.id, milestoneId, emergencyReason);
    
    if (result.success) {
      toast({
        title: "Emergency Release Successful! 🚨",
        description: result.message
      });
      
      // Refresh data
      const updatedProjects = projectStore.getAllProjects();
      setProjects(updatedProjects);
      setEmergencyReason("");
    } else {
      toast({
        title: "Release Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const exportReport = () => {
    const stats = projectStore.getProjectStats();
    console.log("Exporting financial report...", stats);
    toast({
      title: "Report Exported",
      description: "Financial report has been generated"
    });
  };

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
        <p className="text-gray-600">Create your first project to start tracking funds.</p>
      </div>
    );
  }

  const { totalEscrow, totalReleased, milestoneData } = getEscrowSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
              Fund Release Validation System
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleValidateConsistency}
                className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                🔧 Validate Funds
              </Button>
              <Button variant="outline" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <h4 className="font-medium text-blue-900 mb-2">📋 Fund Release Rules:</h4>
            <div className="space-y-1 text-blue-800">
              <p><strong>Condition 1:</strong> Milestone must be verified by 2+ community members</p>
              <p><strong>Condition 2:</strong> Target amount must be available in escrow</p>
              <p><strong>Actions:</strong> Release funds → Update escrow → Reduce target → Final balance = 0</p>
              <p><strong>Holding:</strong> Verified milestones wait for sufficient escrow funds</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-select">Select Project</Label>
              <select
                id="project-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funding Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Escrow Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
                <Lock className="h-6 w-6" />
                ${totalEscrow.toLocaleString()}
              </div>
              <div className="text-gray-600">Total in Escrow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                <Unlock className="h-6 w-6" />
                ${totalReleased.toLocaleString()}
              </div>
              <div className="text-gray-600">Funds Released</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${Math.max(0, (currentProject?.targetAmount || 0) - totalReleased).toLocaleString()}
              </div>
              <div className="text-gray-600">Pending Release</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Release Progress</span>
              <span>{Math.min(100, currentProject?.targetAmount ? Math.round((totalReleased / currentProject.targetAmount) * 100) : 0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, currentProject?.targetAmount ? (totalReleased / currentProject.targetAmount) * 100 : 0)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Fund Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestoneData.map(({ milestone, escrowTotal, released, totalDonated, pending }) => {
              const validationInfo = getValidationInfo(milestone.id);
              
              return (
                <div key={milestone.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(milestone)}
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone)}`}>
                        {getStatusText(milestone)}
                      </span>
                      {/* Success indicator for released milestones */}
                      {milestone.escrowReleased && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                          ✅ Funds Released
                        </span>
                      )}
                      {/* Quick refresh button for verified milestones */}
                      {milestone.verificationStatus === 'verified' && !milestone.escrowReleased && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefreshFundRelease(milestone.id)}
                          className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                          title="Retry fund release"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${escrowTotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        Target: ${milestone.originalFundingAmount.toLocaleString()}
                        {milestone.escrowReleased && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            ✅ Released
                          </span>
                        )}
                      </div>
                      {totalDonated > escrowTotal + released && (
                        <div className="text-xs text-blue-600">Total Donated: ${totalDonated.toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">In Escrow</div>
                      <div className="font-medium text-purple-600">${escrowTotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Released</div>
                      <div className="font-medium text-green-600">
                        ${released.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Pending</div>
                      <div className="font-medium text-blue-600">${pending.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Actions for milestone */}
                  {!milestone.isCompleted && !milestone.escrowReleased && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleCompleteMilestone(milestone.id)}
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}

                  {/* Verification button for completed but not verified milestones */}
                  {milestone.isCompleted && !milestone.escrowReleased && 
                   milestone.verificationStatus !== 'verified' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleVerifyMilestone(milestone.id)}
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Milestone
                      </Button>
                    </div>
                  )}

                      {/* Fund Release Validation Status */}
                      {validationInfo && !milestone.escrowReleased && milestone.isCompleted && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Fund Release Validation:</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${validationInfo.isValid ? 'text-green-600' : 'text-red-600'}`}>
                                  {validationInfo.isValid ? '✅ Ready for Release' : '❌ Requirements Not Met'}
                                </span>
                                {/* Refresh button for verified milestones */}
                                {milestone.verificationStatus === 'verified' && !milestone.escrowReleased && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRefreshFundRelease(milestone.id)}
                                    className="h-6 px-2 text-xs text-blue-600 border-blue-600 hover:bg-blue-50"
                                    title="Retry fund release - useful when escrow balance has increased"
                                    disabled={isProcessing}
                                  >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Retry Release
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Rule-based validation display */}
                            <div className="bg-gray-50 border rounded-lg p-3">
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${validationInfo.verifierCount >= 2 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="font-medium">Rule 1: Community Verification</span>
                                  </div>
                                  <div className="ml-4 text-gray-600">
                                    {validationInfo.verifierCount}/2 community members verified
                                    {validationInfo.verifierCount >= 2 ? ' ✅' : ' ❌'}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${validationInfo.availableInEscrow >= validationInfo.requiredFunding ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="font-medium">Rule 2: Escrow Amount</span>
                                  </div>
                                  <div className="ml-4 text-gray-600">
                                    ${validationInfo.availableInEscrow.toLocaleString()}/${validationInfo.requiredFunding.toLocaleString()} in escrow
                                    {validationInfo.availableInEscrow >= validationInfo.requiredFunding ? ' ✅' : ' ❌'}
                                  </div>
                                </div>
                              </div>
                              
                              {validationInfo.isValid && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-green-800 text-xs bg-green-50 rounded p-2">
                                    🎉 <strong>Both conditions met!</strong> Funds will be released automatically: 
                                    Release ${validationInfo.requiredFunding.toLocaleString()} → 
                                    Update escrow → Reduce target to $0
                                  </div>
                                </div>
                              )}
                              
                              {!validationInfo.isValid && validationInfo.verifierCount >= 2 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-blue-800 text-xs bg-blue-50 rounded p-2">
                                    ⏳ <strong>Holding funds:</strong> Milestone is verified but escrow has insufficient funds. 
                                    System will wait until ${(validationInfo.requiredFunding - validationInfo.availableInEscrow).toLocaleString()} more is donated.
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {milestone.verificationStatus === 'verified' && validationInfo.verifierCount >= 2 && !validationInfo.isValid && (
                              <div className="mt-2 space-y-1">
                                <p className="text-blue-800 text-xs">
                                  💡 <strong>Tip:</strong> Use "Retry Release" if more donations have been added since last check.
                                </p>
                                {/* Test button to add donation for testing */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddTestDonation(milestone.id)}
                                  className="text-xs h-6 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                  disabled={isProcessing}
                                >
                                  Add Test Donation ($5,000)
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}                  {milestone.verifications && milestone.verifications.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{milestone.verifications.filter((v: any) => v.status === 'approved').length} community verifications</span>
                      </div>
                    </div>
                  )}

                  {/* Emergency Release Section */}
                  {pending > 0 && !milestone.escrowReleased && (
                    <div className="mt-3 pt-3 border-t border-red-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Emergency Release Available</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              disabled={escrowTotal < milestone.fundingAmount || isProcessing}
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Emergency Release
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Emergency Fund Release
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Release Validation Info */}
                              {validationInfo && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-blue-800 text-sm font-medium mb-2">Release Validation Status:</p>
                                  <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-blue-600">Milestone Requirement:</span>
                                      <span className="font-semibold">${validationInfo.requiredFunding.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-blue-600">Available in Escrow:</span>
                                      <span className="font-semibold">${validationInfo.availableInEscrow.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-blue-600">Verifiers Approved:</span>
                                      <span className={`font-semibold ${validationInfo.verifierCount >= 2 ? 'text-green-600' : 'text-red-600'}`}>
                                        {validationInfo.verifierCount}/2 required
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {escrowTotal >= milestone.fundingAmount ? (
                                <p className="text-gray-700">
                                  You are about to release <strong>${milestone.fundingAmount.toLocaleString()}</strong> for milestone "{milestone.title}".
                                  {escrowTotal > milestone.fundingAmount && (
                                    <span className="text-blue-600 block mt-1">
                                      ${(escrowTotal - milestone.fundingAmount).toLocaleString()} will remain in escrow for future milestones.
                                    </span>
                                  )}
                                </p>
                              ) : (
                                <p className="text-red-700">
                                  <strong>Insufficient funds:</strong> This milestone requires ${milestone.fundingAmount.toLocaleString()} but only ${escrowTotal.toLocaleString()} is available in escrow.
                                </p>
                              )}
                              
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-yellow-800 text-sm">
                                  ⚠️ <strong>Warning:</strong> Emergency release bypasses the normal verification process and should only be used in urgent situations.
                                </p>
                              </div>
                              
                              {escrowTotal >= milestone.fundingAmount && (
                                <>
                                  <div>
                                    <Label htmlFor="emergency-reason">Reason for Emergency Release *</Label>
                                    <Textarea
                                      id="emergency-reason"
                                      value={emergencyReason}
                                      onChange={(e) => setEmergencyReason(e.target.value)}
                                      placeholder="Please explain why immediate fund release is necessary..."
                                      rows={3}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleEmergencyRelease(milestone.id)}
                                      variant="destructive"
                                      className="flex-1"
                                      disabled={!emergencyReason.trim() || isProcessing}
                                    >
                                      <Zap className="h-4 w-4 mr-2" />
                                      Release ${milestone.fundingAmount.toLocaleString()} Now
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEmergencyReason("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </>
                              )}
                              
                              {escrowTotal < milestone.fundingAmount && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEmergencyReason("");
                                  }}
                                  className="w-full"
                                >
                                  Close
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
