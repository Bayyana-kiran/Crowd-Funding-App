import React from 'react';
import { BarChart3, Users, DollarSign, Download, ArrowUpRight } from 'lucide-react';

const NGODashboard = () => {
  const stats = [
    { name: 'Total Raised', value: '120,000 ETH', icon: DollarSign },
    { name: 'Total Donors', value: '1,240', icon: Users },
    { name: 'Active Campaigns', value: '3', icon: BarChart3 },
  ];

  const transactions = [
    { id: 1, donor: '0x1234...5678', amount: '5 ETH', timestamp: '2024-03-10 14:30' },
    { id: 2, donor: '0x8765...4321', amount: '3 ETH', timestamp: '2024-03-10 13:15' },
    { id: 3, donor: '0x9876...1234', amount: '2.5 ETH', timestamp: '2024-03-10 12:45' },
  ];

  const topContributors = [
    { address: '0x1234...5678', total: '15 ETH' },
    { address: '0x8765...4321', total: '12 ETH' },
    { address: '0x9876...1234', total: '10 ETH' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{tx.donor}</p>
                <p className="text-sm text-gray-500">{tx.timestamp}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">{tx.amount}</span>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Top Contributors</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {topContributors.map((contributor, index) => (
            <div key={contributor.address} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
                  {index + 1}
                </span>
                <span className="ml-4 font-medium text-gray-900">{contributor.address}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{contributor.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;