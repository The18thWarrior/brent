
import { Agent, createTool, NFTBalancesTool, TokenBalancesTool, TransactionsTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import {ZeeWorkflowState} from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
//import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import { getTokenListTool } from "../tools/evm";
import { webSearchTool } from "../tools/search";
import { checkUniswapPoolTool } from "../tools/uniswap";
import { modelConfig } from "../services/config";

const tools = {
  tokensList: getTokenListTool,
  //webSearch: webSearchTool,
  liquidityValidator: checkUniswapPoolTool
};

export default new Agent({
    name: "token-researcher",
    model: modelConfig,
    instructions: [
      "Using the tokensList tool, build a list of tokens that match the user's risk tolerance.",
      "Using the liquidityValidator tool, validate that token list against the available liquidity for each token given a source token.",
      "Prune the list of tokens to provide a well-balanced mix of tokens. The list should contain no more than 15 tokens.",
      "Return the validated list of tokens to the user.",
    ],
    description: "You are an investment advisor that creates lists of tokens on the matic-mainnet chain that adheres to a specified investment philosophy and risk tolerance.",
    tools: tools,
});
