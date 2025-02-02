import { PoolData, Token } from "bot/services/types";
import { zeroAddress, getAddress, isAddress, createPublicClient, http } from "viem";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json" with { type: "json" };
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { polygon } from "viem/chains";
import { getTokenMetadata as alchemyTokenMetadata } from "bot/services/alchemy";
import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";

type CheckUniswapPoolParams = {
  sourceToken: string, 
  targetToken: string, 
  fee: number, 
  chainId: number,
};

const checkUniswapPool = async({
  sourceToken, 
  targetToken, 
  fee, 
  chainId,
}: CheckUniswapPoolParams) => {
  const _sourceToken = JSON.parse(sourceToken) as Token;
  const _targetToken = JSON.parse(targetToken) as Token;

  const poolContractMap: Record<number, string> = {
      1: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      137: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      8453: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
      43114: "0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD",
      42161: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      56: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
      10: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  };

  const nativeTokens: Record<number, string> = {
      1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      8453: "0x4200000000000000000000000000000000000006",
      43114: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      10: "0x4200000000000000000000000000000000000006",
  };

  // Validate input
  if (!sourceToken || !targetToken || !chainId || fee === 0) {
      return { success: false, message: "Invalid input parameters.", data: null };
  }

  // Adjust if zero addresses
  const sourceAddress =
      _sourceToken.address === zeroAddress
          ? nativeTokens[chainId]
          : _sourceToken.address;
  const targetAddress =
      _targetToken.address === zeroAddress
          ? nativeTokens[chainId]
          : _targetToken.address;

  try {
      const poolAddress = computePoolAddress({
          factoryAddress: poolContractMap[chainId],
          tokenA: new UniswapToken(
              chainId,
              sourceAddress,
              _sourceToken.decimals || 18,
              _sourceToken.name || "TokenA"
          ),
          tokenB: new UniswapToken(
              chainId,
              targetAddress,
              _targetToken.decimals || 18,
              _targetToken.name || "TokenB"
          ),
          fee: fee as FeeAmount,
      });
      //const config = getConfig();
      const client = createPublicClient({
          chain: polygon,
          transport: http(),
      });
      return client
          .readContract({
              abi: IUniswapV3PoolABI.abi,
              address: getAddress(poolAddress),
              functionName: "liquidity",
          })
          .then((liquidity) => {
              const poolData: PoolData = {
                  id: poolAddress,
                  sourceToken: _sourceToken,
                  targetToken: _targetToken,
                  feeTier: fee,
                  liquidity: BigInt(liquidity as bigint).toString(),
              };
              return {
                  success: true,
                  message: "Pool found.",
                  data: poolData,
              };
          })
          .catch((err) => {
              return { success: false, message: err.message, data: null };
          });
  } catch (error: any) {
      return {
          success: false,
          message: error?.message || "Failed to fetch pool data.",
          data: null
      };
  }
}

export const checkUniswapPoolTool = createTool({
  id: "check-uniswap-pool",
  description: "This tool is used to check if a Uniswap V3 pool exists for the given token pair.",
  schema: z.object({
      sourceToken: z.string().describe("The source token address."), 
      targetToken: z.string().describe("The target token address."), 
      fee: z.number().describe("The fee tier of the pool."), 
      chainId: z.number().describe("The chain ID of the network to check the pool on."),
  }),
  execute: async (params) => {
    if (params.chainId !== 137) return "This tool only supports Polygon mainnet.";
    if (!isAddress(params.sourceToken)) return "Invalid source token address.";
    if (!isAddress(params.targetToken)) return "Invalid target token address.";
    const balance = await checkUniswapPool(params);
    if (!balance.success) return balance.message;
    if (!balance.data) return "No pool found.";
    if (balance.data.liquidity === "0") return "Pool found but no liquidity.";
    return 'Pool found with liquidity: ' + balance.data.liquidity;
  },
});

type GetTokenMetadataParams = {
  tokenAddress: string, 
  chainId: number
}

const getTokenMetadata = async({tokenAddress, chainId}: GetTokenMetadataParams) => {
  if (!tokenAddress || !chainId) {
      return { success: false, message: "Invalid request: null parameters are not allowed." };
  }
  if (!isAddress(tokenAddress)) {
      return { success: false, message: "Token is not a valid address." };
  }

  try {
      const tokenMetadata = await alchemyTokenMetadata(
        tokenAddress,
        chainId
      );
      if (!tokenMetadata) {
          return {
              success: false,
              message: "Not found or invalid token.",
              data: null
          };
      }
      return {
          success: true,
          message: "Token metadata fetched.",
          data: tokenMetadata,
      };
  } catch (error: any) {
      return {
          success: false,
          message: error?.message || "Failed to fetch token metadata.",
          data: null
      };
  }
}

export const getTokenMetadataTool = createTool({
  id: "get-token-metadata",
  description: "This tool is used to get the metadata of a token.",
  schema: z.object({
      tokenAddress: z.string().describe("The token address."), 
      chainId: z.number().describe("The chain ID of the network to check the token on."),
  }),
  execute: async (params) => {
    if (params.chainId !== 137) return "This tool only supports Polygon mainnet.";
    if (!isAddress(params.tokenAddress)) return "Invalid token address.";
    const metadata = await getTokenMetadata(params);
    if (!metadata.success) return metadata.message;
    if (!metadata.data) return "No token metadata found.";
    return JSON.stringify(metadata.data);
  },
});
