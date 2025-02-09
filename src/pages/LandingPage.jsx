import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Users, ArrowRight } from "lucide-react";

const LandingPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:5987/api/dashboard/campaigns/all"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch campaigns");
            }
            const data = await response.json();

            // Get only active campaigns and sort by totalRaised
            const activeCampaigns = data
                .filter((campaign) => campaign.status === "active")
                .sort(
                    (a, b) =>
                        parseFloat(b.totalRaised) - parseFloat(a.totalRaised)
                )
                .slice(0, 3); // Get top 3 campaigns

            setCampaigns(activeCampaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80"
                        alt="Background"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Decentralized Crowdfunding
                    </h1>
                    <p className="mt-6 text-xl max-w-3xl">
                        Empowering change through transparent, blockchain-based
                        crowdfunding. Support causes you believe in with
                        complete trust and transparency.
                    </p>
                    <div className="mt-10 flex space-x-4">
                        <Link
                            to="/campaigns"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50"
                        >
                            Explore Campaigns
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/ngo/register"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                        >
                            Start a Campaign
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Choose DeCrowd?
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Built on blockchain technology for maximum
                            transparency and trust
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Secure & Transparent
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                All transactions are recorded on the blockchain,
                                ensuring complete transparency and security.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Real-time Tracking
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                Monitor your contributions and campaign progress
                                in real-time with blockchain verification.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Community Driven
                            </h3>
                            <p className="mt-2 text-base text-gray-500 text-center">
                                Join a community of changemakers and support
                                causes that matter to you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Featured Campaigns
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Support these active campaigns and help make a
                            difference
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center mt-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="mt-10">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {campaigns.map((campaign) => (
                                    <div key={campaign.id} className="pt-6">
                                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                            <div className="-mt-6">
                                                <div>
                                                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                                        {/* You can add campaign image here if available */}
                                                        {campaign.imageUrl ? (
                                                            <img
                                                                src={
                                                                    campaign.imageUrl
                                                                }
                                                                alt={
                                                                    campaign.title
                                                                }
                                                                className="h-6 w-6"
                                                            />
                                                        ) : (
                                                            <span className="h-6 w-6 text-white">
                                                                {
                                                                    campaign
                                                                        .title[0]
                                                                }
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                    {campaign.title}
                                                </h3>
                                                <p className="mt-5 text-base text-gray-500">
                                                    {campaign.description}
                                                </p>
                                                <div className="mt-5">
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>
                                                            {
                                                                campaign.totalRaised
                                                            }{" "}
                                                            ETH raised
                                                        </span>
                                                        <span>
                                                            Goal:{" "}
                                                            {campaign.goal} ETH
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/campaign/${campaign.id}`
                                                                )
                                                            }
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                                        >
                                                            View Campaign
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
