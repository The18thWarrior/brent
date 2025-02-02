import { getAddress } from "viem";
import { Alchemy, Network } from "alchemy-sdk";
import { Token } from "./types";


export const getAlchemyNetwork = (chainId: number): Network => {
  switch (chainId) {
      case 1:
          return Network.ETH_MAINNET;
      case 42161:
          return Network.ARB_MAINNET;
      case 8453:
          return Network.BASE_MAINNET;
      case 43114:
          return Network.AVAX_MAINNET;
      case 137:
          return Network.MATIC_MAINNET;
      default:
          return Network.ETH_MAINNET;
  }
};

export const getTokenMetadata = async (address: string, chainId: number) => {
  const tokenAddress = getAddress(address);
  const alchemyNetwork = await getAlchemyNetwork(chainId);
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;

  if (!alchemyApiKey) {
      return;
  }

  const alchemySettings = {
      apiKey: alchemyApiKey,
      network: alchemyNetwork,
      connectionInfoOverrides: {
          skipFetchSetup: true,
      },
  };
  const alchemy = new Alchemy(alchemySettings);
  const tokenMetadata = await alchemy.core.getTokenMetadata(tokenAddress);

  if (tokenMetadata) {
      return {
          address: tokenAddress,
          chainId: chainId,
          decimals: tokenMetadata.decimals ?? 18,
          name: tokenMetadata.name ?? "Unknown Token",
          symbol: tokenMetadata.symbol ?? "UNKNOWN",
          logo: tokenMetadata.logo ?? "",
      } as Token;
  }
  return null;
};
