import React, { useState, useEffect } from "react";
import {
    Shield,
    Search,
    CheckCircle,
    XCircle,
    User,
    AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

function AdminVerification() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("pending");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        fetchNGOs();
    }, [selectedTab]);

    const fetchNGOs = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5987/api/dashboard/admin/ngos/${selectedTab}`
            );
            const data = await response.json();
            setNgos(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (ngoId, newStatus) => {
        try {
            setLoading(true);
            console.log("Updating NGO status:", { ngoId, newStatus });

            const response = await fetch(
                `http://localhost:5987/api/dashboard/admin/ngos/${ngoId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to update NGO status"
                );
            }

            const updatedNGO = await response.json();
            console.log("NGO status updated:", updatedNGO);

            // Update the NGO list
            setNgos((currentNGOs) =>
                currentNGOs.map((ngo) =>
                    ngo.id === ngoId ? { ...ngo, status: newStatus } : ngo
                )
            );

            // Show success message
            toast.success(`NGO status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating NGO status:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtered NGOs based on search term
    const filteredNGOs = ngos.filter(
        (ngo) =>
            ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ngo.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Shield className="h-8 w-8 text-indigo-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Verification Panel
                    </h1>
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

                <div className="mt-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        NGO Details
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
                                {filteredNGOs.map((ngo) => (
                                    <tr key={ngo.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <User className="h-10 w-10 text-gray-400" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ngo.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {ngo.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {ngo.walletAddress}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Add document links here */}
                                            <div className="text-sm text-blue-600">
                                                <a
                                                    href={
                                                        ngo.registrationCertificateUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Registration Certificate
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {selectedTab === "pending" && (
                                                <div className="space-y-2">
                                                    <textarea
                                                        className="w-full p-2 border rounded"
                                                        placeholder="Add remarks..."
                                                        value={remarks}
                                                        onChange={(e) =>
                                                            setRemarks(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    ngo.id,
                                                                    "approved"
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-900 flex items-center"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    ngo.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedTab !== "pending" && (
                                                <div className="text-sm text-gray-500">
                                                    {ngo.remarks ||
                                                        "No remarks"}
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
        </div>
    );
}

export default AdminVerification;
