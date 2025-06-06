import React from 'react';
import { Network } from '../types';

interface NetworkSelectorProps {
  value: Network;
  onChange: (value: Network) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ value, onChange }) => {
  const networks = [
    { id: 'base', name: 'Base Mainnet', description: 'Coinbase Layer 2 Network' },
    { id: 'ethereum', name: 'Ethereum Mainnet', description: 'Main Ethereum Network' },
    { id: 'polygon', name: 'Polygon Mainnet', description: 'Polygon PoS Chain' },
    { id: 'algorand', name: 'Algorand', description: 'Algorand Blockchain' },
    { id: 'any-evm', name: 'Any EVM Chain', description: 'Any EVM-compatible blockchain' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Blockchain Network
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {networks.map((network) => (
          <div
            key={network.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${value === network.id 
                ? 'border-indigo-500 bg-indigo-900/20' 
                : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
              }
            `}
            onClick={() => onChange(network.id as Network)}
          >
            <div className="font-medium text-white">{network.name}</div>
            <div className="text-xs text-gray-400 mt-1">{network.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};