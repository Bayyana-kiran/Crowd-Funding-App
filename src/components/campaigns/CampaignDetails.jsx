import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DonateModal from "./DonateModal";
import CampaignActions from "./CampaignActions";

const CampaignDetails = () => {
    const { id: campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [userAddress, setUserAddress] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setUserAddress(accounts[0]);
                } catch (error) {
                    console.error("Error connecting to wallet:", error);
                }
            }
        };
        connectWallet();
    }, []);

    const fetchCampaignData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get all campaigns first
            const response = await fetch(
                `http://localhost:5987/api/dashboard/campaigns/all`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch campaigns");
            }

            const campaigns = await response.json();
            console.log("Campaigns:", campaigns);

            // Find the specific campaign by ID
            const foundCampaign = campaigns.find((c) => c.id === campaignId);

            if (!foundCampaign) {
                throw new Error("Campaign not found");
            }

            setCampaign(foundCampaign);
        } catch (error) {
            console.error("Error fetching campaign:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) {
            fetchCampaignData();
        }
    }, [campaignId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Campaign not found</div>
            </div>
        );
    }

    const isNGOAdmin =
        userAddress?.toLowerCase() === campaign.ngoAddress?.toLowerCase();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{campaign.title}</h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Campaign Details
                            </h2>
                            <div className="space-y-3">
                                <p>
                                    <span className="font-medium">Goal:</span>{" "}
                                    {campaign.goal} ETH
                                </p>
                                <p>
                                    <span className="font-medium">Raised:</span>{" "}
                                    {campaign.totalRaised} ETH
                                </p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {campaign.status}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Start Date:
                                    </span>{" "}
                                    {new Date(
                                        campaign.startDate
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        End Date:
                                    </span>{" "}
                                    {new Date(
                                        campaign.deadline
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Description
                            </h2>
                            <p className="text-gray-600">
                                {campaign.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        {!isNGOAdmin && (
                            <button
                                onClick={() => setShowDonateModal(true)}
                                disabled={campaign.status !== "active"}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Donate
                            </button>
                        )}
                    </div>

                    <CampaignActions
                        campaign={campaign}
                        isNGOAdmin={isNGOAdmin}
                        onUpdate={fetchCampaignData}
                    />
                </div>
            </div>

            <DonateModal
                isOpen={showDonateModal}
                onClose={() => setShowDonateModal(false)}
                campaign={campaign}
                onSuccess={fetchCampaignData}
            />
        </div>
    );
};

export default CampaignDetails;
