"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  Building2, 
  CheckCircle,
  TrendingUp,
  Globe
} from "lucide-react";

export function CommunityStats() {
  const stats = [
    {
      title: "Active Donors",
      value: "2,847",
      change: "+12% this month",
      changeType: "positive",
      icon: Users,
      color: "blue"
    },
    {
      title: "Total Donated",
      value: "$2.5M",
      change: "+18% this month",
      changeType: "positive",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Verified NGOs",
      value: "156",
      change: "+8 new this month",
      changeType: "positive",
      icon: Building2,
      color: "purple"
    },
    {
      title: "Community Verifiers",
      value: "89",
      change: "+5 this week",
      changeType: "positive",
      icon: CheckCircle,
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600"
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Community Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stat.title}
                </div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-4">Impact This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">47</div>
              <div className="text-sm text-gray-600">Projects Funded</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">128</div>
              <div className="text-sm text-gray-600">Milestones Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Verification Success Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
