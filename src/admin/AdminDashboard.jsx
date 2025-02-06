import React from 'react';
import { Users, AlertCircle, CheckCircle2, XCircle, BarChart3, Search, Filter, Settings, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('pending');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const pendingNGOs = [
    { id: 1, name: 'Ocean Conservation Fund', status: 'pending', date: '2024-03-10', documents: 3, risk: 'low' },
    { id: 2, name: 'Education First NGO', status: 'pending', date: '2024-03-09', documents: 5, risk: 'medium' },
    { id: 3, name: 'Green Earth Initiative', status: 'pending', date: '2024-03-08', documents: 4, risk: 'low' }
  ];

  const verifiedNGOs = [
    { id: 4, name: 'World Health Aid', status: 'active', date: '2024-03-07', funds: '125,000 ETH', campaigns: 3 },
    { id: 5, name: 'Digital Education Fund', status: 'active', date: '2024-03-06', funds: '85,000 ETH', campaigns: 2 },
    { id: 6, name: 'Clean Water Project', status: 'active', date: '2024-03-05', funds: '200,000 ETH', campaigns: 4 }
  ];

  const platformStats = [
    { name: 'Total NGOs', value: '156', icon: Users, change: '+12%' },
    { name: 'Pending Approvals', value: '23', icon: AlertCircle, change: '-5%' },
    { name: 'Total Funds Raised', value: '2.5M ETH', icon: BarChart3, change: '+25%' }
  ];

  const handleApprove = (id) => {
    console.log('Approved NGO:', id);
  };

  const handleReject = (id) => {
    console.log('Rejected NGO:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage and monitor platform NGOs and organizations</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Platform Settings
        </button>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platformStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`mt-2 text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, ID, or wallet address"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Approvals
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verified'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verified NGOs
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingNGOs.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-10 w-10 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ngo.name}</div>
                        <div className="text-sm text-gray-500">ID: {ngo.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ngo.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ngo.documents} files
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ngo.risk === 'low' ? 'bg-green-100 text-green-800' :
                      ngo.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ngo.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(ngo.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(ngo.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Funds Raised
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Campaigns
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifiedNGOs.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-10 w-10 text-blue-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ngo.name}</div>
                        <div className="text-sm text-gray-500">ID: {ngo.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ngo.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {ngo.funds}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ngo.campaigns} campaigns
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">97</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;