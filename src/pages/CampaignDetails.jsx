import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    DollarSign,
    Users,
    Clock,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import DonateModal from "../components/campaigns/DonateModal";

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchCampaignData();
    }, [id]);

    const fetchCampaignData = async () => {
        try {
            setLoading(true);
            const walletAddress = localStorage.getItem("account");
            const role = localStorage.getItem("role");
            setUserRole(role);

            if (!walletAddress) {
                throw new Error("Please connect your wallet first");
            }

            // Update the fetch URL to match the backend route
            const response = await fetch(
                `http://localhost:5987/api/dashboard/campaign/${id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch campaign details");
            }
            const campaignData = await response.json();
            setCampaign(campaignData);
        } catch (err) {
            setError(err.message);
            if (err.message.includes("wallet")) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = (campaign) => {
        const raised = parseFloat(campaign.totalRaised) || 0;
        const goal = parseFloat(campaign.goal) || 0;
        return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
    };

    const handleDonationSuccess = async () => {
        await fetchCampaignData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-red-600 text-xl mb-4">{error}</div>
                <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-600 text-xl">Campaign not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {campaign.imageUrl && (
                    <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="w-full h-64 object-cover"
                    />
                )}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {campaign.title}
                        </h1>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                campaign.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {campaign.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Campaign Details
                            </h2>
                            <p className="text-gray-600 whitespace-pre-wrap">
                                {campaign.description}
                            </p>
                            {campaign.tags?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {campaign.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Campaign Progress
                                </h3>
                                <div className="bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{
                                            width: `${calculateProgress(
                                                campaign
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>
                                        {campaign.totalRaised} ETH raised
                                    </span>
                                    <span>{campaign.goal} ETH goal</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-5 w-5 mr-2" />
                                    <span>
                                        {campaign.donors?.length || 0} Donors
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    <span>
                                        {new Date(
                                            campaign.deadline
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span>
                                        {new Date(campaign.deadline) > new Date()
                                            ? `${Math.ceil(
                                                  (new Date(campaign.deadline) -
                                                      new Date()) /
                                                      (1000 * 60 * 60 * 24)
                                              )} days left`
                                            : "Campaign ended"}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    <span>{campaign.category}</span>
                                </div>
                            </div>

                            {userRole !== "ngo" &&
                                campaign.status === "active" && (
                                    <button
                                        onClick={() => setShowDonateModal(true)}
                                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                                    >
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        Donate Now
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </div>

            {showDonateModal && (
                <DonateModal
                    isOpen={showDonateModal}
                    onClose={() => setShowDonateModal(false)}
                    campaign={campaign}
                    onSuccess={handleDonationSuccess}
                />
            )}
        </div>
    );
};

export default CampaignDetails;