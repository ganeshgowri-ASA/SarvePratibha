'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Target, AlertTriangle } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    category: 'Technical',
    skills: [
      { name: 'React/Next.js', avgCurrent: 3.8, avgTarget: 4.5, gap: 0.7, employees: 45 },
      { name: 'Node.js/Express', avgCurrent: 3.5, avgTarget: 4.0, gap: 0.5, employees: 38 },
      { name: 'Python', avgCurrent: 2.8, avgTarget: 3.5, gap: 0.7, employees: 22 },
      { name: 'AWS/Cloud', avgCurrent: 2.5, avgTarget: 4.0, gap: 1.5, employees: 30 },
      { name: 'System Design', avgCurrent: 3.0, avgTarget: 4.0, gap: 1.0, employees: 25 },
    ],
  },
  {
    category: 'Leadership',
    skills: [
      { name: 'People Management', avgCurrent: 3.2, avgTarget: 4.0, gap: 0.8, employees: 20 },
      { name: 'Strategic Thinking', avgCurrent: 2.9, avgTarget: 4.0, gap: 1.1, employees: 15 },
      { name: 'Communication', avgCurrent: 3.5, avgTarget: 4.5, gap: 1.0, employees: 40 },
      { name: 'Decision Making', avgCurrent: 3.3, avgTarget: 4.0, gap: 0.7, employees: 25 },
    ],
  },
  {
    category: 'Domain',
    skills: [
      { name: 'HRMS Domain', avgCurrent: 3.0, avgTarget: 4.0, gap: 1.0, employees: 35 },
      { name: 'Compliance/Legal', avgCurrent: 2.5, avgTarget: 3.5, gap: 1.0, employees: 10 },
      { name: 'Data Analytics', avgCurrent: 2.8, avgTarget: 4.0, gap: 1.2, employees: 28 },
      { name: 'UX/Design', avgCurrent: 3.2, avgTarget: 4.0, gap: 0.8, employees: 12 },
    ],
  },
];

const getGapColor = (gap: number) => {
  if (gap >= 1.5) return 'text-red-600 bg-red-50';
  if (gap >= 1.0) return 'text-orange-600 bg-orange-50';
  if (gap >= 0.5) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};

export default function SkillMatrixPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Matrix & Gap Analysis</h1>
          <p className="text-sm text-gray-500">Department-level skill assessment and gap identification</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-600">5</p>
            <p className="text-sm text-gray-500">Critical Skill Gaps (&gt;1.0)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-gray-500">Moderate Gaps (0.5-1.0)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500">Skills at Target</p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Categories */}
      {SKILL_CATEGORIES.map((cat) => (
        <Card key={cat.category}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={16} className="text-teal-600" />
              {cat.category} Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-500">Skill</th>
                    <th className="text-center py-2 font-medium text-gray-500">Employees</th>
                    <th className="text-center py-2 font-medium text-gray-500 w-48">Current Level</th>
                    <th className="text-center py-2 font-medium text-gray-500">Target</th>
                    <th className="text-center py-2 font-medium text-gray-500">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.skills.map((skill) => (
                    <tr key={skill.name} className="border-b last:border-0">
                      <td className="py-3 font-medium">{skill.name}</td>
                      <td className="text-center py-3">{skill.employees}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={(skill.avgCurrent / 5) * 100} className="h-2 flex-1" />
                          <span className="text-sm w-8">{skill.avgCurrent}</span>
                        </div>
                      </td>
                      <td className="text-center py-3">{skill.avgTarget}/5</td>
                      <td className="text-center py-3">
                        <Badge className={`${getGapColor(skill.gap)} text-xs`}>
                          {skill.gap >= 1.0 && <AlertTriangle size={10} className="mr-0.5" />}
                          -{skill.gap}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
