'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const DEPT_DIVERSITY = [
  { dept: 'Engineering', maleRatio: 72, femaleRatio: 25, otherRatio: 3, payGap: 4.1, inclusionScore: 3.8 },
  { dept: 'Product', maleRatio: 53, femaleRatio: 44, otherRatio: 3, payGap: 1.8, inclusionScore: 4.3 },
  { dept: 'Design', maleRatio: 42, femaleRatio: 55, otherRatio: 3, payGap: 0.5, inclusionScore: 4.6 },
  { dept: 'Marketing', maleRatio: 45, femaleRatio: 50, otherRatio: 5, payGap: 2.0, inclusionScore: 4.1 },
  { dept: 'Sales', maleRatio: 67, femaleRatio: 30, otherRatio: 3, payGap: 5.2, inclusionScore: 3.5 },
  { dept: 'HR', maleRatio: 30, femaleRatio: 65, otherRatio: 5, payGap: 0.8, inclusionScore: 4.7 },
  { dept: 'Finance', maleRatio: 60, femaleRatio: 38, otherRatio: 2, payGap: 3.0, inclusionScore: 3.9 },
];

const YEARLY_TRENDS = [
  { year: '2023', womenPct: 32, payGap: 5.1, inclusionIndex: 3.6 },
  { year: '2024', womenPct: 35, payGap: 4.2, inclusionIndex: 3.9 },
  { year: '2025', womenPct: 37, payGap: 3.5, inclusionIndex: 4.1 },
  { year: '2026', womenPct: 38, payGap: 3.2, inclusionIndex: 4.2 },
];

export default function DIReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">D&I Report</h1>
          <p className="text-sm text-gray-500">Detailed diversity and inclusion analytics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2026">
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download size={16} className="mr-2" /> Export</Button>
        </div>
      </div>

      {/* Yearly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Year-over-Year Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Year</th>
                  <th className="text-center py-2 font-medium text-gray-500">Women %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Pay Gap %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Inclusion Index</th>
                  <th className="text-center py-2 font-medium text-gray-500">Trend</th>
                </tr>
              </thead>
              <tbody>
                {YEARLY_TRENDS.map((yr, idx) => (
                  <tr key={yr.year} className="border-b last:border-0">
                    <td className="py-3 font-medium">{yr.year}</td>
                    <td className="text-center py-3">{yr.womenPct}%</td>
                    <td className="text-center py-3">{yr.payGap}%</td>
                    <td className="text-center py-3">{yr.inclusionIndex}/5</td>
                    <td className="text-center py-3">
                      {idx > 0 ? (
                        yr.inclusionIndex > YEARLY_TRENDS[idx - 1].inclusionIndex
                          ? <TrendingUp size={16} className="text-green-600 inline" />
                          : <TrendingDown size={16} className="text-red-600 inline" />
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Department Diversity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Department-wise Diversity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Department</th>
                  <th className="text-center py-2 font-medium text-gray-500">Male %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Female %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Other %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Pay Gap %</th>
                  <th className="text-center py-2 font-medium text-gray-500">Inclusion Score</th>
                </tr>
              </thead>
              <tbody>
                {DEPT_DIVERSITY.map((dept) => (
                  <tr key={dept.dept} className="border-b last:border-0">
                    <td className="py-3 font-medium">{dept.dept}</td>
                    <td className="text-center py-3">{dept.maleRatio}%</td>
                    <td className="text-center py-3">{dept.femaleRatio}%</td>
                    <td className="text-center py-3">{dept.otherRatio}%</td>
                    <td className="text-center py-3">
                      <span className={dept.payGap <= 2 ? 'text-green-600' : dept.payGap <= 4 ? 'text-yellow-600' : 'text-red-600'}>
                        {dept.payGap}%
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className={dept.inclusionScore >= 4 ? 'text-green-600' : dept.inclusionScore >= 3.5 ? 'text-yellow-600' : 'text-red-600'}>
                        {dept.inclusionScore}/5
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
