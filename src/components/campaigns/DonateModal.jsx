import React, { useState } from "react";
import { X, AlertCircle, DollarSign } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

const DonateModal = ({ isOpen, onClose, campaign, onSuccess }) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            // Validate amount
            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Please enter a valid donation amount");
            }

            // Get donor's wallet address
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const donorWallet = accounts[0];

            // Convert ETH amount to Wei using ethers
            const amountInWei = ethers.parseEther(amount.toString());

            console.log("Sending donation:", {
                campaignId: campaign.id,
                amount,
                amountInWei: amountInWei.toString(),
                donorWallet,
            });

            // Request MetaMask transaction
            const response = await fetch(
                "http://localhost:5987/api/dashboard/donations/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        campaignId: campaign.id,
                        amountInWei: amountInWei.toString(),
                        donorWallet,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to donate");
            }

            const donation = await response.json();
            console.log("Donation successful:", donation);

            // Update campaign with new total
            if (donation.totalRaised) {
                campaign.totalRaised = donation.totalRaised;
            }

            toast.success("Donation successful!");
            onSuccess(donation);
            onClose();
        } catch (error) {
            console.error("Error donating:", error);
            toast.error(error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Donate to Campaign
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {error && (
                    <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleDonate} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Campaign
                        </label>
                        <div className="text-gray-900">{campaign.title}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (ETH) *
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Donate"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonateModal;
