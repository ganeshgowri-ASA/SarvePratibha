'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, BarChart3, GitBranch, Star, Target } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Talent Profiles', value: '185', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'High Potentials', value: '28', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Succession Plans', value: '12', icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Skill Gaps Found', value: '34', icon: Target, color: 'text-red-600', bg: 'bg-red-50' },
];

// 9-Box Grid Data
const NINE_BOX: { label: string; performance: string; potential: string; count: number; color: string; employees: string[] }[] = [
  { label: 'Stars', performance: 'HIGH', potential: 'HIGH', count: 12, color: 'bg-green-500', employees: ['Priya S.', 'Rahul M.', 'Anita K.'] },
  { label: 'High Potential', performance: 'MEDIUM', potential: 'HIGH', count: 16, color: 'bg-green-400', employees: ['Vikram T.', 'Sneha P.'] },
  { label: 'Potential Gem', performance: 'LOW', potential: 'HIGH', count: 5, color: 'bg-yellow-400', employees: ['Kiran D.'] },
  { label: 'High Performer', performance: 'HIGH', potential: 'MEDIUM', count: 22, color: 'bg-blue-500', employees: ['Deepak R.', 'Meera G.'] },
  { label: 'Core Player', performance: 'MEDIUM', potential: 'MEDIUM', count: 85, color: 'bg-blue-400', employees: ['Many employees...'] },
  { label: 'Inconsistent', performance: 'LOW', potential: 'MEDIUM', count: 18, color: 'bg-yellow-500', employees: ['Suresh K.'] },
  { label: 'Trusted Pro', performance: 'HIGH', potential: 'LOW', count: 15, color: 'bg-blue-300', employees: ['Ramesh V.'] },
  { label: 'Effective', performance: 'MEDIUM', potential: 'LOW', count: 20, color: 'bg-gray-400', employees: ['Sunita A.'] },
  { label: 'Risk', performance: 'LOW', potential: 'LOW', count: 7, color: 'bg-red-400', employees: ['Amit B.'] },
];

export default function TalentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Management</h1>
          <p className="text-sm text-gray-500">9-box grid, succession planning, and skill gap analysis</p>
        </div>
        <div className="flex gap-2">
          <Link href="/talent/skills">
            <Button variant="outline"><BarChart3 size={16} className="mr-2" /> Skill Matrix</Button>
          </Link>
          <Link href="/talent/succession">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <GitBranch size={16} className="mr-2" /> Succession Plans
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 9-Box Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">9-Box Talent Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="flex flex-col items-center mr-4">
              <span className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">Potential</span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-2">
                {/* Row labels at top */}
                <div className="text-center text-xs text-gray-500 pb-1">Low Performance</div>
                <div className="text-center text-xs text-gray-500 pb-1">Medium Performance</div>
                <div className="text-center text-xs text-gray-500 pb-1">High Performance</div>

                {/* High Potential Row */}
                {[NINE_BOX[2], NINE_BOX[1], NINE_BOX[0]].map((cell) => (
                  <div key={cell.label} className={`${cell.color} text-white rounded-lg p-3 min-h-[100px] cursor-pointer hover:opacity-90 transition-opacity`}>
                    <p className="text-xs font-bold">{cell.label}</p>
                    <p className="text-2xl font-bold mt-1">{cell.count}</p>
                    <p className="text-xs opacity-80 mt-0.5">{cell.employees[0]}...</p>
                  </div>
                ))}

                {/* Medium Potential Row */}
                {[NINE_BOX[5], NINE_BOX[4], NINE_BOX[3]].map((cell) => (
                  <div key={cell.label} className={`${cell.color} text-white rounded-lg p-3 min-h-[100px] cursor-pointer hover:opacity-90 transition-opacity`}>
                    <p className="text-xs font-bold">{cell.label}</p>
                    <p className="text-2xl font-bold mt-1">{cell.count}</p>
                    <p className="text-xs opacity-80 mt-0.5">{cell.employees[0]}...</p>
                  </div>
                ))}

                {/* Low Potential Row */}
                {[NINE_BOX[8], NINE_BOX[7], NINE_BOX[6]].map((cell) => (
                  <div key={cell.label} className={`${cell.color} text-white rounded-lg p-3 min-h-[100px] cursor-pointer hover:opacity-90 transition-opacity`}>
                    <p className="text-xs font-bold">{cell.label}</p>
                    <p className="text-2xl font-bold mt-1">{cell.count}</p>
                    <p className="text-xs opacity-80 mt-0.5">{cell.employees[0]}...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
