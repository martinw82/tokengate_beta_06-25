import { http, createConfig } from 'wagmi'
import { mainnet, base, polygon, arbitrum, optimism } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, base, polygon, arbitrum, optimism],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: 'your-project-id', // TODO: Add to env
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}