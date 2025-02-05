
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import {ZeeWorkflowState} from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
//import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import {getERC20BalanceTool} from "../tools/evm";
import { modelConfig } from "../services/config";

export default new Agent({
    name: "fund-builder",
    model: modelConfig,
    description: "AI-driven investment advisor specializing in crypto mutual funds, providing risk tolerance assessments and token analysis with detailed insights into Web3 projects.",
    instructions: ['Another agent takes that output and checks if there is liquidity for each of the selected tokens, pruning the list further. The output is formatted in our index fund schema and that is returned to the user.'],
    tools: {
        "get-erc20-balance": getERC20BalanceTool,
    },
});
