import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js"; // Keep this import from your firebase file
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Import 'doc' directly from 'firebase/firestore'
import { Shield, Search, CheckCircle, XCircle, User } from "lucide-react";

function AdminVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [registrationRequests, setRegistrationRequests] = useState([]);

  // Fetch Data from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ngo"));
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Requests:", requests); // Log the fetched requests
        setRegistrationRequests(requests);
      } catch (error) {
        console.error("Error fetching registration requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Filtered requests based on selected tab and search term
  const filteredRequests = registrationRequests.filter(
    (request) =>
      (request.status === selectedTab || selectedTab === "pending") &&
      (request.ngoName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       request.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log("Filtered Requests:", filteredRequests); // Check the filtered data

  // Approve or Reject Action
  const handleAction = async (id, action) => {
    try {
      const requestRef = doc(db, "ngo", id); // Use 'doc' from firestore
      await updateDoc(requestRef, {
        status: action === "approve" ? "approved" : "rejected",
      });

      // Update state to reflect changes instantly
      setRegistrationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: action === "approve" ? "approved" : "rejected" } : request
        )
      );

      console.log(`${action}d request ${id}`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
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
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`${
                  selectedTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                        <div className="text-sm font-medium text-gray-900">{request.ngoName}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        <div className="text-sm text-gray-500">{request.walletAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {selectedTab === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(request.id, "approve")}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(request.id, "reject")}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
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
