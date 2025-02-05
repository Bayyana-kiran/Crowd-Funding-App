import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Target, Clock } from 'lucide-react';

function CampaignsNGOs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - In production, this would be fetched from your blockchain/API
  const campaigns = [
    {
      id: 1,
      title: "Clean Water Initiative",
      ngo: "Global Water Foundation",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1541372556104-51a9ea9e4139?auto=format&fit=crop&q=80",
      description: "Providing clean and safe drinking water to communities in need.",
      progress: 75,
      goal: "50,000",
      raised: "37,500",
      donors: 128,
      daysLeft: 15,
    },
    {
      id: 2,
      title: "Education for All",
      ngo: "Education First Initiative",
      category: "Education",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
      description: "Supporting underprivileged children with quality education.",
      progress: 60,
      goal: "75,000",
      raised: "45,000",
      donors: 95,
      daysLeft: 20,
    },
    {
      id: 3,
      title: "Renewable Energy Project",
      ngo: "Green Earth Project",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80",
      description: "Implementing solar power solutions in rural communities.",
      progress: 40,
      goal: "100,000",
      raised: "40,000",
      donors: 72,
      daysLeft: 30,
    },
  ];

  const categories = ['all', 'Environment', 'Education', 'Healthcare', 'Social', 'Technology'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.ngo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search campaigns or NGOs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">by {campaign.ngo}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {campaign.category}
                </span>
              </div>
              
              <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                {campaign.description}
              </p>

              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${campaign.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${campaign.raised} raised</span>
                  <span>{campaign.progress}%</span>
                  <span>Goal: ${campaign.goal}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{campaign.donors} Donors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{campaign.daysLeft} Days Left</span>
                </div>
              </div>

              <Link
                to={`/campaign/${campaign.id}`}
                className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No campaigns found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default CampaignsNGOs;