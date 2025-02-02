
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import {ZeeWorkflowState} from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import {getERC20BalanceTool} from "../tools/evm";

const agent = new Agent({
    name: "Agent1",
    model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
    },
    description: "AI-driven investment advisor specializing in crypto mutual funds, providing risk tolerance assessments and token analysis with detailed insights into Web3 projects.",
    tools: {
        "get-erc20-balance": getERC20BalanceTool,
    },
});

export default new ZeeWorkflow({
  description: "A workflow that helps users understand their ERC20 token balances.",
  output: "The goal of this workflow is to provide users with the balance of an ERC20 token.",
  agents: { agent },
});

