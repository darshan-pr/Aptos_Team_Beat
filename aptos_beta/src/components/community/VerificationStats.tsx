"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  Target,
  Vote
} from "lucide-react";

export function VerificationStats() {
  const stats = [
    {
      title: "Pending Reviews",
      value: "23",
      change: "+5 today",
      icon: Clock,
      color: "orange"
    },
    {
      title: "Completed Today",
      value: "12",
      change: "+3 from yesterday",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Active Verifiers",
      value: "89",
      change: "+2 this week",
      icon: Users,
      color: "blue"
    },
    {
      title: "Success Rate",
      value: "94%",
      change: "+2% this month",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const recentActivity = [
    {
      project: "Clean Water Initiative",
      milestone: "Well Drilling Completed",
      status: "approved",
      votes: "8/10",
      time: "2 hours ago"
    },
    {
      project: "Education Center",
      milestone: "Foundation Laid",
      status: "pending",
      votes: "3/10",
      time: "4 hours ago"
    },
    {
      project: "Solar Health Clinic",
      milestone: "Equipment Installed",
      status: "approved",
      votes: "9/10",
      time: "6 hours ago"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      orange: "bg-orange-100 text-orange-600",
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600"
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Verification Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getColorClasses(stat.color)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.title}</div>
                  </div>
                </div>
                <div className="text-xs text-green-600">{stat.change}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Vote className="h-4 w-4 mr-2" />
            Start Verifying
          </Button>
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            View My Reviews
          </Button>
          <Button variant="outline" className="w-full">
            <Award className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm text-gray-900 mb-1">
                {activity.project}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {activity.milestone}
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
                <div className="text-xs text-gray-500">
                  {activity.votes} • {activity.time}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Review all evidence carefully</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Provide constructive feedback</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Upload supporting evidence when possible</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Vote based on objective criteria</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
