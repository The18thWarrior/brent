import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
//import fundAgent from "../agents/fundBuilder";
import messageEvaluator from "../agents/messageEvaluator";

export default () => { 
  return new ZeeWorkflow({
    description: "A workflow that evaluates a series of agent chat responses to summarize.",
    output: "The goal of this workflow is to provide users with a formatted data output. Important: Always use the token addresses exactly as provided by the function call. Do not generate, modify, or add any token addresses that are not returned by the verified function output.",
    agents: { messageEvaluator },
  });
}