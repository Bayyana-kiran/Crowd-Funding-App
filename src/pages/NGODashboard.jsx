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
} from "lucide-react";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";

const NGODashboard = () => {
    const navigate = useNavigate();
    const [ngoData, setNgoData] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [donations, setDonations] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const walletAddress = localStorage.getItem("account");
                if (!walletAddress) {
                    throw new Error("Please connect your wallet first");
                }

                // Fetch NGO data
                const ngoResponse = await fetch(
                    `http://localhost:5987/api/dashboard/ngo/${walletAddress}`
                );
                if (!ngoResponse.ok) {
                    throw new Error("Failed to fetch NGO data");
                }
                const ngoData = await ngoResponse.json();
                setNgoData(ngoData);

                // Fetch all related data
                const [campaignsRes, donationsRes, withdrawalsRes] = await Promise.all([
                    fetch(`http://localhost:5987/api/dashboard/campaigns/ngo/${ngoData.id}`),
                    fetch(`http://localhost:5987/api/dashboard/donations/ngo/${ngoData.id}`),
                    fetch(`http://localhost:5987/api/dashboard/withdrawals/${ngoData.id}`)
                ]);

                const [campaignsData, donationsData, withdrawalsData] = await Promise.all([
                    campaignsRes.json(),
                    donationsRes.json(),
                    withdrawalsRes.json()
                ]);

                setCampaigns(campaignsData);
                setDonations(donationsData);
                setWithdrawals(withdrawalsData);

                // Calculate real stats
                const stats = [
                    {
                        name: "Total Raised",
                        value: `${donationsData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)} ETH`,
                        icon: DollarSign,
                        change: `${donationsData.length} donations received`
                    },
                    {
                        name: "Total Donors",
                        value: new Set(donationsData.map(d => d.donorWallet)).size,
                        icon: Users,
                        change: "Unique donors"
                    },
                    {
                        name: "Active Campaigns",
                        value: campaignsData.filter(c => c.status === 'active').length,
                        icon: BarChart3,
                        change: `${campaignsData.length} total campaigns`
                    },
                    {
                        name: "Total Withdrawn",
                        value: `${withdrawalsData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)} ETH`,
                        icon: Download,
                        change: `${withdrawalsData.length} withdrawals processed`
                    }
                ];

                setStats(stats);
            } catch (err) {
                setError(err.message);
                if (err.message.includes("wallet")) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleCampaignCreated = (newCampaign) => {
        setCampaigns([newCampaign, ...campaigns]);
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
            {/* NGO Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {ngoData?.name}
                        </h1>
                        <p className="text-gray-500 mt-1">{ngoData?.email}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Wallet: {ngoData?.walletAddress?.slice(0, 6)}...
                            {ngoData?.walletAddress?.slice(-4)}
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
                                ngoData?.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {ngoData?.status}
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
                        {donations.slice(0, 5).map((donation) => (
                            <div
                                key={donation.id}
                                className="p-6 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {donation.donorWallet.slice(0, 6)}
                                            ...
                                            {donation.donorWallet.slice(-4)}
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
                        {withdrawals.slice(0, 5).map((withdrawal) => (
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
                ngoId={ngoData?.id}
                onSuccess={handleCampaignCreated}
            />
        </div>
    );
};

export default NGODashboard;
