import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, Users, Clock, Plus } from "lucide-react";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import DonateModal from "../components/campaigns/DonateModal";

const CampaignsNGOs = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [ngoData, setNgoData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDonateModal, setShowDonateModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const walletAddress = localStorage.getItem("account");
            const role = localStorage.getItem("role");
            setUserRole(role);

            if (!walletAddress) {
                throw new Error("Please connect your wallet first");
            }

            if (role === "ngo") {
                // Fetch NGO data first
                const ngoResponse = await fetch(
                    `http://localhost:5987/api/dashboard/ngo/${walletAddress}`
                );
                if (!ngoResponse.ok)
                    throw new Error("Failed to fetch NGO data");
                const ngoData = await ngoResponse.json();
                setNgoData(ngoData);

                // Then fetch NGO's campaigns
                const campaignsResponse = await fetch(
                    `http://localhost:5987/api/dashboard/campaigns/ngo/${ngoData.id}`
                );
                if (!campaignsResponse.ok)
                    throw new Error("Failed to fetch campaigns");
                const campaignsData = await campaignsResponse.json();
                setCampaigns(campaignsData);
            } else {
                // Fetch all campaigns for regular users
                const campaignsResponse = await fetch(
                    "http://localhost:5987/api/dashboard/campaigns/all"
                );
                if (!campaignsResponse.ok)
                    throw new Error("Failed to fetch campaigns");
                const campaignsData = await campaignsResponse.json();
                setCampaigns(campaignsData);
            }
        } catch (err) {
            setError(err.message);
            if (err.message.includes("wallet")) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCampaignCreated = (newCampaign) => {
        setCampaigns([newCampaign, ...campaigns]);
    };

    const handleDonationSuccess = async (donation) => {
        // Refresh campaign data
        await fetchData();
    };

    const calculateProgress = (campaign) => {
        const raised = parseFloat(campaign.totalRaised) || 0;
        const goal = parseFloat(campaign.goal) || 0;
        return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {userRole === "ngo" ? "My Campaigns" : "All Campaigns"}
                </h1>
                {userRole === "ngo" && (
                    <button
                        onClick={() => setShowCreateCampaign(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Campaign
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                    >
                        {campaign.imageUrl && (
                            <img
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        campaign.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {campaign.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {campaign.category}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {campaign.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {campaign.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    <span>{campaign.goal} ETH Goal</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-5 w-5 mr-2" />
                                    <span>
                                        {campaign.donors?.length || 0} Donors
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span>
                                        {new Date(
                                            campaign.deadline
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    <span>
                                        {campaign.totalRaised} ETH Raised
                                    </span>
                                </div>
                            </div>
                            {campaign.tags?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {campaign.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {userRole !== "ngo" && (
                                <div className="p-4 border-t border-gray-100">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCampaign(campaign);
                                            setShowDonateModal(true);
                                        }}
                                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                                    >
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        Donate Now
                                    </button>
                                </div>
                            )}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>
                                        {campaign.totalRaised} ETH raised
                                    </span>
                                    <span>{campaign.goal} ETH goal</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{
                                            width: `${calculateProgress(
                                                campaign
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                {new Date(campaign.deadline) > new Date()
                                    ? `${Math.ceil(
                                          (new Date(campaign.deadline) -
                                              new Date()) /
                                              (1000 * 60 * 60 * 24)
                                      )} days left`
                                    : "Campaign ended"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {userRole === "ngo" && (
                <CreateCampaignModal
                    isOpen={showCreateCampaign}
                    onClose={() => setShowCreateCampaign(false)}
                    ngoId={ngoData?.id}
                    onSuccess={(newCampaign) => {
                        handleCampaignCreated(newCampaign);
                        setShowCreateCampaign(false);
                    }}
                />
            )}

            {showDonateModal && selectedCampaign && (
                <DonateModal
                    isOpen={showDonateModal}
                    onClose={() => {
                        setShowDonateModal(false);
                        setSelectedCampaign(null);
                    }}
                    campaign={selectedCampaign}
                    onSuccess={handleDonationSuccess}
                />
            )}
        </div>
    );
};

export default CampaignsNGOs;
