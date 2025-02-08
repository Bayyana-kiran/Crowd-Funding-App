import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { db, collection, addDoc } from "../firebase/firebase";
import { CheckCircle, AlertCircle, Building2 } from "lucide-react";

function NGORegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    walletAddress: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    async function loadWallet() {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();
          setFormData((prev) => ({ ...prev, walletAddress: accounts[0] }));
          setWalletConnected(true);
        } catch (err) {
          setError("Please connect your MetaMask wallet.");
        }
      } else {
        setError("MetaMask not detected. Please install MetaMask.");
      }
    }
    loadWallet();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!formData.walletAddress) {
      setError("Please connect your MetaMask wallet.");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "ngo"), formData);
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Registration Submitted!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your NGO registration has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-8">
          <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">NGO Registration</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-md text-yellow-900">
          <p>
            <strong>Note:</strong> Your connected MetaMask wallet address will be set as the admin wallet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">NGO Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows="4" required value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
            <input type="text" value={formData.walletAddress} readOnly className="w-full p-2 border rounded bg-gray-100 text-gray-600" />
            {!walletConnected && (
              <p className="text-red-600 text-sm mt-1">Please connect MetaMask to proceed.</p>
            )}
          </div>

          <button type="submit" disabled={submitting || !walletConnected} className="w-full bg-indigo-600 text-white py-2 rounded">
            {submitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NGORegistration;
