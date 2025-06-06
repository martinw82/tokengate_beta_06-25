import { TokenGateConfig } from '../types';

export const generateVerificationUrl = (config: TokenGateConfig): string => {
  const baseUrl = config.appBaseUrl.replace(/\/$/, '');

  const params = new URLSearchParams();
  params.append('network', config.network);
  params.append('tokenAddress', config.tokenAddress);
  params.append('tokenType', config.tokenType);

  if (['ERC-20', 'ASA'].includes(config.tokenType)) {
    params.append('minBalance', config.minBalance);
  } else if (config.tokenId) {
    params.append('tokenId', config.tokenId);
  }

  if (config.action.type === 'redirect') {
    params.append('redirectUrl', config.action.redirectUrl);
  } else if (config.action.type === 'message') {
    params.append('message', config.action.message);
  } else if (config.action.type === 'content') {
    params.append('content', encodeURIComponent(config.action.content));
  }

  return `${baseUrl}/gate?${params.toString()}`;
};

export const generateEmbedCode = (config: TokenGateConfig): string => {
  const baseUrl = config.appBaseUrl.replace(/\/$/, '');
  let content = '';

  if (config.action.type === 'content') {
    content = config.action.content || '<p>This content is protected by TokenGate.</p>';
  } else {
    content = '<p>This content is protected by TokenGate.</p>';
  }

  let walletProviderCode = '';
  let verificationCode = '';

  // Generate network-specific code
  if (config.network === 'algorand') {
    walletProviderCode = `
        // Initialize PeraWallet
        const peraWallet = new PeraWalletConnect();
        
        try {
          // Connect to PeraWallet
          const accounts = await peraWallet.connect();
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No Algorand accounts found');
          }
          
          const userAddress = accounts[0];`;

    verificationCode = `
        // Verify token ownership for Algorand
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: userAddress,
            network: config.network,
            tokenAddress: config.tokenAddress, // Asset ID for Algorand
            tokenType: config.tokenType,
            ${config.tokenType === 'ASA' ? `minBalance: config.minBalance,` : ''}
            ${config.tokenId ? `tokenId: config.tokenId,` : ''}
          }),
        });`;
  } else {
    // Default EVM-compatible code
    const networkMappings = {
      ethereum: { chainId: '0x1' }, // Mainnet
      polygon: { chainId: '0x89' }, // Polygon Mainnet
      base: { chainId: '0x2105' }, // Base Mainnet
    };

    const chainConfig = config.network !== 'any-evm'
      ? networkMappings[config.network as keyof typeof networkMappings]
      : null;

    walletProviderCode = `
        // Check if Web3 is available
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Web3 provider not found. Please install MetaMask.');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        ${chainConfig ? `
        // Ensure correct network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '${chainConfig.chainId}' }],
          });
        } catch (switchError) {
          // Network not added to MetaMask
          console.error('Failed to switch to the correct network:', switchError);
        }` : ''}`;

    verificationCode = `
        // Verify token ownership
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: userAddress,
            network: config.network,
            tokenAddress: config.tokenAddress,
            tokenType: config.tokenType,
            ${config.tokenType === 'ERC-20' ? `minBalance: config.minBalance,` : ''}
            ${config.tokenId ? `tokenId: config.tokenId,` : ''}
            ${config.network === 'any-evm' ? `rpcUrl: "YOUR_RPC_URL_HERE", // Replace with your RPC URL` : ''}
          }),
        });`;
  }

  return `<!-- TokenGate Embed Code -->
<div id="token-gate-container">
  <div id="token-gate-loading" style="display: none; text-align: center; padding: 20px;">
    Connecting to wallet...
  </div>
  <div id="token-gate-connect" style="text-align: center; padding: 20px;">
    <p>This content requires token ownership to view.</p>
    <button id="token-gate-connect-button" style="background-color: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
      Connect Wallet
    </button>
  </div>
  <div id="token-gate-content" style="display: none;">
    ${content}
  </div>
  <div id="token-gate-error" style="display: none; text-align: center; padding: 20px; color: #ef4444;">
    Access denied. You don't have the required token.
  </div>
</div>

${config.network === 'algorand' ? 
`<!-- Include PeraWallet Connect -->
<script src="https://unpkg.com/@perawallet/connect/dist/perawalletconnect.umd.js"></script>` : ''}

<script>
  (function() {
    // TokenGate Configuration
    const config = {
      network: "${config.network}",
      tokenAddress: "${config.tokenAddress}",
      tokenType: "${config.tokenType}",
      ${config.tokenType === 'ERC-20' || config.tokenType === 'ASA' ? `minBalance: "${config.minBalance}",` : ''}
      ${config.tokenId ? `tokenId: "${config.tokenId}",` : ''}
      action: {
        type: "${config.action.type}",
        ${config.action.type === 'redirect' ? `redirectUrl: "${config.action.redirectUrl || ''}"` : ''}
        ${config.action.type === 'message' ? `message: "${config.action.message || ''}"` : ''}
      },
      apiUrl: "${baseUrl}/api/check-token"
    };

    // Elements
    const connectEl = document.getElementById('token-gate-connect');
    const connectButton = document.getElementById('token-gate-connect-button');
    const loadingEl = document.getElementById('token-gate-loading');
    const contentEl = document.getElementById('token-gate-content');
    const errorEl = document.getElementById('token-gate-error');

    // Connect wallet
    connectButton.addEventListener('click', function() {
      connectEl.style.display = 'none';
      loadingEl.style.display = 'block';

      (async function() {
        try {${walletProviderCode}${verificationCode}

          const data = await response.json();

          loadingEl.style.display = 'none';

          if (data.hasAccess) {
            contentEl.style.display = 'block';
            
            ${config.action.type === 'redirect' ? 
              `// Not redirecting in embed mode, showing content instead` : ''}
            
            ${config.action.type === 'message' ? 
              `contentEl.innerHTML = '<p>${config.action.message || 'Access granted!'}</p>';` : ''}
          } else {
            errorEl.style.display = 'block';
            
            ${config.action.type === 'redirect' ? 
              `// Redirect user to specified URL
              setTimeout(() => {
                window.location.href = "${config.action.redirectUrl || '/'}";
              }, 2000);` : ''}
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
          loadingEl.style.display = 'none';
          errorEl.textContent = error.message || 'Error connecting wallet';
          errorEl.style.display = 'block';
        }
      })();
    });
  })();
</script>`;
};

export const generateWordPressCode = (config: TokenGateConfig): string => {
  const actionAttributes = 
    config.action.type === 'redirect' ? ` action_type="redirect" redirect_url="${config.action.redirectUrl || ''}"` :
    config.action.type === 'message' ? ` action_type="message" message="${config.action.message || ''}"` :
    ' action_type="content"';

  let tokenAttributes = '';
  if (config.tokenType === 'ERC-20' || config.tokenType === 'ASA') {
    tokenAttributes = ` min_balance="${config.minBalance}"`;
  } else if (config.tokenId) {
    tokenAttributes = ` token_id="${config.tokenId}"`;
  }

  // For custom EVM chains, add an additional attribute
  const customAttributes = config.network === 'any-evm' ? ` custom_rpc="YOUR_RPC_URL_HERE"` : '';

  return `[tokengate network="${config.network}" token_address="${config.tokenAddress}" token_type="${config.tokenType}"${tokenAttributes}${actionAttributes}${customAttributes}]
  Your protected content goes here. This will only be visible to users who own the required token.
[/tokengate]`;
};

// Helper function to generate access denied HTML
const generateAccessDeniedHTML = (): string => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <title>Access Denied</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          p {
            color: #666;
            margin-bottom: 20px;
          }
          .button {
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Access Denied</h1>
          <p>You don't have the required token to access this content.</p>
          <p>The requested content requires ownership of a specific token on the blockchain network.</p>
          <a href="/" class="button">Go Home</a>
        </div>
      </body>
      </html>`;
};

// Helper function to generate verify access HTML
const generateVerifyAccessHTML = (config: TokenGateConfig, walletProviderScript: string, connectWalletCode: string): string => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <title>Verify Token Access</title>
        ${walletProviderScript}
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          p {
            color: #666;
            margin-bottom: 20px;
          }
          .button {
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .loading {
            display: none;
            text-align: center;
            padding: 20px;
          }
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4f46e5;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .result {
            display: none;
            margin-top: 20px;
          }
          .success {
            color: #10b981;
          }
          .error {
            color: #ef4444;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Token Access Verification</h1>
          <p>Connect your wallet to verify access to protected content.</p>
          
          <div id="connect">
            <button id="connect-button" class="button">Connect Wallet</button>
          </div>
          
          <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Verifying token ownership...</p>
          </div>
          
          <div id="result" class="result">
            <p id="result-message"></p>
            <div id="access-buttons" style="display: none;">
              <a href="/protected" class="button">Continue to Protected Content</a>
            </div>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const connectEl = document.getElementById('connect');
            const connectButton = document.getElementById('connect-button');
            const loadingEl = document.getElementById('loading');
            const resultEl = document.getElementById('result');
            const resultMessageEl = document.getElementById('result-message');
            const accessButtonsEl = document.getElementById('access-buttons');
            
            // Connect wallet button click
            connectButton.addEventListener('click', function() {
              connectEl.style.display = 'none';
              loadingEl.style.display = 'block';
              
              ${connectWalletCode}
            });
            
            function showError(message) {
              connectEl.style.display = 'none';
              loadingEl.style.display = 'none';
              resultEl.style.display = 'block';
              resultMessageEl.className = 'error';
              resultMessageEl.textContent = message;
            }
            
            // Check for address in URL params (returning from verification)
            const urlParams = new URLSearchParams(window.location.search);
            const address = urlParams.get('address');
            const status = urlParams.get('status');
            
            if (address && status) {
              connectEl.style.display = 'none';
              loadingEl.style.display = 'none';
              resultEl.style.display = 'block';
              
              if (status === 'success') {
                resultMessageEl.className = 'success';
                resultMessageEl.textContent = 'Verification successful! You have access to the protected content.';
                accessButtonsEl.style.display = 'block';
              } else {
                resultMessageEl.className = 'error';
                resultMessageEl.textContent = 'Verification failed. You don\\'t have the required token.';
              }
            }
          });
        </script>
      </body>
      </html>`;
};

export const generateServerCode = (config: TokenGateConfig): string => {
  const baseUrl = config.appBaseUrl.replace(/\/$/, '');
  
  // Generate network-specific verification code
  let verificationCode = '';
  
  if (config.network === 'algorand') {
    verificationCode = `  // Verify token ownership on Algorand
const verifyTokenOwnership = async (userAddress, config) => {
  // For Algorand, we'll need to use the Algorand SDK
  // This is a simplified example - in production, you'd want to use the Algorand SDK
  
  try {
    // Use your TokenGate API to check token ownership
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
        network: config.network,
        tokenAddress: config.tokenAddress, // Asset ID for Algorand
        tokenType: config.tokenType,
        ${config.tokenType === 'ASA' ? 'minBalance: config.minBalance,' : ''}
        ${config.tokenId ? 'tokenId: config.tokenId,' : ''}
      }),
    });
    
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    
    const data = await response.json();
    return data.hasAccess;
  } catch (error) {
    console.error('Error verifying Algorand token ownership:', error);
    throw error;
  }
};`;
  } else if (config.network === 'any-evm') {
    verificationCode = `  // Verify token ownership on custom EVM chain
const verifyTokenOwnership = async (userAddress, config) => {
  // For custom EVM chains, we need an RPC URL
  if (!config.rpcUrl) {
    throw new Error('RPC URL is required for custom EVM chains');
  }
  
  try {
    // Use your TokenGate API to check token ownership
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
        network: config.network,
        tokenAddress: config.tokenAddress,
        tokenType: config.tokenType,
        ${config.tokenType === 'ERC-20' ? 'minBalance: config.minBalance,' : ''}
        ${config.tokenId ? 'tokenId: config.tokenId,' : ''}
        rpcUrl: config.rpcUrl,
      }),
    });
    
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    
    const data = await response.json();
    return data.hasAccess;
  } catch (error) {
    console.error('Error verifying token ownership:', error);
    throw error;
  }
};`;
  } else {
    // Default EVM verification
    verificationCode = `  // Verify token ownership
const verifyTokenOwnership = async (address, config) => {
  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      network: config.network,
      tokenAddress: config.tokenAddress,
      tokenType: config.tokenType,
      ${config.tokenType === 'ERC-20' ? 'minBalance: config.minBalance,' : ''}
      ${config.tokenId ? 'tokenId: config.tokenId,' : ''}
    }),
  });
  
  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }
  
  const data = await response.json();
  return data.hasAccess;
};`;
  }

  // Additional imports for Algorand
  let additionalImports = '';
  if (config.network === 'algorand') {
    additionalImports = `
// For Algorand integration, you might want to add:
// const algosdk = require('algosdk');`;
  }

  // Additional config options
  let additionalConfigOptions = '';
  if (config.network === 'any-evm') {
    additionalConfigOptions = `
    // Required for custom EVM chains
    rpcUrl: "https://your-custom-chain-rpc.url",`;
  }

  return `// TokenGate Server Middleware (Express.js)
// ----------------------------------------
// Save this as 'tokengate-middleware.js'

const express = require('express');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');${additionalImports}

// Create TokenGate middleware
const createTokenGate = (app, options) => {
  // Default options
  const defaultOptions = {
    // TokenGate configuration
    network: "${config.network}",
    tokenAddress: "${config.tokenAddress}",
    tokenType: "${config.tokenType}",
    ${config.tokenType === 'ERC-20' || config.tokenType === 'ASA' ? `minBalance: "${config.minBalance}",` : ''}
    ${config.tokenId ? `tokenId: "${config.tokenId}",` : ''}${additionalConfigOptions}
    
    // Action configuration
    action: {
      type: "${config.action.type}",
      ${config.action.type === 'redirect' ? `redirectUrl: "${config.action.redirectUrl || '/access-denied'}"` : ''}
      ${config.action.type === 'message' ? `message: "${config.action.message || 'Access granted!'}"` : ''}
    },
    
    // TokenGate API
    apiUrl: "${baseUrl}/api/check-token",
    
    // Routes to protect
    protectedRoutes: ['/protected', '/members/*'],
    
    // Session configuration
    cookieName: 'tokengate_session',
    cookieSecret: crypto.randomBytes(20).toString('hex'), // Generate a secure random secret
    
    // Cache successful verifications (in seconds)
    cacheTime: 3600 // 1 hour
  };
  
  // Merge options
  const config = { ...defaultOptions, ...options };
  
  // Use cookie-parser middleware
  app.use(cookieParser(config.cookieSecret));
  
  // TokenGate middleware
  const tokenGateMiddleware = async (req, res, next) => {
    // Skip middleware for non-protected routes
    if (!isProtectedRoute(req.path, config.protectedRoutes)) {
      return next();
    }
    
    // Check if user has a valid session
    const sessionData = getSession(req, config.cookieName);
    if (sessionData && sessionData.verified && sessionData.expires > Date.now()) {
      return next();
    }
    
    // Get wallet address from req.user (needs auth middleware) or query parameter
    const walletAddress = req.user?.walletAddress || req.query.address;
    
    // If no wallet address, handle accordingly
    if (!walletAddress) {
      return handleUnauthorized(req, res, config);
    }
    
    try {
      // Verify token ownership
      const verified = await verifyTokenOwnership(walletAddress, config);
      
      if (verified) {
        // Set session cookie
        setSession(res, config.cookieName, {
          verified: true,
          expires: Date.now() + (config.cacheTime * 1000)
        });
        return next();
      } else {
        return handleUnauthorized(req, res, config);
      }
    } catch (error) {
      console.error('TokenGate verification error:', error);
      return handleUnauthorized(req, res, config);
    }
  };
  
  // Install middleware
  config.protectedRoutes.forEach(route => {
    if (route.includes('*')) {
      // Handle wildcard routes
      const baseRoute = route.replace('*', '');
      app.use(baseRoute, (req, res, next) => {
        if (req.path.startsWith(baseRoute)) {
          return tokenGateMiddleware(req, res, next);
        }
        next();
      });
    } else {
      // Exact route match
      app.use(route, tokenGateMiddleware);
    }
  });
  
  // Add access denied route
  app.get('/access-denied', (req, res) => {
    res.status(403).send(generateAccessDeniedHTML());
  });
  
  // Create access verification page
  app.get('/verify-access', (req, res) => {
    const walletProviderScript = config.network === 'algorand' ? 
      '<script src="https://unpkg.com/@perawallet/connect/dist/perawalletconnect.umd.js"></script>' : '';
    
    const connectWalletCode = config.network === 'algorand' ? 
      `(async function() {
        try {
          // Initialize PeraWallet
          const peraWallet = new PeraWalletConnect();
          
          // Connect to PeraWallet
          const accounts = await peraWallet.connect();
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No Algorand accounts found');
          }
          
          // Redirect to verification endpoint with address
          const redirectUrl = encodeURIComponent(window.location.href);
          window.location.href = '/verify-access?address=' + accounts[0] + '&redirect=' + redirectUrl;
        } catch (error) {
          showError(error.message || 'Error connecting to PeraWallet');
        }
      })();` 
      : 
      `(async function() {
        try {
          // Connect to Web3 wallet
          if (typeof window.ethereum === 'undefined') {
            showError('Web3 provider not found. Please install MetaMask or another Web3 wallet.');
            return;
          }
          
          // Request accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (!accounts.length) {
            throw new Error('No accounts found');
          }
          
          // Redirect to verification endpoint with address
          const redirectUrl = encodeURIComponent(window.location.href);
          window.location.href = '/verify-access?address=' + accounts[0] + '&redirect=' + redirectUrl;
        } catch (error) {
          showError(error.message || 'Error connecting wallet');
        }
      })();`;
    
    res.send(generateVerifyAccessHTML(config, walletProviderScript, connectWalletCode));
  });
  
  return tokenGateMiddleware;
};

// Helper functions
const isProtectedRoute = (path, protectedRoutes) => {
  return protectedRoutes.some(route => {
    if (route.includes('*')) {
      const baseRoute = route.replace('*', '');
      return path.startsWith(baseRoute);
    }
    return route === path;
  });
};

const getSession = (req, cookieName) => {
  try {
    const cookie = req.signedCookies[cookieName];
    return cookie ? JSON.parse(cookie) : null;
  } catch (error) {
    return null;
  }
};

const setSession = (res, cookieName, data) => {
  res.cookie(cookieName, JSON.stringify(data), {
    signed: true,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });
};

${verificationCode}

const handleUnauthorized = (req, res, config) => {
  // Handle based on action type
  if (config.action.type === 'redirect') {
    const redirectUrl = config.action.redirectUrl || '/access-denied';
    return res.redirect(redirectUrl);
  } else {
    return res.redirect('/access-denied');
  }
};

module.exports = { createTokenGate };

// USAGE EXAMPLE:
// ---------------------------------------------
// const express = require('express');
// const { createTokenGate } = require('./tokengate-middleware');
// 
// const app = express();
// 
// // Set up TokenGate middleware
// createTokenGate(app, {
//   // Override any default options if needed
//   protectedRoutes: ['/members', '/premium/*']${config.network === 'any-evm' ? `,
//   rpcUrl: "https://your-custom-chain-rpc.url"` : ''}
// });
// 
// // Define your routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the public homepage!');
// });
// 
// app.get('/protected', (req, res) => {
//   // This route is protected by TokenGate
//   res.send('You have access to protected content!');
// });
// 
// app.get('/members', (req, res) => {
//   // This route is also protected
//   res.send('Welcome to the members area!');
// });
// 
// app.listen(3000, () => {
//   console.log('Server running at http://localhost:3000');
// });
`;
};