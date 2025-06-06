import React, { useState, useEffect } from 'react';
import { NetworkSelector } from './NetworkSelector';
import { TokenTypeSelector } from './TokenTypeSelector';
import { ActionConfig } from './ActionConfig';
import { CodeDisplay } from './CodeDisplay';
import { GatePreview } from './GatePreview';
import { useTokenGate } from '../hooks/useTokenGate';
import { TokenGateConfig, Network, TokenType } from '../types';
import { Lock, Code, Eye, RefreshCw } from 'lucide-react';

export const TokenGateForm: React.FC = () => {
  const { generateCode, isGenerating } = useTokenGate();
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure');
  const [config, setConfig] = useState<TokenGateConfig>({
    network: 'base',
    tokenAddress: '',
    tokenType: 'ERC-20',
    minBalance: '1000000000000000000', // 1 token with 18 decimals
    tokenId: '',
    action: {
      type: 'redirect',
      redirectUrl: '',
      message: '',
      content: ''
    },
    integration: 'embed',
    appBaseUrl: window.location.origin
  });
  
  const [generatedCode, setGeneratedCode] = useState<string>('');

  // Update token type when network changes to ensure compatibility
  useEffect(() => {
    if (config.network === 'algorand') {
      setConfig(prev => ({
        ...prev,
        tokenType: 'ASA'
      }));
    } else if (['ethereum', 'base', 'polygon', 'any-evm'].includes(config.network) && 
               ['ASA', 'Algorand-NFT', 'ARC03', 'ARC69'].includes(config.tokenType)) {
      setConfig(prev => ({
        ...prev,
        tokenType: 'ERC-20'
      }));
    }
  }, [config.network, config.tokenType]);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleActionChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      action: {
        ...prev.action,
        [field]: value
      }
    }));
  };

  const handleGenerateCode = () => {
    const code = generateCode(config);
    setGeneratedCode(code);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center focus:outline-none transition-colors ${
              activeTab === 'configure'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('configure')}
          >
            <div className="flex items-center justify-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>Configure Gate</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center focus:outline-none transition-colors ${
              activeTab === 'preview'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            <div className="flex items-center justify-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>Preview</span>
            </div>
          </button>
        </div>

        {activeTab === 'configure' ? (
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Token Gate Configuration</h2>
                
                <NetworkSelector 
                  value={config.network} 
                  onChange={(value) => handleChange('network', value)} 
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {config.network === 'algorand' ? 'Asset ID' : 'Token Contract Address'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={config.network === 'algorand' ? "Asset ID (e.g., 123456789)" : "0x..."}
                    value={config.tokenAddress}
                    onChange={(e) => handleChange('tokenAddress', e.target.value)}
                  />
                  {config.network === 'any-evm' && (
                    <p className="mt-1 text-xs text-gray-400">
                      You'll need to specify the RPC URL in your implementation.
                    </p>
                  )}
                </div>
                
                <TokenTypeSelector 
                  value={config.tokenType} 
                  onChange={(value) => handleChange('tokenType', value)}
                  network={config.network}
                />
                
                {(config.tokenType !== 'ERC-20' && config.tokenType !== 'ASA') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Specific Token ID (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Leave empty to check for any token"
                      value={config.tokenId}
                      onChange={(e) => handleChange('tokenId', e.target.value)}
                    />
                  </div>
                )}
                
                {(config.tokenType === 'ERC-20' || config.tokenType === 'ASA') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Minimum Balance {config.tokenType === 'ERC-20' ? '(in wei)' : '(in microAlgos)'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={config.tokenType === 'ERC-20' 
                        ? "1000000000000000000 (1 token with 18 decimals)" 
                        : "1000000 (1 Algo)"}
                      value={config.minBalance}
                      onChange={(e) => handleChange('minBalance', e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      {config.tokenType === 'ERC-20' 
                        ? "Most ERC-20 tokens use 18 decimals. 1 token = 1000000000000000000 wei." 
                        : "Algorand Standard Assets may use different decimal places. Check your asset's configuration."}
                    </p>
                  </div>
                )}
              </div>
              
              <ActionConfig 
                action={config.action} 
                onChange={handleActionChange} 
              />
              
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Integration Method</h2>
                
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="integration"
                      value="verification"
                      checked={config.integration === 'verification'}
                      onChange={() => handleChange('integration', 'verification')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-gray-300">Direct Verification URL</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="integration"
                      value="embed"
                      checked={config.integration === 'embed'}
                      onChange={() => handleChange('integration', 'embed')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-gray-300">Embed Script (Client)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="integration"
                      value="wordpress"
                      checked={config.integration === 'wordpress'}
                      onChange={() => handleChange('integration', 'wordpress')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-gray-300">WordPress Shortcode</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="integration"
                      value="server"
                      checked={config.integration === 'server'}
                      onChange={() => handleChange('integration', 'server')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-gray-300">Server Middleware (Node.js)</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    TokenGate App Base URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://your-tokengate-app.com"
                    value={config.appBaseUrl}
                    onChange={(e) => handleChange('appBaseUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  onClick={handleGenerateCode}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Code className="w-5 h-5 mr-2" />
                  )}
                  Generate Code
                </button>
              </div>
              
              {generatedCode && (
                <div className="mt-6">
                  <CodeDisplay code={generatedCode} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <GatePreview config={config} />
        )}
      </div>
    </div>
  );
};