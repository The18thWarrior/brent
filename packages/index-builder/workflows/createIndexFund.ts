import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import fundAgent from "../agents/fundBuilder";
import walletResearcher from "../agents/walletResearcher";
import tokenResearcher from "../agents/tokenResearcher";

export default (apiKey: string) => { 
  const _walletResearcher = walletResearcher(apiKey);
  return new ZeeWorkflow({
    description: "A workflow that helps users build a list of ERC20 tokens on the Polygon chain using an analysis of the users wallet. Important: Always use the token addresses exactly as provided by the function call. Do not generate, modify, or add any token addresses that are not returned by the verified function output.",
    output: "The goal of this workflow is to provide users with a validated list of tokens.",
    agents: { _walletResearcher, tokenResearcher },
  });
}