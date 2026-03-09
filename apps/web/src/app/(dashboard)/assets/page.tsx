'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Laptop, Monitor, Smartphone, Headphones, Package, Search } from 'lucide-react';

const MY_ASSETS = [
  { id: '1', name: 'MacBook Pro 14"', assetTag: 'AST-LAP-001', category: 'Laptop', make: 'Apple', serial: 'C02XR1Z3JHD5', assignedDate: '15 Jan 2024', condition: 'Good' },
  { id: '2', name: 'Dell Monitor 27"', assetTag: 'AST-MON-015', category: 'Monitor', make: 'Dell', serial: 'DL2742HJ83', assignedDate: '15 Jan 2024', condition: 'Good' },
  { id: '3', name: 'iPhone 15 Pro', assetTag: 'AST-PHN-042', category: 'Phone', make: 'Apple', serial: 'AP15PR0823', assignedDate: '1 Mar 2025', condition: 'New' },
  { id: '4', name: 'Jabra Headset', assetTag: 'AST-ACC-110', category: 'Accessory', make: 'Jabra', serial: 'JB85H2023', assignedDate: '15 Jan 2024', condition: 'Good' },
];

const INVENTORY = [
  { id: '1', name: 'MacBook Pro 14"', assetTag: 'AST-LAP-050', category: 'Laptop', status: 'AVAILABLE', condition: 'NEW' },
  { id: '2', name: 'Dell Monitor 27"', assetTag: 'AST-MON-051', category: 'Monitor', status: 'AVAILABLE', condition: 'NEW' },
  { id: '3', name: 'ThinkPad X1 Carbon', assetTag: 'AST-LAP-048', category: 'Laptop', status: 'ASSIGNED', condition: 'GOOD', assignedTo: 'Rahul S.' },
  { id: '4', name: 'iPhone 15', assetTag: 'AST-PHN-045', category: 'Phone', status: 'UNDER_MAINTENANCE', condition: 'FAIR' },
  { id: '5', name: 'Dell XPS 15', assetTag: 'AST-LAP-030', category: 'Laptop', status: 'RETIRED', condition: 'POOR' },
];

const CATEGORY_ICONS: Record<string, typeof Laptop> = {
  Laptop: Laptop,
  Monitor: Monitor,
  Phone: Smartphone,
  Accessory: Headphones,
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-700',
  RETIRED: 'bg-gray-100 text-gray-700',
  LOST: 'bg-red-100 text-red-700',
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500">View your assigned assets and inventory</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Package size={16} className="mr-2" /> Request Asset
        </Button>
      </div>

      <Tabs defaultValue="my-assets">
        <TabsList>
          <TabsTrigger value="my-assets">My Assets</TabsTrigger>
          <TabsTrigger value="inventory">Inventory (Admin)</TabsTrigger>
        </TabsList>

        <TabsContent value="my-assets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MY_ASSETS.map((asset) => {
              const Icon = CATEGORY_ICONS[asset.category] || Package;
              return (
                <Card key={asset.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <Icon size={24} className="text-teal-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.make} &middot; {asset.category}</p>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                          <span>Tag: {asset.assetTag}</span>
                          <span>S/N: {asset.serial}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Assigned: {asset.assignedDate}</span>
                          <Badge className="bg-green-100 text-green-700">{asset.condition}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Asset Inventory</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search assets..." className="pl-9 w-60" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="UNDER_MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="RETIRED">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Accessory">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Asset</th>
                      <th className="pb-2 font-medium">Tag</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Condition</th>
                      <th className="pb-2 font-medium">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {INVENTORY.map((asset) => (
                      <tr key={asset.id}>
                        <td className="py-3 font-medium text-gray-900">{asset.name}</td>
                        <td className="py-3 text-gray-600">{asset.assetTag}</td>
                        <td className="py-3 text-gray-600">{asset.category}</td>
                        <td className="py-3">
                          <Badge className={STATUS_STYLES[asset.status] || ''}>{asset.status.replace(/_/g, ' ')}</Badge>
                        </td>
                        <td className="py-3 text-gray-600">{asset.condition}</td>
                        <td className="py-3 text-gray-600">{(asset as Record<string, unknown>).assignedTo as string || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
