"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { projectStore, type Project } from "@/lib/projectStore";
import { 
  DollarSign, 
  Download,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  Shield
} from "lucide-react";

export function TrackFunds() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const allProjects = projectStore.getAllProjects();
    setProjects(allProjects);
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0].id);
    }
  }, [selectedProject]);

  const currentProject = projects.find(p => p.id === selectedProject);

  const getEscrowSummary = () => {
    if (!currentProject) return { totalEscrow: 0, totalReleased: 0, milestoneData: [] };

    let totalEscrow = 0;
    let totalReleased = 0;
    
    const milestoneData = currentProject.milestones.map(milestone => {
      const escrowTotal = projectStore.getTotalEscrowForMilestone(currentProject.id, milestone.id);
      const released = milestone.escrowReleased ? escrowTotal : 0;
      
      totalEscrow += escrowTotal;
      totalReleased += released;

      return {
        milestone,
        escrowTotal,
        released,
        pending: escrowTotal - released
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

  const exportReport = () => {
    const stats = projectStore.getProjectStats();
    console.log("Exporting financial report...", stats);
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
              Track Funds - Escrow System
            </CardTitle>
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
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
                ${(totalEscrow - totalReleased).toLocaleString()}
              </div>
              <div className="text-gray-600">Pending Release</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Release Progress</span>
              <span>{totalEscrow > 0 ? Math.round((totalReleased / totalEscrow) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalEscrow > 0 ? (totalReleased / totalEscrow) * 100 : 0}%` }}
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
            {milestoneData.map(({ milestone, escrowTotal, released, pending }) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(milestone)}
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone)}`}>
                      {getStatusText(milestone)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${escrowTotal.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Target: ${milestone.fundingAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">In Escrow</div>
                    <div className="font-medium text-purple-600">${escrowTotal.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Released</div>
                    <div className="font-medium text-green-600">${released.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Pending</div>
                    <div className="font-medium text-blue-600">${pending.toLocaleString()}</div>
                  </div>
                </div>

                {milestone.verifications && milestone.verifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{milestone.verifications.filter((v: any) => v.status === 'approved').length} community verifications</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
