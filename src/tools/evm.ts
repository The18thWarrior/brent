import { getAddress, isAddress, createPublicClient, http, Address } from "viem";
import {polygon} from "viem/chains";
import abi from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";

const getERC20Balance = async (
  walletAddress: string,
  tokenAddress: string,
  rpcUrl: string
) => {
  try {
      const publicClient = createPublicClient({
          chain: polygon,
          transport: http(rpcUrl),
      });
      const balance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: abi.abi,
          functionName: "balanceOf",
          args: [walletAddress as Address],
      });
      const decimals = 6; // USDC has 6 decimals
      const balanceFormatted = Number(balance) / 10 ** decimals;
      return balanceFormatted;
  } catch (err) {
      // console.error(err);
      return 0;
  }
};

export const getERC20BalanceTool = createTool({
  id: "get-erc20-balance",
  description: "This tool is used to get the current balance of an ERC20 token.",
  schema: z.object({
      walletAddress: z.string(),
      tokenAddress: z.string(),
      chainId: z.number(),
  }),
  execute: async (params) => {
    if (params.chainId !== 137) return "This tool only supports Polygon mainnet.";
    if (!isAddress(params.tokenAddress)) return "Invalid token address.";
    if (!isAddress(params.walletAddress)) return "Invalid wallet address.";
    const balance = await getERC20Balance(params.walletAddress, params.tokenAddress, "https://rpc-mainnet.maticvigil.com");
    return balance.toString();
  },
});
