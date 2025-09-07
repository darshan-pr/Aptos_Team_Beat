"use client";

import { NGODashboard } from "@/components/ngo/NGODashboard";
import { Navbar } from "@/components/Navbar";

export default function NGOPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <NGODashboard />
    </div>
  );
}
