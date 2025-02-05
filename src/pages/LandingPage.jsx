import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';

function LandingPage() {
  const featuredCampaigns = [
    {
      id: 1,
      title: "Clean Water Initiative",
      image: "https://images.unsplash.com/photo-1541372556104-51a9ea9e4139?auto=format&fit=crop&q=80",
      progress: 75,
      goal: "50,000",
      raised: "37,500",
    },
    {
      id: 2,
      title: "Education for All",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
      progress: 60,
      goal: "75,000",
      raised: "45,000",
    },
    {
      id: 3,
      title: "Renewable Energy Project",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80",
      progress: 40,
      goal: "100,000",
      raised: "40,000",
    }
  ];

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
            Empowering change through transparent, blockchain-based crowdfunding. Support causes you believe in with complete trust and transparency.
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
              Built on blockchain technology for maximum transparency and trust
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Secure & Transparent</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                All transactions are recorded on the blockchain, ensuring complete transparency and security.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Real-time Tracking</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Monitor your contributions and campaign progress in real-time with blockchain verification.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Community Driven</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Join a community of changemakers and support causes that matter to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Featured Campaigns
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={campaign.image}
                  alt={campaign.title}
                />
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
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
                      <span>Raised: ${campaign.raised}</span>
                      <span>Goal: ${campaign.goal}</span>
                    </div>
                  </div>
                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Campaign
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/campaigns"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Campaigns
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;