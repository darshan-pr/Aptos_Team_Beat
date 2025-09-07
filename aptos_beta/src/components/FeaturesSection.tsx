"use client";

import { 
  Shield, 
  Eye, 
  Target, 
  Users, 
  Lock,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "All donations are secured by Aptos blockchain technology, ensuring immutable transaction records and complete fund safety."
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "Track every donation from source to destination. View real-time fund allocation and project progress updates."
    },
    {
      icon: Target,
      title: "Milestone-Based Releases",
      description: "Funds are released only when project milestones are verified by our decentralized community network."
    },
    {
      icon: Users,
      title: "Community Verification",
      description: "Trusted community members verify project progress, ensuring accountability and preventing misuse of funds."
    },
    {
      icon: Lock,
      title: "Secure Escrow",
      description: "Smart contracts hold donations in secure escrow until milestone completion is verified and approved."
    },
    {
      icon: FileText,
      title: "Detailed Reporting",
      description: "NGOs provide comprehensive reports with photos, documents, and progress updates for each milestone."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Project Creation",
      description: "NGOs submit detailed project proposals with clear milestones and funding requirements."
    },
    {
      step: "2",
      title: "Community Review",
      description: "Projects undergo community review and verification before being listed for donations."
    },
    {
      step: "3",
      title: "Secure Donations",
      description: "Donors contribute to projects with funds held securely in blockchain-based escrow."
    },
    {
      step: "4",
      title: "Milestone Verification",
      description: "Community verifiers review progress reports and approve milestone completions."
    },
    {
      step: "5",
      title: "Fund Release",
      description: "Smart contracts automatically release funds upon successful milestone verification."
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Features Grid */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Open Hands?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our platform combines blockchain technology with community governance 
            to create the most transparent charitable donation system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-white to-purple-50/60 rounded-3xl p-8 md:p-16 shadow-xl border border-purple-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Our transparent process ensures every donation makes a real impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-purple-200 transform -translate-y-1/2 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
