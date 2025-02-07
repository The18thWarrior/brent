
// config/index.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon, base} from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID as string;

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, polygon, base]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [polygon.id]: http(), 
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http()
  },
})

export const config = wagmiAdapter.wagmiConfig;