
import { Agent, createTool, NFTBalancesTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import "dotenv/config";
import { modelConfig } from "../services/config";
import {TokenBalancesTool} from "../tools/customTokenBalance";
import {TransactionsTool} from "../tools/customTransactionHistory";

//const apiKey = process.env.COVALENT_API_KEY as string;



export default (apiKey: string) => {
  const tools = {
    tokenBalances: new TokenBalancesTool(apiKey),
    //nftBalances: new NFTBalancesTool(apiKey),
    //transactions: new TransactionsTool(apiKey),
  };
  return new Agent({
    name: "wallet-researcher",
    model: {...modelConfig, temperature: 0.2},
    instructions: [
      "Use the provided wallet address to analyze the wallets activities using the provided blockchain tools",
      "Provide a risk tolerance assessment for the assessed data. Risk tolerance can be low, medium, or high.",
    ],
    description: "You are a blockchain researcher analyzing wallet activities on the matic-mainnet chain.",
    tools: tools,
  })
} ;
