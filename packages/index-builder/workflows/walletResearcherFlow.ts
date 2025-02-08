import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import fundAgent from "../agents/fundBuilder";
import walletResearcher from "../agents/walletResearcher";
import tokenResearcher from "../agents/tokenResearcher";

export default (apiKey: string) => { 
  const _walletResearcher = walletResearcher(apiKey);
  return new ZeeWorkflow({
    description: "A workflow that helps users analyze and research their wallets to categorize their risk profile.",
    output: "The goal of this workflow is to provide users with an analysis of their wallet history.",
    agents: { _walletResearcher },
    maxIterations: 20
  });
}