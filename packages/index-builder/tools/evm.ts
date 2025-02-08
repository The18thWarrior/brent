import { getAddress, isAddress, createPublicClient, http, Address } from "viem";
import { polygon } from "viem/chains";
import abi from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import polygonTokens from '../data/polygon.json';
import baseTokens from '../data/base.json';
import { getRandomItems } from "../services/helper";

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
      walletAddress: z.string().describe("The wallet address to check the balance of."),
      tokenAddress: z.string().describe("The token address to check the balance of."),
      chainId: z.number().describe("The chain ID of the network to check the balance on."),
  }),
  execute: async (params: unknown) => {
    const { walletAddress, tokenAddress, chainId } = params as { walletAddress: string; tokenAddress: string; chainId: number };
    if (chainId !== 137) throw new Error("This tool only supports Polygon mainnet.");
    if (!isAddress(tokenAddress)) throw new Error("Invalid token address.");
    if (!isAddress(walletAddress)) throw new Error("Invalid wallet address.");
    const balance = await getERC20Balance(walletAddress, tokenAddress, process.env.SAFE_RPC_URL as string);
    return balance.toString();
  },
});

const getTokenList = (chaindId: string, tolerance: 'low' | 'medium' | 'high') => {
  //if (chaindId !== 'matic-mainnet') throw new Error("This tool only supports Polygon mainnet.");
  const tokenList = polygonTokens.filter((token) => {
    if (tolerance === 'low') {
      return token?.risk === 'low' && !token?.tags.includes('stablecoin');
    } else if (tolerance === 'medium') {
      return (token?.risk === 'medium' || token?.risk === 'low') && !token?.tags.includes('stablecoin');
    } else if (tolerance === 'high') {
      return !token?.tags.includes('stablecoin');
    }
    return false;
  });
  return tokenList;
}

export const getTokenListTool = createTool({
  id: "get-token-list",
  description: "This tool is used to get a list of tokens based on the specified tolerance level.",
  schema: z.object({
      chainId: z.string().describe("The chain name of the network to get the token list from."),
      tolerance: z.enum(['low', 'medium', 'high']).describe("The tolerance level to filter the token list by."),
  }),
  execute: async (params) => {
    const { tolerance, chainId } = params as { tolerance: 'low'|'medium'|'high'; chainId: string };
    
    const tokenList = getTokenList(chainId, tolerance);
    return JSON.stringify(getRandomItems(tokenList, 100));
  },
});