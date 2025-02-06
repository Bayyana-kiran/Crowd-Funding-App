import React from 'react';
import { MessageCircle, Book, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: 'How do I set up a Web3 wallet?',
      answer: 'To set up a Web3 wallet, download MetaMask from their official website, create a new wallet, and securely store your seed phrase. Once set up, connect your wallet to our platform to start contributing to campaigns.'
    },
    {
      question: 'How can I donate to a campaign?',
      answer: 'To donate, connect your Web3 wallet, browse available campaigns, select the one you want to support, enter the amount you wish to donate, and confirm the transaction in your wallet.'
    },
    {
      question: 'How do I register my NGO?',
      answer: 'Navigate to the NGO Registration page, fill out the required information, upload necessary documentation for verification, and sign the registration transaction with your Web3 wallet.'
    },
    {
      question: 'What are the withdrawal requirements?',
      answer: 'Withdrawals require meeting campaign goals, passing verification checks, and approval from our smart contract. The minimum withdrawal amount is 0.1 ETH.'
    }
  ];

  const guides = [
    { title: 'Getting Started with Web3', link: '#' },
    { title: 'Campaign Creation Guide', link: '#' },
    { title: 'Donation Process', link: '#' },
    { title: 'Understanding Smart Contracts', link: '#' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="mt-2 text-gray-600">Find answers to common questions and learn how to use our platform</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500">Talk to our support team</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Book className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-500">Read our guides</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">FAQs</h3>
              <p className="text-sm text-gray-500">Common questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openFaq === index && (
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guides */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Helpful Guides</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {guides.map((guide, index) => (
            <a
              key={index}
              href={guide.link}
              className="p-6 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{guide.title}</span>
              <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
            </a>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6">
          Our support team is available 24/7 to help you with any questions or concerns.
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <MessageCircle className="w-5 h-5 mr-2" />
          Start Live Chat
        </button>
      </div>
    </div>
  );
};

export default HelpSupport;