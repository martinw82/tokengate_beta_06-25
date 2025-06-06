import React, { useState } from 'react';
import { TokenGateConfig, TestnetTokenGateConfig } from '../types';
import { Shield, Wallet, CheckCircle, XCircle } from 'lucide-react';

interface GatePreviewProps {
  config: TokenGateConfig | TestnetTokenGateConfig;
}

export const GatePreview: React.FC<GatePreviewProps> = ({ config }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleConnectWallet = () => {
    setIsChecking(true);
    // Simulate verification delay
    setTimeout(() => {
      setWalletConnected(true);
      setIsChecking(false);
      // For demo purposes, we'll randomly grant or deny access
      setHasAccess(Math.random() > 0.5);
    }, 1500);
  };

  const handleReset = () => {
    setWalletConnected(false);
    setHasAccess(false);
  };

  const renderAccessDenied = () => {
    if (config.action.type === 'redirect') {
      return (
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
          <p className="text-gray-400 mb-4">
            You don't have the required token to access this content.
          </p>
          <p className="text-sm text-gray-500">
            You would be redirected to:
            <br />
            <span className="text-blue-400 break-all">
              {config.action.redirectUrl || 'https://example.com/access-denied'}
            </span>
          </p>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
        <p className="text-gray-400">
          You don't have the required token to access this content.
        </p>
      </div>
    );
  };

  const renderAccessGranted = () => {
    if (config.action.type === 'message') {
      return (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Access Granted</h3>
          <p className="text-gray-300">
            {config.action.message || "Congratulations! You have access to this content."}
          </p>
        </div>
      );
    }
    
    if (config.action.type === 'content') {
      return (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Access Granted</h3>
          <div className="mt-4 p-4 bg-white/10 rounded-lg text-gray-300">
            <p className="text-sm text-gray-400 mb-2">Protected content revealed:</p>
            <div className="font-mono text-xs whitespace-pre-wrap text-left overflow-auto max-h-32">
              {config.action.content || "<div>This is premium content only visible to token holders!</div>"}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Access Granted</h3>
        <p className="text-gray-300">
          You have the required token to access this content.
        </p>
      </div>
    );
  };

  const getNetworkDisplayName = (network: string): string => {
    const networkMap: {[key: string]: string} = {
      'base': 'Base',
      'ethereum': 'Ethereum',
      'polygon': 'Polygon',
      'algorand': 'Algorand',
      'any-evm': 'EVM-compatible'
    };
    return networkMap[network] || network.charAt(0).toUpperCase() + network.slice(1);
  };

  // Check if we're on the testnet page
  const isTestnet = window.location.pathname.includes('/testnet');

  return (
    <div className="p-6 min-h-[400px] flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {!walletConnected ? (
          <div className="text-center p-6">
            <Shield className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Token-Gated Content
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              This content is protected and requires ownership of a specific token on 
              the {getNetworkDisplayName(config.network)} {isTestnet ? 'testnet' : 'mainnet'} network.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isChecking}
              className={`
                px-4 py-2 rounded-md flex items-center mx-auto
                ${isChecking 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }
                transition-colors
              `}
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md">
            {hasAccess ? renderAccessGranted() : renderAccessDenied()}
            
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-300 text-sm underline"
              >
                Reset Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};