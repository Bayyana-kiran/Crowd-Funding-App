import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { Wallet, AlertCircle, Loader } from 'lucide-react';

function MetaMaskLogin() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();

  // Create an instance of Web3
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]); // Set wallet address in state
            navigate('/user-dashboard');
          }
        } catch (err) {
          console.error('Error checking wallet:', err);
        }
      }
    };
    checkWalletConnection();
  }, [navigate, web3]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]); // Set wallet address in state
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
            <Wallet className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connect your wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with MetaMask to access your dashboard and make contributions.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isConnecting ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Connecting...
                </>
              ) : (
                'Connect MetaMask'
              )}
            </button>
          ) : (
            <div>
              <p className="text-sm text-gray-600">Connected Wallet: {walletAddress}</p>
              <button
                onClick={disconnectWallet}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Disconnect Wallet
              </button>
            </div>
          )}

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Don't have MetaMask installed?{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Download here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetaMaskLogin;
