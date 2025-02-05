import React, { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, FileText, User } from 'lucide-react';

function AdminVerification() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');

  // Mock data - In production, this would be fetched from your API
  const registrationRequests = [
    {
      id: 1,
      ngoName: "Global Water Foundation",
      email: "contact@gwf.org",
      status: "pending",
      documents: ["registration.pdf", "tax_exempt.pdf"],
      submittedDate: "2024-03-10",
    },
    {
      id: 2,
      ngoName: "Education First Initiative",
      email: "info@edufi.org",
      status: "approved",
      documents: ["certification.pdf", "annual_report.pdf"],
      submittedDate: "2024-03-09",
    },
    {
      id: 3,
      ngoName: "Green Earth Project",
      email: "support@gep.org",
      status: "rejected",
      documents: ["documents.pdf"],
      submittedDate: "2024-03-08",
      rejectionReason: "Incomplete documentation",
    },
  ];

  const filteredRequests = registrationRequests.filter(request => 
    request.status === selectedTab &&
    (request.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (id, action) => {
    console.log(`${action} request ${id}`);
    // Implement approval/rejection logic here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Verification Panel</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search NGOs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`${
                  selectedTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NGO Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.ngoName}
                        </div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {request.documents.map((doc, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <FileText className="h-4 w-4 mr-1" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {selectedTab === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(request.id, 'approve')}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(request.id, 'reject')}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {selectedTab === 'rejected' && request.rejectionReason && (
                      <span className="text-red-600">
                        Reason: {request.rejectionReason}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminVerification;