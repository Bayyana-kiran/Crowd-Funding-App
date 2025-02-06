import React from 'react';
import { Wallet, History, Gift, Bell } from 'lucide-react';

const UserDashboard = () => {
  const walletInfo = {
    balance: '25.5 ETH',
    totalContributed: '12.8 ETH',
    activeCampaigns: 4
  };

  const transactions = [
    { id: 1, campaign: 'Save the Ocean', amount: '2.5 ETH', date: '2024-03-10', status: 'Completed' },
    { id: 2, campaign: 'Education for All', amount: '1.8 ETH', date: '2024-03-09', status: 'Completed' },
    { id: 3, campaign: 'Green Earth', amount: '3.0 ETH', date: '2024-03-08', status: 'Pending' }
  ];

  const notifications = [
    { id: 1, message: 'Your donation of 2.5 ETH was confirmed', time: '2 hours ago' },
    { id: 2, message: 'Campaign "Save the Ocean" reached its goal', time: '5 hours ago' },
    { id: 3, message: 'New campaign matching your interests', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{walletInfo.balance}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Contributed</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{walletInfo.totalContributed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{walletInfo.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <History className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{tx.campaign}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">{tx.amount}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <Bell className="w-5 h-5 text-gray-500" />
        </div>
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-gray-50">
              <p className="font-medium text-gray-900">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;