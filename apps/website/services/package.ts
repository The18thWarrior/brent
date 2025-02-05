'use server'
import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import {createIndexFundFlow, createIndexFundDirectFlow} from "@brent/index-builder";
import "dotenv/config";

const apiKey = process.env.COVALENT_API_KEY as string;
export const runFlow = async (text: string) => {

  const _createIndexFundFlow = createIndexFundFlow(apiKey);
  const state = await StateFn.root(_createIndexFundFlow.description);
    state.messages.push(
        user(
          text
        )
    );
    try {
      const response = await ZeeWorkflow.run(_createIndexFundFlow, state);
      console.log('initial response generated', response.messages, response.status);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "There was an error processing your request.";
    }
}

export const runFlowDirect = async (text: string) => {

  const _createIndexFundDirectFlow = createIndexFundDirectFlow();
  const state = await StateFn.root(_createIndexFundDirectFlow.description);
    state.messages.push(
        user(
          text
        )
    );
    try {
      const response = await ZeeWorkflow.run(_createIndexFundDirectFlow, state);
      console.log('initial response generated', response.status);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "There was an error processing your request.";
    }
}

