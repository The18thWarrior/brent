
import { Agent, createTool, NFTBalancesTool, TokenBalancesTool, TransactionsTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import "dotenv/config";
import { modelConfig } from "../services/config";

//const apiKey = process.env.COVALENT_API_KEY as string;



export default (apiKey: string) => {
  const tools = {
    tokenBalances: new TokenBalancesTool(apiKey),
    nftBalances: new NFTBalancesTool(apiKey),
    transactions: new TransactionsTool(apiKey),
  };
  return new Agent({
    name: "wallet-researcher",
    model: modelConfig,
    instructions: [
      "Analyze wallet activities using the provided blockchain tools",
      "Summarize token holdings, NFT collections, and recent transactions",
      "Provide insights about the wallet's activity patterns",
      "Provide a summary of the wallet's overall activity along with a risk tolerance assessment. Risk tolerance can be low, medium, or high.",
    ],
    description: "You are a blockchain researcher analyzing wallet activities on the matic-mainnet chain. You use this analysis to create lists of tokens that match the user's risk tolerance.",
    tools: tools,
  })
} ;
