/**
 * TokenGate JavaScript
 */
(function($) {
    'use strict';

    // TokenGate object
    window.TokenGate = {
        gates: {},
        
        /**
         * Register a new gate
         */
        registerGate: function(gateId, config) {
            this.gates[gateId] = config;
            
            // Initialize the gate
            this.initGate(gateId);
        },
        
        /**
         * Initialize a gate
         */
        initGate: function(gateId) {
            const $container = $('#' + gateId);
            const $connectButton = $container.find('.tokengate-connect-button');
            const config = this.gates[gateId];
            
            if (!$container.length || !config) {
                console.error('TokenGate: Gate not found', gateId);
                return;
            }
            
            // Connect button click
            $connectButton.on('click', function(e) {
                e.preventDefault();
                
                const $loading = $container.find('.tokengate-loading');
                const $connect = $container.find('.tokengate-connect');
                const $content = $container.find('.tokengate-content');
                const $error = $container.find('.tokengate-error');
                
                // Show loading
                $connect.hide();
                $loading.show();
                
                // Check network and connect appropriate wallet
                if (config.network === 'algorand') {
                    // Handle Algorand with PeraWallet
                    if (typeof PeraWalletConnect === 'undefined') {
                        $loading.hide();
                        $error.html('<p>PeraWallet not found. Please install the PeraWallet app and reload this page.</p>').show();
                        return;
                    }
                    
                    // Initialize PeraWallet with appropriate network
                    const networkConfig = config.environment === 'testnet' ? {network: 'testnet'} : undefined;
                    const peraWallet = new PeraWalletConnect(networkConfig);
                    
                    // Connect to PeraWallet
                    peraWallet.connect()
                        .then(function(accounts) {
                            if (!accounts || accounts.length === 0) {
                                throw new Error('No Algorand accounts found');
                            }
                            
                            const userAddress = accounts[0];
                            
                            // Verify token ownership
                            return TokenGate.verifyTokenOwnership(userAddress, config);
                        })
                        .then(function(result) {
                            $loading.hide();
                            
                            if (result.hasAccess) {
                                if (config.action.type === 'redirect') {
                                    // Not redirecting in WordPress, showing content instead
                                    $content.show();
                                } else if (config.action.type === 'message') {
                                    $content.html('<p>' + config.action.message + '</p>').show();
                                } else {
                                    // Default to showing content
                                    $content.show();
                                }
                            } else {
                                if (config.action.type === 'redirect' && config.action.redirectUrl) {
                                    window.location.href = config.action.redirectUrl;
                                } else {
                                    $error.show();
                                }
                            }
                        })
                        .catch(function(error) {
                            console.error('TokenGate: Error connecting PeraWallet', error);
                            $loading.hide();
                            $error.html('<p>' + (error.message || 'Error connecting wallet') + '</p>').show();
                        });
                } else {
                    // Handle EVM chains with MetaMask
                    // Check if Web3 is available
                    if (typeof window.ethereum === 'undefined') {
                        $loading.hide();
                        $error.html('<p>Web3 provider not found. Please install MetaMask or another Web3 wallet.</p>').show();
                        return;
                    }
                    
                    // Connect wallet
                    window.ethereum.request({ method: 'eth_requestAccounts' })
                        .then(function(accounts) {
                            if (!accounts.length) {
                                throw new Error('No accounts found');
                            }
                            
                            const userAddress = accounts[0];
                            
                            // Verify token ownership
                            return TokenGate.verifyTokenOwnership(userAddress, config);
                        })
                        .then(function(result) {
                            $loading.hide();
                            
                            if (result.hasAccess) {
                                if (config.action.type === 'redirect') {
                                    // Not redirecting in WordPress, showing content instead
                                    $content.show();
                                } else if (config.action.type === 'message') {
                                    $content.html('<p>' + config.action.message + '</p>').show();
                                } else {
                                    // Default to showing content
                                    $content.show();
                                }
                            } else {
                                if (config.action.type === 'redirect' && config.action.redirectUrl) {
                                    window.location.href = config.action.redirectUrl;
                                } else {
                                    $error.show();
                                }
                            }
                        })
                        .catch(function(error) {
                            console.error('TokenGate: Error connecting wallet', error);
                            $loading.hide();
                            $error.html('<p>' + (error.message || 'Error connecting wallet') + '</p>').show();
                        });
                }
            });
        },
        
        /**
         * Verify token ownership
         */
        verifyTokenOwnership: function(userAddress, config) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: tokengate_data.api_url,
                    method: 'POST',
                    data: JSON.stringify({
                        address: userAddress,
                        network: config.network,
                        environment: config.environment || 'mainnet',
                        tokenAddress: config.tokenAddress,
                        tokenType: config.tokenType,
                        minBalance: config.minBalance || undefined,
                        tokenId: config.tokenId || undefined
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(xhr, status, error) {
                        reject(new Error('Error verifying token ownership: ' + error));
                    }
                });
            });
        }
    };

})(jQuery);