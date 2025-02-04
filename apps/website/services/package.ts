'use server'
import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import {createIndexFundFlow} from "@brent/index-builder";
import "dotenv/config";

export const runFlow = async (text: string) => {
  const state = await StateFn.root(createIndexFundFlow.description);
    state.messages.push(
        user(
          text
        )
    );
    try {
      const response = await ZeeWorkflow.run(createIndexFundFlow, state);
      console.log('initial response generated', response.messages, response.status);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "There was an error processing your request.";
    }
}

