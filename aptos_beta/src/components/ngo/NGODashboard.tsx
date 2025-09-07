"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Edit3, 
  DollarSign, 
  Building2,
  Users,
  Target,
  TrendingUp
} from "lucide-react";
import { RequestFunding } from "./RequestFunding";
import { UpdateMilestones } from "./UpdateMilestones";
import { TrackFunds } from "./TrackFunds";

type ActiveSection = "overview" | "request" | "milestones" | "funds";

export function NGODashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");

  const sidebarItems = [
    {
      id: "request" as const,
      name: "Request Funding",
      icon: PlusCircle,
      description: "Create new projects"
    },
    {
      id: "milestones" as const,
      name: "Update Milestones",
      icon: Edit3,
      description: "Track project progress"
    },
    {
      id: "funds" as const,
      name: "Track Funds",
      icon: DollarSign,
      description: "Monitor donations"
    }
  ];

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: Building2,
      change: "+2 this month",
      changeType: "positive"
    },
    {
      title: "Total Raised",
      value: "$45,230",
      icon: DollarSign,
      change: "+15% from last month",
      changeType: "positive"
    },
    {
      title: "Milestones Completed",
      value: "28",
      icon: Target,
      change: "8 pending review",
      changeType: "neutral"
    },
    {
      title: "Community Score",
      value: "4.8/5",
      icon: Users,
      change: "Based on 156 reviews",
      changeType: "positive"
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "request":
        return <RequestFunding />;
      case "milestones":
        return <UpdateMilestones />;
      case "funds":
        return <TrackFunds />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  Welcome to Your NGO Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Manage your charitable projects, track donations, and update milestones 
                  all in one transparent platform powered by blockchain technology.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => setActiveSection("request")}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveSection("milestones")}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <p className={`text-sm mt-2 ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Milestone completed",
                      project: "Clean Water Initiative",
                      time: "2 hours ago",
                      status: "success"
                    },
                    {
                      action: "New donation received",
                      project: "Education for All",
                      time: "5 hours ago",
                      status: "info"
                    },
                    {
                      action: "Project approved",
                      project: "Solar Panel Installation",
                      time: "1 day ago",
                      status: "success"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.project}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-blue-100 fixed left-0 top-16 h-full z-10">
        <div className="p-6">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">NGO Dashboard</h2>
          
          {/* Overview */}
          <button
            onClick={() => setActiveSection("overview")}
            className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 ${
              activeSection === "overview"
                ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border border-blue-200 shadow-sm"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-5 w-5 ${activeSection === "overview" ? "text-green-600" : ""}`} />
              <div>
                <div className="font-medium">Overview</div>
                <div className="text-xs text-gray-500">Dashboard summary</div>
              </div>
            </div>
          </button>

          {/* Main Navigation */}
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${activeSection === item.id ? "text-green-600" : ""}`} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64">
        <div className="p-6 max-h-screen overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
