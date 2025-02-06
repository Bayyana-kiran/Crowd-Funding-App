import React from 'react';
import { Search, Filter, ArrowUpRight } from 'lucide-react';

const Explorer = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  const transactions = [
    {
      id: 1,
      type: 'Campaign Creation',
      address: '0x1234...5678',
      amount: '50 ETH',
      timestamp: '2024-03-10 14:30',
      status: 'Confirmed'
    },
    {
      id: 2,
      type: 'Donation',
      address: '0x8765...4321',
      amount: '2.5 ETH',
      timestamp: '2024-03-10 13:15',
      status: 'Pending'
    },
    {
      id: 3,
      type: 'Withdrawal',
      address: '0x9876...1234',
      amount: '10 ETH',
      timestamp: '2024-03-10 12:45',
      status: 'Confirmed'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blockchain Explorer</h1>
        <p className="mt-2 text-gray-600">Search and track all transactions on the platform</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by address, transaction hash, or campaign name"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Transactions</option>
                <option value="campaigns">Campaigns</option>
                <option value="donations">Donations</option>
                <option value="withdrawals">Withdrawals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Type</div>
              <div>Address</div>
              <div>Amount</div>
              <div>Timestamp</div>
              <div>Status</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="grid grid-cols-5 px-6 py-4 hover:bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{transaction.type}</div>
                <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center">
                  {transaction.address}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
                <div className="text-sm text-gray-900">{transaction.amount}</div>
                <div className="text-sm text-gray-500">{transaction.timestamp}</div>
                <div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Transaction Hash</label>
              <p className="mt-1 text-sm text-gray-900">0x1234...5678</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Block Number</label>
              <p className="mt-1 text-sm text-gray-900">#12345678</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">From</label>
              <p className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">0x8765...4321</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">To</label>
              <p className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">0x9876...1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;