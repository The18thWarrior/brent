import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import fundAgent from "../agents/fundBuilder";
// import walletResearcher from "../agents/walletResearcher";
import tokenResearcher from "../agents/tokenResearcher";
import summaryEvaluator from "../agents/summaryEvaluator";

export default () => { 
  return new ZeeWorkflow({
    description: "A workflow that helps users build a ERC20 index fund list on the Polygon chain using an analysis of the users wallet.",
    output: "The goal of this workflow is to provide users with a validated list of tokens. The token list should be JSON formatted matching the following schema: ```json { \"tokens\": [ { \"address\": \"0x1234...\", \"risk\": \"low\", \"category\": \"stablecoin\" } ] } ```",
    agents: { summaryEvaluator, tokenResearcher }
  });
}