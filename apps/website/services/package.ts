'use server'
import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import {createIndexFundFlow, createIndexFundDirectFlow, formatOutputFlow, outputGeneratorAgent} from "@brent/index-builder";
import "dotenv/config";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

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

export const runFlowFormat = async (text: string) => {
  const _formatOutputFlow = formatOutputFlow();
  const state = await StateFn.root(_formatOutputFlow.description);
    state.messages.push(
        user(
          text
        )
    );
    try {
      const response = await ZeeWorkflow.run(_formatOutputFlow, state);
      console.log('initial response generated', response.status);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "There was an error processing your request.";
    }
}

export const runOutputGenerator = async (messages: ChatCompletionMessageParam[]) => {
  try {
    const schema = { data : z.object({
          walletAddress: z.string().describe("The wallet address the analysis was done on."),
          tolerance: z.enum(['low', 'medium', 'high']).describe("The tolerance level of the user from the analysis of the output."),
          tokens: z.array(z.object({
            address: z.string().describe("The address of the token."),
            risk: z.enum(['low', 'medium', 'high']).describe("The risk level of the token."),
            category: z.enum(['stablecoin', 'utility', 'defi', 'nft', 'gaming', 'metaverse', 'oracle', 'dex', 'lending', 'other']).describe("The category of the token."),
          })).describe("The list of tokens that match the user's risk tolerance."),
      })
    };
    const response = await outputGeneratorAgent.generate(messages, schema);
    //const response = await ZeeWorkflow.run(outputGeneratorAgent, await StateFn.root(outputGeneratorAgent.description));
    if (response.type === 'tool_call') throw new Error('Tool call not supported');
    console.log('initial response generated', response.type);
    return response.value;
  } catch (error) {
    console.error("Error generating response:", error);
    return "There was an error processing your request.";
  }
}