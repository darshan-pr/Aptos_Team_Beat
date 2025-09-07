"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Star, 
  CheckCircle, 
  Users,
  Award,
  TrendingUp,
  Plus
} from "lucide-react";

interface Verifier {
  id: string;
  name: string;
  reputation: number;
  verificationsCount: number;
  specialties: string[];
  joinDate: string;
  isOnline: boolean;
}

export function VerifierNetwork() {
  const topVerifiers: Verifier[] = [
    {
      id: "1",
      name: "Dr. Maria Santos",
      reputation: 4.9,
      verificationsCount: 127,
      specialties: ["Healthcare", "Infrastructure"],
      joinDate: "2023-01-15",
      isOnline: true
    },
    {
      id: "2",
      name: "Prof. James Chen",
      reputation: 4.8,
      verificationsCount: 89,
      specialties: ["Education", "Environment"],
      joinDate: "2023-03-22",
      isOnline: false
    },
    {
      id: "3",
      name: "Sarah Mitchell",
      reputation: 4.7,
      verificationsCount: 156,
      specialties: ["Disaster Relief", "Poverty Alleviation"],
      joinDate: "2022-11-08",
      isOnline: true
    },
    {
      id: "4",
      name: "Dr. Ahmed Hassan",
      reputation: 4.6,
      verificationsCount: 78,
      specialties: ["Healthcare", "Education"],
      joinDate: "2023-05-10",
      isOnline: true
    }
  ];

  const networkStats = [
    {
      label: "Active Verifiers",
      value: "89",
      icon: Users,
      color: "blue"
    },
    {
      label: "Pending Reviews",
      value: "12",
      icon: CheckCircle,
      color: "orange"
    },
    {
      label: "Avg. Response Time",
      value: "2.4 hrs",
      icon: TrendingUp,
      color: "green"
    }
  ];

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      "Healthcare": "bg-red-100 text-red-800",
      "Education": "bg-blue-100 text-blue-800",
      "Environment": "bg-green-100 text-green-800",
      "Infrastructure": "bg-purple-100 text-purple-800",
      "Disaster Relief": "bg-orange-100 text-orange-800",
      "Poverty Alleviation": "bg-yellow-100 text-yellow-800"
    };
    return colors[specialty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Verifier Network Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Verifier Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {networkStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'orange' ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'orange' ? 'text-orange-600' : 'text-green-600'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{stat.value}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top Verifiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Top Verifiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topVerifiers.map((verifier) => (
            <div key={verifier.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {verifier.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {verifier.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{verifier.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{verifier.reputation}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {verifier.verificationsCount}
                  </div>
                  <div className="text-xs text-gray-600">verifications</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {verifier.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(specialty)}`}
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Member since {new Date(verifier.joinDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Become a Verifier */}
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Become a Verifier</h3>
          <p className="text-sm text-gray-600 mb-4">
            Help ensure transparency and accountability in charitable projects
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Apply to Verify
          </Button>
        </CardContent>
      </Card>

      {/* Verification Process */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How Verification Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "NGOs submit milestone completion reports",
            "Community verifiers review evidence",
            "Consensus reached through voting",
            "Smart contracts release funds automatically"
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span className="text-gray-600">{step}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
