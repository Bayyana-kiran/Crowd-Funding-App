import React, { useState } from 'react';
import { Pause, Play, RefreshCw, Trash2, Wallet } from 'lucide-react';

const CampaignActions = ({ campaign, isNGOAdmin }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePause = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5987/api/dashboard/campaigns/${campaign.id}/pause`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ngoAddress: campaign.ngoAddress }),
            });

            if (!response.ok) throw new Error('Failed to pause campaign');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResume = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5987/api/dashboard/campaigns/${campaign.id}/resume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ngoAddress: campaign.ngoAddress }),
            });

            if (!response.ok) throw new Error('Failed to resume campaign');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5987/api/dashboard/withdrawals/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campaignId: campaign.id,
                    ngoAddress: campaign.ngoAddress
                }),
            });

            if (!response.ok) throw new Error('Failed to withdraw funds');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5987/api/dashboard/campaigns/${campaign.id}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ngoAddress: campaign.ngoAddress }),
            });

            if (!response.ok) throw new Error('Failed to refund donors');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5987/api/dashboard/campaigns/${campaign.id}/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ngoAddress: campaign.ngoAddress }),
            });

            if (!response.ok) throw new Error('Failed to remove campaign');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isNGOAdmin) return null;

    return (
        <div className="flex gap-2 mt-4">
            {error && (
                <div className="text-red-500 text-sm mb-2">
                    {error}
                </div>
            )}
            
            {campaign.status === 'active' ? (
                <button
                    onClick={handlePause}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                </button>
            ) : (
                <button
                    onClick={handleResume}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                </button>
            )}

            <button
                onClick={handleWithdraw}
                disabled={loading || campaign.isWithdrawn || parseFloat(campaign.totalRaised) === 0}
                className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
            >
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw
            </button>

            <button
                onClick={handleRefund}
                disabled={loading || campaign.status !== 'ended'}
                className="flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refund
            </button>

            <button
                onClick={handleRemove}
                disabled={loading}
                className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
            </button>
        </div>
    );
};

export default CampaignActions; 