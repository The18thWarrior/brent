
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import {ZeeWorkflowState} from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
//import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import {formatFinalOutputTool} from "../tools/formatter";
import { modelConfig } from "../services/config";

export default new Agent({
    name: "message-evaluator",
    model: modelConfig,
    description: "You are an agent that evaluates a series of agent chat responses to summarize.",
    instructions: [
      "Using the provided tools, evaluate the chat responses and use the embedded data to generate a structured output."
    ],
    tools: {
        "format-output": formatFinalOutputTool,
    },
});

