"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { VerificationStats } from "@/components/community/VerificationStats";
import { VerifierNetwork } from "@/components/community/VerifierNetwork";
import { CommunityProjectView } from "@/components/community/CommunityProjectView";
import { SearchIcon } from "@/components/explore/SearchIcon";
import { ChevronRight, Home, MessageCircle, Shield, Users, Activity } from "lucide-react";

type ActiveView = "feed" | "verification" | "network";

export default function CommunityPage() {
  const [activeView, setActiveView] = useState<ActiveView>("feed");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>("");

  const views = [
    { id: "feed" as const, name: "Community Feed", icon: MessageCircle, description: "Latest updates and discussions" },
    { id: "verification" as const, name: "Project Verification", icon: Shield, description: "Verify project milestones" },
    { id: "network" as const, name: "Verifier Network", icon: Users, description: "Connect with verifiers" }
  ];

  const handleProjectSelect = (projectId: string, projectTitle: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectTitle(projectTitle);
    setActiveView("feed");
  };

  const handleBackToCommunity = () => {
    setSelectedProjectId(null);
    setSelectedProjectTitle("");
    setSelectedPost(null);
  };

  const renderContent = () => {
    if (selectedProjectId) {
      return <CommunityProjectView projectId={selectedProjectId} />;
    }
    
    switch (activeView) {
      case "feed":
        return <CommunityFeed onProjectSelect={handleProjectSelect} />;
      case "verification":
        return (
          <div className="bg-white rounded-lg border border-purple-100 p-8 text-center">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Verification</h3>
            <p className="text-gray-600 mb-4">Help verify project milestones and ensure transparency</p>
            <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all">
              Start Verifying
            </button>
          </div>
        );
      case "network":
        return <VerifierNetwork />;
      default:
        return <CommunityFeed onProjectSelect={handleProjectSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16">
      <Navbar />
      
      {/* Fixed Breadcrumb Navigation */}
      {(selectedPost || selectedProjectId) && (
        <div className="bg-white border-b border-purple-100 fixed top-16 left-0 right-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToCommunity}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <Home className="h-4 w-4 mr-1" />
                Community
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate max-w-md">
                {selectedProjectTitle || selectedPost}
              </span>
            </nav>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${selectedPost || selectedProjectId ? 'pt-24' : ''}`}>
        {!selectedPost && !selectedProjectId ? (
          <>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  Community Hub
                </h1>
                <p className="text-lg text-gray-600">
                  Connect, verify, and engage with the charitable community
                </p>
              </div>
              <SearchIcon />
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-1">
                <nav className="flex space-x-1">
                  {views.map((view) => {
                    const Icon = view.icon;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex-1 ${
                          activeView === view.id
                            ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-purple-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div>{view.name}</div>
                          <div className={`text-xs ${activeView === view.id ? 'text-purple-100' : 'text-gray-500'}`}>
                            {view.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {renderContent()}
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <VerificationStats />
                
                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-lg border border-purple-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="font-medium text-purple-900">Verify Project</div>
                      <div className="text-sm text-purple-600">Help verify milestone completion</div>
                    </button>
                    <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="font-medium text-green-900">Join Discussion</div>
                      <div className="text-sm text-green-600">Engage with the community</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            {/* Project detail or post detail view */}
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}
