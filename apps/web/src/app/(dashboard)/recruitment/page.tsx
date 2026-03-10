'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Calendar,
  Mail,
  BarChart3,
  Database,
  Globe,
  FileText,
  TrendingUp,
  Clock,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalRequisitions: number;
  openPositions: number;
  totalCandidates: number;
  totalApplications: number;
  hiredThisMonth: number;
  avgTimeToHire: number;
}

export default function RecruitmentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequisitions: 0,
    openPositions: 0,
    totalCandidates: 0,
    totalApplications: 0,
    hiredThisMonth: 0,
    avgTimeToHire: 0,
  });

  useEffect(() => {
    // In production, fetch from /api/recruitment/analytics
    setStats({
      totalRequisitions: 24,
      openPositions: 15,
      totalCandidates: 342,
      totalApplications: 186,
      hiredThisMonth: 8,
      avgTimeToHire: 28,
    });
  }, []);

  const statCards = [
    { label: 'Open Positions', value: stats.openPositions, icon: Briefcase, color: 'text-blue-600 bg-blue-50', href: '/recruitment/requisitions' },
    { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-purple-600 bg-purple-50', href: '/recruitment/candidates' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'text-orange-600 bg-orange-50', href: '/recruitment/candidates' },
    { label: 'Hired This Month', value: stats.hiredThisMonth, icon: CheckCircle, color: 'text-green-600 bg-green-50', href: '/recruitment/analytics' },
    { label: 'Avg. Time to Hire', value: `${stats.avgTimeToHire}d`, icon: Clock, color: 'text-teal-600 bg-teal-50', href: '/recruitment/analytics' },
    { label: 'Requisitions', value: stats.totalRequisitions, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50', href: '/recruitment/requisitions' },
  ];

  const quickActions = [
    { label: 'New Requisition', href: '/recruitment/requisitions/new', icon: FileText, description: 'Create a new job requisition' },
    { label: 'Add Candidate', href: '/recruitment/candidates?action=add', icon: UserPlus, description: 'Manually add a candidate' },
    { label: 'Schedule Interview', href: '/recruitment/interviews?action=schedule', icon: Calendar, description: 'Schedule a new interview' },
    { label: 'View Pipeline', href: '/recruitment/requisitions', icon: Briefcase, description: 'View recruitment pipeline' },
    { label: 'Import Candidates', href: '/recruitment/sources', icon: Globe, description: 'Import from job boards' },
    { label: 'Talent Pool', href: '/recruitment/talent-pool', icon: Database, description: 'Browse talent pool' },
    { label: 'Document Review', href: '/recruitment/document-review', icon: CheckCircle, description: 'Review candidate documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your hiring pipeline and track recruitment progress</p>
        </div>
        <Link href="/recruitment/requisitions/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FileText className="mr-2 h-4 w-4" />
            New Requisition
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4 pb-4">
                <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 hover:border-teal-200 transition-colors text-center cursor-pointer">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mb-2">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{action.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Requisitions', desc: 'Manage job requisitions and approvals', href: '/recruitment/requisitions', icon: FileText, count: stats.totalRequisitions },
          { label: 'Candidates', desc: 'Search and manage candidate database', href: '/recruitment/candidates', icon: Users, count: stats.totalCandidates },
          { label: 'Interviews', desc: 'View upcoming interviews and schedule', href: '/recruitment/interviews', icon: Calendar, count: 12 },
          { label: 'Offers', desc: 'Generate and track offer letters', href: '/recruitment/offers', icon: Mail, count: 5 },
          { label: 'Analytics', desc: 'Hiring funnel and recruitment metrics', href: '/recruitment/analytics', icon: BarChart3 },
          { label: 'Talent Pool', desc: 'Curated pools of potential hires', href: '/recruitment/talent-pool', icon: Database },
          { label: 'Sources', desc: 'Import from Naukri, LinkedIn, Indeed', href: '/recruitment/sources', icon: Globe },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.count !== undefined && (
                    <Badge variant="secondary">{item.count}</Badge>
                  )}
                </div>
                <h3 className="font-semibold mt-3">{item.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
