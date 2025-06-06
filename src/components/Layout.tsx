import React, { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMainnet = location.pathname === '/mainnet';
  const isTestnet = location.pathname === '/testnet';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Link to="/\" className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-500 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                TokenGate
              </h1>
            </Link>
          </div>
          <div className="ml-8 flex space-x-4">
            <Link 
              to="/mainnet" 
              className={`px-3 py-1 rounded-md ${isMainnet 
                ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-800' 
                : 'text-gray-400 hover:text-gray-300 transition-colors'}`}
            >
              Mainnet
            </Link>
            <Link 
              to="/testnet" 
              className={`px-3 py-1 rounded-md ${isTestnet 
                ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-800' 
                : 'text-gray-400 hover:text-gray-300 transition-colors'}`}
            >
              Testnet
            </Link>
          </div>
          <div className="ml-auto">
            <span className="bg-indigo-900/30 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-700/50">
              Beta
            </span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>TokenGate &copy; {new Date().getFullYear()} - Secure token-gated access for your content</p>
        </div>
      </footer>
    </div>
  );
};