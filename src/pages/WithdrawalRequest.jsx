import React from 'react';
import { DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

const WithdrawalRequest = () => {
  const [amount, setAmount] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success'>('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('pending');
    // Simulate blockchain transaction
    setTimeout(() => setStatus('success'), 2000);
  };

  const pendingRequests = [
    { id: 1, amount: '5.0 ETH', date: '2024-03-10', status: 'Pending Approval' },
    { id: 2, amount: '3.2 ETH', date: '2024-03-09', status: 'Processing' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Request</h1>
        <p className="mt-2 text-gray-600">Submit a request to withdraw funds from your campaigns</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">New Withdrawal Request</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">ETH</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Explain the purpose of this withdrawal"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important Notice</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Withdrawal requests are subject to approval</li>
                    <li>Processing may take 24-48 hours</li>
                    <li>Minimum withdrawal amount is 0.1 ETH</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${status === 'idle' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}
          >
            {status === 'pending' ? 'Processing...' : status === 'success' ? 'Request Submitted' : 'Submit Request'}
          </button>

          {status === 'success' && (
            <div className="flex items-center justify-center text-green-600 space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Request submitted successfully!</span>
            </div>
          )}
        </form>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingRequests.map((request) => (
            <div key={request.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{request.amount}</p>
                <p className="text-sm text-gray-500">{request.date}</p>
              </div>
              <span className="px-4 py-2 rounded-full text-sm bg-yellow-100 text-yellow-800">
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;