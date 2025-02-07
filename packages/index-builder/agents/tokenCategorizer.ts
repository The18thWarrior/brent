
import { Agent, ModelConfig } from "@covalenthq/ai-agent-sdk";
//import "dotenv/config";
import { modelConfig } from "../services/config";

export default new Agent({
    name: "token-categorizer",
    model: {...modelConfig, temperature: 0.2},
    instructions: [
      "Evaluate the input token details and produce a risk tolerance assessment. Risk tolerance can be low, medium, or high.",
      "Only return values of 'low', 'medium', or 'high'."
    ],
    description: "You are a blockchain researcher that analyzes a tokens metadata and creates a risk level for it.",
});
