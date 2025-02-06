import React from 'react';
import { Shield, Lock, FileText } from 'lucide-react';

const TermsConditions = () => {
  const sections = [
    {
      title: 'Terms of Service',
      icon: FileText,
      content: `
        1. Acceptance of Terms
        By accessing and using this platform, you agree to be bound by these terms and conditions.

        2. Platform Usage
        Users must be at least 18 years old to create an account and use our services.
        All information provided must be accurate and up to date.

        3. Smart Contract Interactions
        Users acknowledge that all transactions are final and recorded on the blockchain.
        We are not responsible for any losses due to user error or blockchain network issues.
      `
    },
    {
      title: 'Privacy Policy',
      icon: Lock,
      content: `
        1. Data Collection
        We collect information necessary for platform operation and compliance.
        Blockchain transactions are public and visible to all network participants.

        2. Data Usage
        Your information is used to:
        - Facilitate platform operations
        - Comply with legal requirements
        - Improve user experience
        - Prevent fraud and abuse

        3. Data Protection
        We implement industry-standard security measures to protect your data.
        Users are responsible for maintaining the security of their wallet credentials.
      `
    },
    {
      title: 'Legal Compliance',
      icon: Shield,
      content: `
        1. Regulatory Compliance
        Users must comply with all applicable laws and regulations.
        KYC/AML procedures may be required for certain transactions.

        2. Prohibited Activities
        Users may not:
        - Engage in fraudulent activities
        - Manipulate platform mechanics
        - Violate any applicable laws

        3. Dispute Resolution
        All disputes will be resolved through arbitration.
        The platform's smart contracts serve as the source of truth for transactions.
      `
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="mt-2 text-gray-600">Please read these terms carefully before using our platform</p>
      </div>

      {/* Last Updated */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Last updated: March 10, 2024
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="prose prose-blue max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm">
                    {section.content}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement</h3>
        <p className="text-gray-600 mb-6">
          By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
        </p>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Accept Terms
          </button>
          <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;