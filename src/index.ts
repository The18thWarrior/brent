import { Agent, ZeeWorkflow, createTool } from "@covalenthq/ai-agent-sdk";
import z, { type ZodType } from "zod";
import "dotenv/config";

const tool = createTool({
  id: "get-company-report",
  description: "This tool is used to get the current state of the company",
  schema: z.object({}),
  execute: async (params) => {
      return "The current state of the company is good";
  },
});

const agent1 = new Agent({
    name: "Agent1",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "A helpful AI assistant that can engage in conversation.",
    tools: {
      'Agent1' : tool,
    }
});


const zee = new ZeeWorkflow({
    description: "A workflow of agents that do stuff together",
    output: "Just bunch of stuff",
    agents: { agent1 },
});

(async function main() {
    const result = await agent1.run({
      agent: "",
      messages: [],
      status: "idle",
      children: []
    });
    console.log(result);
})();
