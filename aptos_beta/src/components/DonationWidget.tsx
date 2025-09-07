"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { projectStore } from "@/lib/projectStore";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { donateToProject } from "@/entry-functions/donateToProject";
import { projectExists } from "@/view-functions/charitableFunding";
import { 
  DollarSign, 
  Heart, 
  CreditCard,
  Shield,
  Users,
  Target
} from "lucide-react";

interface DonationWidgetProps {
  projectId: string;
  projectTitle: string;
  targetAmount: number;
  raisedAmount: number;
  onDonationComplete?: () => void;
}

export function DonationWidget({ 
  projectId, 
  projectTitle, 
  targetAmount, 
  raisedAmount,
  onDonationComplete 
}: DonationWidgetProps) {
  const { toast } = useToast();
  const { signAndSubmitTransaction, account } = useWallet();
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [25, 50, 100, 250, 500];

  // Helper function to convert local project ID to blockchain project ID
  const getBlockchainProjectId = (localProjectId: string): number => {
    // Local project IDs are strings like "1", "2", "3"
    // Blockchain project IDs are numbers starting from 0
    const localId = parseInt(localProjectId, 10);
    if (isNaN(localId) || localId < 1) {
      throw new Error(`Invalid project ID: ${localProjectId}`);
    }
    return localId - 1; // Convert from 1-based to 0-based
  };

  // Get current donation target information
  const getDonationTargetInfo = () => {
    return projectStore.getTargetMilestoneForDonation(projectId);
  };

  const targetInfo = getDonationTargetInfo();

  const getProgressPercentage = () => {
    return Math.round((raisedAmount / targetAmount) * 100);
  };

  const getRemainingAmount = () => {
    return Math.max(0, targetAmount - raisedAmount);
  };

  const handleQuickAmount = (amount: number) => {
    setDonationAmount(amount.toString());
  };

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount > 10000) {
      toast({
        title: "Amount Too Large",
        description: "For demo purposes, maximum donation is $10,000.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get donation target information for the milestone
      const targetInfo = getDonationTargetInfo();
      if (!targetInfo.milestoneId) {
        throw new Error(targetInfo.reason);
      }
      
      // Validate that the project exists on the blockchain
      // Convert local project ID to blockchain project ID
      let blockchainProjectId: number;
      let projectExistsOnChain = false;
      
      try {
        blockchainProjectId = getBlockchainProjectId(projectId);
        projectExistsOnChain = await projectExists(blockchainProjectId);
      } catch (error) {
        console.warn("Error checking project existence on blockchain:", error);
        // Continue with local-only donation for demo purposes
        blockchainProjectId = 0; // fallback value
      }
      
      // Convert amount to blockchain format (octas)
      const donationAmountOctas = BigInt(amount * 10**8);
      
      // Get donor address from the connected wallet
      const donorAddress = account?.address?.toString() || "0x1234567890abcdef";
      
      // Only attempt blockchain transaction if project exists on-chain
      if (projectExistsOnChain) {
        // Create the transaction payload - use the blockchain project ID
        const transaction = donateToProject({
          projectId: blockchainProjectId,
          amount: donationAmountOctas,
        });

        // Submit the transaction to the blockchain
        const result = await signAndSubmitTransaction(transaction);
        console.log("Donation transaction submitted:", result);
      } else {
        console.log("Project not on blockchain - proceeding with local-only demo donation");
      }

      // After blockchain transaction is successful, update local state
      const localResult = projectStore.addSmartDonation(
        projectId,
        amount,
        donorAddress,
        donorName.trim() || "Anonymous Donor"
      );

      if (localResult.success) {
        toast({
          title: "Donation Secured in Escrow! 🎉",
          description: `Thank you for donating $${amount.toLocaleString()} to ${projectTitle}! ${localResult.message}. Funds are safely held in escrow ${projectExistsOnChain ? "on the blockchain" : "in demo mode"}.`
        });

        // Reset form
        setDonationAmount("");
        setDonorName("");

        // Notify parent component
        onDonationComplete?.();
      } else {
        throw new Error(localResult.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      console.error("Donation error:", error);
      
      // Provide more helpful error messages for common issues
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes("PROJECT_DOESNT_EXIST") || errorMessage.includes("non-existent project")) {
        userFriendlyMessage = "This project doesn't exist on the blockchain yet. You can still support it in demo mode, but on-chain transactions aren't available.";
      }
      
      toast({
        title: "Donation Failed",
        description: userFriendlyMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Heart className="h-5 w-5" />
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Donation Target */}
        {targetInfo.milestone && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Current Funding Target</span>
            </div>
            <p className="text-sm text-blue-700">
              <strong>"{targetInfo.milestone.title}"</strong> - {targetInfo.reason}
            </p>
            {targetInfo.milestone && (
              <div className="mt-2 text-xs text-blue-600">
                Target: ${targetInfo.milestone.fundingAmount.toLocaleString()} | 
                Current: ${projectStore.getTotalEscrowForMilestone(projectId, targetInfo.milestone.id).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {!targetInfo.milestone && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Donation Status</span>
            </div>
            <p className="text-sm text-gray-700">{targetInfo.reason}</p>
          </div>
        )}

        {/* Progress Display */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-900">
              ${raisedAmount.toLocaleString()} raised
            </span>
            <span className="text-gray-600">
              {getProgressPercentage()}% of ${targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>${getRemainingAmount().toLocaleString()} remaining</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Join the supporters</span>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="space-y-4">
          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Quick amounts (USD)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={donationAmount === amount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className={`${
                    donationAmount === amount.toString() 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "border-green-600 text-green-600 hover:bg-green-50"
                  }`}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium text-gray-700">
              Custom amount (USD)
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="custom-amount"
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                min="1"
                max="10000"
              />
            </div>
          </div>

          {/* Donor Name (Optional) */}
          <div>
            <Label htmlFor="donor-name" className="text-sm font-medium text-gray-700">
              Your name (optional)
            </Label>
            <Input
              id="donor-name"
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Anonymous Donor"
              className="mt-1 border-green-300 focus:border-green-500 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to donate anonymously
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Escrow Protection</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Your donation is held in secure escrow until milestone completion and community verification.
            </p>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={!donationAmount || parseFloat(donationAmount) <= 0 || isProcessing || !targetInfo.milestone}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {!targetInfo.milestone ? (
              "Donations Not Available"
            ) : isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Donate ${donationAmount || "0"}
              </>
            )}
          </Button>

          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> This is a simulation. No real payments are processed.
              Your "donation" will update the project statistics for demonstration purposes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
