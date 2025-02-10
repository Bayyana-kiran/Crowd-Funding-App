import React, { useState, useEffect } from "react";
import Web3 from "web3";
// import { db, collection, addDoc } from "../firebase/firebase";
import {
    CheckCircle,
    AlertCircle,
    Building2,
    Trash2,
    PlusCircle,
    Globe,
    Phone,
    Mail,
    MapPin,
    Linkedin,
    Instagram,
    Trophy,
    FileText,
    Wallet,
    Calendar,
    UserPlus,
    Upload,
} from "lucide-react";

function NGORegistration() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        registerType: "",
        dateOfEstablishment: "",
        uniqueDarpanId: "",
        description: "",
        ngoEmail: "",
        walletAddress: "", // Add wallet address field
        phone: "",
        website: "",
        address: "",
        linkedin: "",
        instagram: "",
        founderDetails: [
            {
                name: "",
                role: "",
                email: "",
                phone: "",
                idProof: null,
            },
        ],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFounderChange = (index, e) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                localStorage.setItem(
                    `founder_${index}_idProof`,
                    event.target.result
                );
            };
            reader.readAsDataURL(file);
        }
        setFormData((prev) => {
            const newFounders = [...prev.founderDetails];
            newFounders[index] = {
                ...newFounders[index],
                [name]: type === "file" ? "" : value,
            };
            return {
                ...prev,
                founderDetails: newFounders,
            };
        });
    };

    const addFounder = () => {
        setFormData((prev) => ({
            ...prev,
            founderDetails: [
                ...prev.founderDetails,
                {
                    name: "",
                    role: "",
                    email: "",
                    phone: "",
                    idProof: null,
                },
            ],
        }));
    };

    const removeFounder = (index) => {
        setFormData((prev) => ({
            ...prev,
            founderDetails: prev.founderDetails.filter((_, i) => i !== index),
        }));
    };

    const handleFileUpload = async (e, type) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type and size here if needed
            // For example:
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error("File size should be less than 5MB");
            }

            // Just update the UI or state if needed
            // The actual upload will happen during form submission
        } catch (error) {
            console.error("Error with file:", error);
            setError(error.message);
            // Clear the file input
            e.target.value = "";
            throw error;
        }
    };

    const handleFounderFileUpload = async (e, index) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type and size here if needed
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error("File size should be less than 5MB");
            }

            // Just store the file object in state if needed
            setFormData((prev) => {
                const newFounders = [...prev.founderDetails];
                newFounders[index] = {
                    ...newFounders[index],
                    idProof: file,
                };
                return {
                    ...prev,
                    founderDetails: newFounders,
                };
            });
        } catch (error) {
            console.error("Error with founder file:", error);
            setError(error.message);
            // Clear the file input
            e.target.value = "";
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const requiredFiles = [
                "registrationCertificate",
                "panNGO",
                "annualReport",
                "legalFinanceDocs",
            ];

            // Create a single FormData with all files
            const fileFormData = new FormData();
            fileFormData.append("darpanId", formData.uniqueDarpanId);

            // Add all files to formData
            let allFilesPresent = true;
            requiredFiles.forEach((fileType) => {
                const fileInput = document.querySelector(
                    `input[type="file"][data-type="${fileType}"]`
                );
                if (fileInput && fileInput.files[0]) {
                    fileFormData.append(fileType, fileInput.files[0]);
                } else {
                    allFilesPresent = false;
                }
            });

            if (!allFilesPresent) {
                throw new Error("Please select all required files");
            }

            // Single upload request for all files
            const response = await fetch(
                "http://localhost:5987/api/files/upload",
                {
                    method: "POST",
                    body: fileFormData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload files");
            }

            const data = await response.json();

            // Create final data object with all file URLs
            const finalData = {
                ...formData,
                ...data.fileUrls, // Backend will return all file URLs
                status: "pending",
                createdAt: new Date().toISOString(),
                walletAddress: walletAddress,
            };

            // Submit to Firebase
            await addDoc(collection(db, "ngo"), finalData);
            setSuccess(true);
        } catch (err) {
            console.error("Error submitting form:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get file extension
    const getFileExtension = (filename) => {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 1);
    };

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setWalletConnected(true);
                    setWalletAddress(window.ethereum.selectedAddress);
                } catch (err) {
                    setError("Failed to connect wallet");
                }
            }
        };

        connectWallet();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Building2 className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        NGO Registration Portal
                    </h1>
                    <p className="text-lg text-gray-600">
                        Register your organization and make a difference
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700">
                            NGO registered successfully!
                        </p>
                    </div>
                )}

                {/* Main Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Wallet Connection Status */}
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
                        <div className="flex items-center">
                            <Wallet className="h-6 w-6 text-white mr-2" />
                            <span className="text-white font-medium">
                                Wallet Status
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div
                                className={`h-3 w-3 rounded-full mr-2 ${
                                    walletConnected
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                }`}
                            ></div>
                            <span className="text-white">
                                {walletConnected
                                    ? "Connected"
                                    : "Not Connected"}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                                <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        NGO Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter NGO name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Registration Type
                                    </label>
                                    <select
                                        name="registerType"
                                        value={formData.registerType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="trust">Trust</option>
                                        <option value="society">Society</option>
                                        <option value="section8">
                                            Section 8 Company
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date of Establishment
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dateOfEstablishment"
                                            value={formData.dateOfEstablishment}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        DARPAN ID
                                    </label>
                                    <input
                                        type="text"
                                        name="uniqueDarpanId"
                                        value={formData.uniqueDarpanId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter DARPAN ID"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your NGO's mission and vision"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                                <Mail className="h-6 w-6 mr-2 text-blue-600" />
                                Contact Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="ngoEmail"
                                            value={formData.ngoEmail}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="ngo@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+91 XXXXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://www.example.org"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Complete address"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                                <Globe className="h-6 w-6 mr-2 text-blue-600" />
                                Social Media
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        LinkedIn
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="LinkedIn profile URL"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Instagram
                                    </label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Instagram profile URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Founder Details */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                                    <UserPlus className="h-6 w-6 mr-2 text-blue-600" />
                                    Founder Details
                                </h2>
                                <button
                                    type="button"
                                    onClick={addFounder}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <PlusCircle className="h-5 w-5 mr-1" />
                                    Add Founder
                                </button>
                            </div>

                            {formData.founderDetails.map((founder, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 p-6 rounded-lg space-y-4"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Founder {index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeFounder(index)}
                                            className="flex items-center text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5 mr-1" />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={founder.name}
                                                onChange={(e) =>
                                                    handleFounderChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Founder name"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                name="role"
                                                value={founder.role}
                                                onChange={(e) =>
                                                    handleFounderChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Role in NGO"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={founder.email}
                                                onChange={(e) =>
                                                    handleFounderChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Founder email"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={founder.phone}
                                                onChange={(e) =>
                                                    handleFounderChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Founder phone"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            ID Proof
                                        </label>
                                        <input
                                            type="file"
                                            name="idProof"
                                            onChange={(e) =>
                                                handleFounderFileUpload(
                                                    e,
                                                    index
                                                )
                                            }
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Document Upload Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                Required Documents
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Registration Certificate
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                            <span className="mt-2 text-base leading-normal">
                                                Select file
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                data-type="registrationCertificate"
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        "registrationCertificate"
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        PAN Card
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                            <span className="mt-2 text-base leading-normal">
                                                Select file
                                            </span>
                                            <input
                                                type="file"
                                                data-type="panNGO"
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        "panNGO"
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Annual Report
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                            <span className="mt-2 text-base leading-normal">
                                                Select file
                                            </span>
                                            <input
                                                type="file"
                                                data-type="annualReport"
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        "annualReport"
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Legal & Financial Documents
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                            <span className="mt-2 text-base leading-normal">
                                                Select file
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                data-type="legalFinanceDocs"
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e,
                                                        "legalFinanceDocs"
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting || !walletConnected}
                                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                                    submitting || !walletConnected
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                }`}
                            >
                                {submitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
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
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Submit Registration
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NGORegistration;
