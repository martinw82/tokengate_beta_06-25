import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, CheckCircle, Code, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center">
          <Shield className="w-20 h-20 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Secure Your Digital Content
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            TokenGate provides token-based access control for your web content, 
            apps, and digital experiences on multiple blockchains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/testnet"
              className="px-8 py-4 bg-white text-indigo-900 rounded-lg font-medium text-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Try Testnet
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Mainnet
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Why Choose TokenGate?
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-900/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure Access Control</h3>
            <p className="text-gray-400">
              Restrict access to your content based on blockchain token ownership, creating exclusive experiences.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-900/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Easy Integration</h3>
            <p className="text-gray-400">
              Simple code snippets for embedding in websites, WordPress, or server-side implementation.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="bg-indigo-900/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Chain Support</h3>
            <p className="text-gray-400">
              Works with Ethereum, Base, Polygon, Algorand, and other EVM-compatible blockchains.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-12 bg-gray-800/50 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            How TokenGate Works
          </span>
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-lg">
            <div className="bg-indigo-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-400 font-bold">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Configure Your Token Gate</h3>
              <p className="text-gray-400">
                Select your blockchain, token type, and specify the token contract address that users must own to gain access.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-lg">
            <div className="bg-indigo-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-400 font-bold">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Access Control Action</h3>
              <p className="text-gray-400">
                Decide what happens when users connect their wallets: show a custom message, reveal hidden content, or redirect to another page.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-lg">
            <div className="bg-indigo-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-400 font-bold">3</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Generate & Implement Code</h3>
              <p className="text-gray-400">
                Get your custom code snippet based on your integration preference and add it to your website or application.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-lg">
            <div className="bg-indigo-900/50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-400 font-bold">4</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Users Connect Their Wallets</h3>
              <p className="text-gray-400">
                Visitors connect their crypto wallets, and TokenGate verifies their token ownership on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Popular Use Cases
          </span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-indigo-400 mr-2" />
              Premium Content Access
            </h3>
            <p className="text-gray-400">
              Lock articles, videos, or downloads behind token ownership requirements.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-indigo-400 mr-2" />
              NFT-Gated Communities
            </h3>
            <p className="text-gray-400">
              Provide exclusive forum access or Discord channels to NFT holders.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-indigo-400 mr-2" />
              Early Access Products
            </h3>
            <p className="text-gray-400">
              Give token holders early access to product launches, events, or sales.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-indigo-400 mr-2" />
              Token-Based Voting
            </h3>
            <p className="text-gray-400">
              Enable governance mechanisms based on token ownership for DAOs and communities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Implement Token Gating?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start creating exclusive experiences for your token holders today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group px-8 py-4 bg-white text-indigo-900 rounded-lg font-medium text-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Get Started with Mainnet
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/testnet"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Try with Testnet First
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/" className="text-gray-300 hover:text-white flex items-center">
              <Code className="mr-2 w-5 h-5" />
              <span>View Documentation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};