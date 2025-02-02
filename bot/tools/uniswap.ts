import { PoolData, Token } from "bot/services/types";
import { zeroAddress, getAddress, isAddress, createPublicClient, http } from "viem";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json" with { type: "json" };
import { Token as UniswapToken } from "@uniswap/sdk-core";
import { polygon } from "viem/chains";
import { getTokenMetadata } from "bot/services/alchemy";

const checkUniswapPool = async(content: any) => {
  const { sourceToken, targetToken, fee, chainId } =
      content as unknown as {
          sourceToken: Token;
          targetToken: Token;
          fee: number;
          chainId: number;
      };

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
      return { success: false, message: "Invalid input parameters." };
  }

  // Adjust if zero addresses
  const sourceAddress =
      sourceToken.address === zeroAddress
          ? nativeTokens[chainId]
          : sourceToken.address;
  const targetAddress =
      targetToken.address === zeroAddress
          ? nativeTokens[chainId]
          : targetToken.address;

  try {
      const poolAddress = computePoolAddress({
          factoryAddress: poolContractMap[chainId],
          tokenA: new UniswapToken(
              chainId,
              sourceAddress,
              sourceToken.decimals || 18,
              sourceToken.name || "TokenA"
          ),
          tokenB: new UniswapToken(
              chainId,
              targetAddress,
              targetToken.decimals || 18,
              targetToken.name || "TokenB"
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
                  sourceToken,
                  targetToken,
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
              return { success: false, message: err.message };
          });
  } catch (error: any) {
      return {
          success: false,
          message: error?.message || "Failed to fetch pool data.",
      };
  }
}

const autocompleteToken = async(content: any) => {
  const { query, chainId } = content as unknown as {
      query: string;
      chainId: number;
  };
  if (!query || !chainId) {
      return { success: false, message: "Invalid autocomplete request." };
  }
  if (!isAddress(query)) {
      return { success: false, message: "Query is not a valid address." };
  }

  try {
      const tokenMetadata = await getTokenMetadata(
          query,
          chainId
      );
      if (!tokenMetadata) {
          return {
              success: false,
              message: "Not found or invalid token.",
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
      };
  }
}