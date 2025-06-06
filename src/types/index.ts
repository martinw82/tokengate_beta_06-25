export type Network = 'base' | 'ethereum' | 'polygon' | 'algorand' | 'any-evm';
export type NetworkEnvironment = 'mainnet' | 'testnet';
export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'ASA' | 'Algorand-NFT' | 'ARC03' | 'ARC69';
export type IntegrationType = 'verification' | 'embed' | 'wordpress' | 'server';
export type ActionType = 'redirect' | 'message' | 'content';

export interface TokenGateAction {
  type: ActionType;
  redirectUrl?: string;
  message?: string;
  content?: string;
}

export interface TokenGateConfig {
  network: Network;
  tokenAddress: string;
  tokenType: TokenType;
  minBalance: string;
  tokenId: string;
  action: TokenGateAction;
  integration: IntegrationType;
  appBaseUrl: string;
}

export interface TestnetTokenGateConfig {
  network: Network;
  tokenAddress: string;
  tokenType: TokenType;
  minBalance: string;
  tokenId: string;
  action: TokenGateAction;
  integration: IntegrationType;
  appBaseUrl: string;
}