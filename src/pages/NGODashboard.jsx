import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    BarChart3,
    Users,
    DollarSign,
    Download,
    ArrowUpRight,
    Wallet,
    Calendar,
    TrendingUp,
    Plus,
    AlertCircle,
} from "lucide-react";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import { toast } from "react-hot-toast";

const NGODashboard = () => {
    const navigate = useNavigate();
    const [ngo, setNgo] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [donations, setDonations] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const checkNGOStatus = async () => {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const walletAddress = accounts[0];

                const response = await fetch(
                    `http://localhost:5987/api/dashboard/ngo/${walletAddress}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch NGO details");
                }

                const ngoData = await response.json();
                setNgo(ngoData);

                // Redirect if NGO is rejected
                if (ngoData.status === "rejected") {
                    toast.error(
                        "Your NGO registration has been rejected. Please contact support."
                    );
                    navigate("/");
                    return;
                }

                // Fetch all related data
                const [campaignsRes, donationsRes, withdrawalsRes] =
                    await Promise.all([
                        fetch(
                            `http://localhost:5987/api/dashboard/campaigns/ngo/${ngoData.id}`
                        ),
                        fetch(
                            `http://localhost:5987/api/dashboard/donations/ngo/${ngoData.id}`
                        ),
                        fetch(
                            `http://localhost:5987/api/dashboard/withdrawals/${ngoData.id}`
                        ),
                    ]);

                const [campaignsData, donationsData, withdrawalsData] =
                    await Promise.all([
                        campaignsRes.json(),
                        donationsRes.json(),
                        withdrawalsRes.json(),
                    ]);

                setCampaigns(campaignsData || []);
                setDonations(donationsData || []);
                setWithdrawals(withdrawalsData || []);

                // Calculate real stats
                const statsData = [
                    {
                        name: "Total Raised",
                        value: `${(donationsData || []).reduce(
                            (acc, curr) => acc + parseFloat(curr.amount || 0),
                            0
                        )} ETH`,
                        icon: DollarSign,
                        change: `${
                            donationsData?.length || 0
                        } donations received`,
                    },
                    {
                        name: "Total Donors",
                        value: new Set(
                            (donationsData || []).map((d) => d.donorWallet)
                        ).size,
                        icon: Users,
                        change: "Unique donors",
                    },
                    {
                        name: "Active Campaigns",
                        value: (campaignsData || []).filter(
                            (c) => c.status === "active"
                        ).length,
                        icon: BarChart3,
                        change: `${campaignsData?.length || 0} total campaigns`,
                    },
                    {
                        name: "Total Withdrawn",
                        value: `${(withdrawalsData || []).reduce(
                            (acc, curr) => acc + parseFloat(curr.amount || 0),
                            0
                        )} ETH`,
                        icon: Download,
                        change: `${
                            withdrawalsData?.length || 0
                        } withdrawals processed`,
                    },
                ];

                setStats(statsData);
            } catch (error) {
                console.error("Error fetching NGO data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        checkNGOStatus();
    }, [navigate]);

    const handleCampaignCreated = (newCampaign) => {
        setCampaigns((prev) => [...prev, newCampaign]);
        setShowCreateCampaign(false);
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

    if (ngo?.status === "pending") {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Verification Pending
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Your NGO registration is currently under
                                    review. You'll be able to create campaigns
                                    once your registration is approved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* NGO Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {ngo?.name}
                        </h1>
                        <p className="text-gray-500 mt-1">{ngo?.email}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Wallet: {ngo?.walletAddress?.slice(0, 6)}...
                            {ngo?.walletAddress?.slice(-4)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowCreateCampaign(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Campaign
                        </button>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                ngo?.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {ngo?.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {stat.name}
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-full">
                                <stat.icon className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Donations */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Donations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {(donations || []).slice(0, 5).map((donation) => (
                            <div
                                key={donation.id}
                                className="p-6 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {donation.donorWallet?.slice(0, 6)}
                                            ...
                                            {donation.donorWallet?.slice(-4)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                donation.timestamp
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {donation.amount} ETH
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Withdrawals */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Withdrawals
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {(withdrawals || []).slice(0, 5).map((withdrawal) => (
                            <div
                                key={withdrawal.id}
                                className="p-6 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {withdrawal.status}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                withdrawal.timestamp
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {withdrawal.amount} ETH
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Link
                to="/campaigns"
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Manage Campaigns
                    </h3>
                    <p className="text-gray-500">
                        Create and manage your fundraising campaigns
                    </p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-gray-400" />
            </Link>

            <CreateCampaignModal
                isOpen={showCreateCampaign}
                onClose={() => setShowCreateCampaign(false)}
                ngoId={ngo?.id}
                onSuccess={handleCampaignCreated}
            />
        </div>
    );
};

export default NGODashboard;
