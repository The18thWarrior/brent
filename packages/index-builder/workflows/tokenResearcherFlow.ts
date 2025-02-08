import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import fundAgent from "../agents/fundBuilder";
import walletResearcher from "../agents/walletResearcher";
import tokenResearcher from "../agents/tokenResearcher";
import outputGenerator from "../agents/outputGenerator";

export default () => { 
  return new ZeeWorkflow({
    description: "A workflow that helps users build a list of ERC20 tokens using the inputted riskTolerance and philosophySummary.",
    output: "The goal of this workflow is to provide users with a list of tokens. Important: Always use the token addresses exactly as provided by the function call. Do not generate, modify, or add any token addresses that are not returned by the verified function output.",
    agents: { tokenResearcher, outputGenerator },
    maxIterations: 30
  });
}