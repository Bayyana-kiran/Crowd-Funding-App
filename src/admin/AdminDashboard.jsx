import React, { useState, useEffect } from "react";
import {
    Users,
    AlertCircle,
    CheckCircle2,
    XCircle,
    BarChart3,
    Search,
    Filter,
    Settings,
    Shield,
    TrendingUp,
    DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for dashboard data
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, registrationsRes, donationsRes] =
                await Promise.all([
                    fetch("http://localhost:5987/api/dashboard/admin/stats"),
                    fetch(
                        "http://localhost:5987/api/dashboard/admin/recent-registrations"
                    ),
                    fetch(
                        "http://localhost:5987/api/dashboard/admin/recent-donations"
                    ),
                ]);

            const [stats, registrations, donations] = await Promise.all([
                statsRes.json(),
                registrationsRes.json(),
                donationsRes.json(),
            ]);

            setDashboardStats(stats);
            setRecentRegistrations(registrations);
            setRecentDonations(donations);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    const stats = [
        {
            name: "Total NGOs",
            value: dashboardStats?.totalNGOs || 0,
            icon: Users,
            change: "+12%",
        },
        {
            name: "Pending Approvals",
            value: dashboardStats?.pendingApprovals || 0,
            icon: AlertCircle,
            change: "-5%",
        },
        {
            name: "Total Funds Raised",
            value: `${dashboardStats?.totalFundsRaised || 0} ETH`,
            icon: DollarSign,
            change: "+25%",
        },
        {
            name: "Active Campaigns",
            value: dashboardStats?.activeCampaigns || 0,
            icon: TrendingUp,
            change: "+8%",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Shield className="h-8 w-8 text-indigo-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Refresh Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-lg shadow p-6"
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
                            <span
                                className={`text-sm ${
                                    stat.change.startsWith("+")
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {stat.change}
                            </span>
                            <span className="text-sm text-gray-500">
                                {" "}
                                from last month
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent NGO Registrations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentRegistrations.map((ngo) => (
                            <div key={ngo.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {ngo.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {ngo.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            ngo.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : ngo.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {ngo.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Donations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentDonations.map((donation) => (
                            <div
                                key={donation.id}
                                className="p-6 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {donation.donorWallet.slice(0, 6)}
                                            ...{donation.donorWallet.slice(-4)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            To:{" "}
                                            {donation.ngoName || "Unknown NGO"}
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
            </div>
        </div>
    );
};

export default AdminDashboard;
