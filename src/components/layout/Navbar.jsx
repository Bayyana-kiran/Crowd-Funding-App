import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wallet, Search } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DeCrowd</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/campaigns" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Campaigns
              </Link>
              <Link to="/ngo/register" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Register NGO
              </Link>
              <Link to="/explorer" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Explorer
              </Link>
              <Link to="/help" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Help
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-64 px-4 py-1 text-sm border rounded-full focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-400" />
            </div>
            <Link
              to="/login"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect Wallet
            </Link>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/campaigns"
              className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50"
            >
              Campaigns
            </Link>
            <Link
              to="/ngo/register"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Register NGO
            </Link>
            <Link
              to="/explorer"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Explorer
            </Link>
            <Link
              to="/help"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Help
            </Link>
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Link
              to="/login"
              className="block mx-3 px-4 py-2 text-center border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;