
import { Agent, ModelConfig } from "@covalenthq/ai-agent-sdk";
//import "dotenv/config";
import { modelConfig } from "../services/config";

export default new Agent({
    name: "summary-evaluator",
    model: modelConfig,
    instructions: [
      "Evaluate the input investment strategy and produce a risk tolerance assessment. Risk tolerance can be low, medium, or high.",
    ],
    description: "You are a blockchain researcher that creates lists of tokens that match the user's risk tolerance.",
});
