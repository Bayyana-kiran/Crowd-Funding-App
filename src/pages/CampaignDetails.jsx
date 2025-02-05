import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Target, Share2, Heart, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

function CampaignDetails() {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Mock data - In production, this would be fetched from your blockchain/API
  const campaign = {
    title: "Clean Water Initiative",
    image: "https://images.unsplash.com/photo-1541372556104-51a9ea9e4139?auto=format&fit=crop&q=80",
    description: "Providing clean and safe drinking water to communities in need. This initiative aims to install water purification systems and wells in areas where access to clean water is limited.",
    progress: 75,
    goal: "50,000",
    raised: "37,500",
    donors: 128,
    daysLeft: 15,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    recentDonations: [
      { address: "0x123...abc", amount: "5,000", timestamp: "2024-03-10" },
      { address: "0x456...def", amount: "2,500", timestamp: "2024-03-09" },
      { address: "0x789...ghi", amount: "1,000", timestamp: "2024-03-08" },
    ]
  };

  const handleDonate = async () => {
    // Implement Web3 donation logic here
    console.log('Donating:', donationAmount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">{campaign.title}</h1>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center text-gray-600">
              <Target className="h-5 w-5 mr-2" />
              <span>Goal: ${campaign.goal}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{campaign.donors} Donors</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{campaign.daysLeft} Days Left</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${campaign.progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Raised: ${campaign.raised}</span>
              <span>{campaign.progress}%</span>
              <span>Goal: ${campaign.goal}</span>
            </div>
          </div>

          <div className="mt-8 prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900">About this campaign</h2>
            <p className="mt-4 text-gray-600">{campaign.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
            <div className="mt-4 space-y-4">
              {campaign.recentDonations.map((donation, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{donation.address}</p>
                      <p className="text-sm text-gray-500">{donation.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${donation.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900">Make a Donation</h2>
            <div className="mt-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (USD)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <button
              onClick={handleDonate}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Donate Now
            </button>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-900"
              >
                <QrCode className="h-4 w-4 mr-2" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </button>
              
              {showQR && (
                <div className="mt-4 flex flex-col items-center">
                  <QRCode
                    value={campaign.walletAddress}
                    size={150}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500 break-all text-center mt-2">
                    {campaign.walletAddress}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails;