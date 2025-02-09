import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { Wallet, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            
            // Fetch user's donations
            const response = await fetch(`http://localhost:5987/api/dashboard/donations/user/${accounts[0]}`);
            const donationsData = await response.json();
            setDonations(donationsData);

            fetchWalletData(accounts[0]);
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchWalletData = async (address) => {
    const apiKey = 'BX5PGMJ7IMSQ4F5YXB4T1CZ5UKETMPN5AM';
    try {
      // Fetch wallet balance
      const balanceResponse = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
      );
      const balanceData = await balanceResponse.json();
      setBalance(Web3.utils.fromWei(balanceData.result, 'ether') + ' ETH');

      // Fetch transaction history
      const txResponse = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
      );
      const txData = await txResponse.json();
      setTransactions(txData.result.slice(0, 5)); // Show last 5 transactions
    } catch (error) {
      console.error('Error fetching data from Etherscan:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8 p-6'> 
      <div className="space-y-6">
        {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div> */}
        <p className="text-gray-600">Connected Wallet: {walletAddress}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{balance}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <p className="p-6 text-gray-500">No transactions found.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.hash} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Tx Hash: {tx.hash.slice(0, 10)}...</p>
                    <p className="text-sm text-gray-500">{new Date(tx.timeStamp * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">{Web3.utils.fromWei(tx.value, 'ether')} ETH</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${tx.isError === '0' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tx.isError === '0' ? 'Success' : 'Failed'}
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
