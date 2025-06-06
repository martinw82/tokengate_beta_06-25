import React from 'react';
import { TokenType, Network } from '../types';

interface TokenTypeSelectorProps {
  value: TokenType;
  onChange: (value: TokenType) => void;
  network: Network;
}

export const TokenTypeSelector: React.FC<TokenTypeSelectorProps> = ({ value, onChange, network }) => {
  // Define token types based on the selected network
  let tokenTypes = [];
  
  if (network === 'algorand') {
    tokenTypes = [
      { 
        id: 'ASA', 
        name: 'Algorand Standard Asset', 
        description: 'Fungible tokens on Algorand' 
      },
      { 
        id: 'Algorand-NFT', 
        name: 'Algorand NFT', 
        description: 'Non-fungible tokens on Algorand' 
      }
    ];
  } else {
    // EVM-compatible chains (ethereum, base, polygon, any-evm)
    tokenTypes = [
      { 
        id: 'ERC-20', 
        name: 'ERC-20 Token', 
        description: 'Fungible tokens (e.g. USDC, UNI)' 
      },
      { 
        id: 'ERC-721', 
        name: 'ERC-721 NFT', 
        description: 'Non-fungible tokens (unique assets)' 
      },
      { 
        id: 'ERC-1155', 
        name: 'ERC-1155 Multi Token', 
        description: 'Semi-fungible tokens (e.g. game items)' 
      }
    ];
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Token Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tokenTypes.map((type) => (
          <div
            key={type.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${value === type.id 
                ? 'border-indigo-500 bg-indigo-900/20' 
                : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
              }
            `}
            onClick={() => onChange(type.id as TokenType)}
          >
            <div className="font-medium text-white">{type.name}</div>
            <div className="text-xs text-gray-400 mt-1">{type.description}</div>
          </div>
        ))}
      </div>
      
      {network === 'algorand' && (
        <div className="mt-2 text-xs text-gray-400">
          <p>For Algorand assets, use the Asset ID as the token address.</p>
        </div>
      )}
      
      {network === 'any-evm' && (
        <div className="mt-2 text-xs text-gray-400">
          <p>For custom EVM chains, you'll need to specify the RPC URL in your implementation.</p>
        </div>
      )}
    </div>
  );
};