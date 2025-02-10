import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!window.ethereum) {
                    throw new Error("MetaMask is not installed");
                }

                // Request account access
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                if (accounts.length === 0) {
                    throw new Error("No accounts found");
                }

                const address = accounts[0];
                setWalletAddress(address);

                // Get balance using ethers
                const provider = new ethers.BrowserProvider(window.ethereum);
                const balance = await provider.getBalance(address);
                const formattedBalance = ethers.formatEther(balance);
                setBalance(formattedBalance);

                // Fetch user's donations
                const response = await fetch(
                    `http://localhost:5987/api/dashboard/donations/user/${address}`
                );
                const donationsData = await response.json();
                setDonations(donationsData);

                // Listen for account changes
                window.ethereum.on("accountsChanged", handleAccountsChanged);
                // Listen for chain changes
                window.ethereum.on("chainChanged", handleChainChanged);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        // Cleanup listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged
                );
                window.ethereum.removeListener(
                    "chainChanged",
                    handleChainChanged
                );
            }
        };
    }, [navigate]);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            setWalletAddress("");
            setBalance("");
            navigate("/login");
        } else {
            // Account changed, update the state
            const newAddress = accounts[0];
            setWalletAddress(newAddress);

            // Update balance for new account
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(newAddress);
            setBalance(ethers.formatEther(balance));
        }
    };

    const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
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
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Connected Wallet
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {walletAddress ? (
                                    <>
                                        {walletAddress.slice(0, 6)}...
                                        {walletAddress.slice(-4)}
                                    </>
                                ) : (
                                    "Not connected"
                                )}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Wallet className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Wallet Balance
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {parseFloat(balance).toFixed(4)} ETH
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Wallet className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Donations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {donations.length === 0 ? (
                            <p className="p-6 text-gray-500">
                                No donations yet.
                            </p>
                        ) : (
                            donations.map((donation) => (
                                <div
                                    key={donation.id}
                                    className="p-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {donation.campaignTitle ||
                                                    "Campaign"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    donation.timestamp
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {donation.amount} ETH
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
