
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import {ZeeWorkflowState} from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import {getERC20BalanceTool} from "./tools/evm";

const messageAgent = new Agent({
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

const zee = new ZeeWorkflow({
  description: "A workflow that helps users understand their ERC20 token balances.",
  output: "The goal of this workflow is to provide users with the balance of an ERC20 token.",
  agents: { messageAgent },
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) {
        return;
    }
    const errorCatcher = (error: any) => {
      console.error("Error generating response:", error);
      bot.sendMessage(
          chatId,
          "There was an error processing your request."
      );
    };

    const messages = [user(text)];
    const state = {
        agent: "Agent1",
        messages: messages,
        status: "idle" as "idle" | "running" | "paused" | "failed" | "finished",
        children: []
    } as ZeeWorkflowState;
    try {
      const response = await ZeeWorkflow.run(zee, state);
      console.log('initial response generated', response.messages, response.status);
      // if (response.type === "tool_call") {
      //   console.log('tool call');
      //   const toolCall = response.value[0];
      //   const args = JSON.parse(toolCall.function.arguments);

      //   const balance = await getERC20BalanceTool.execute(args);
      //   console.log('balance', balance);
      //   const newMessages = [...messages, response, assistant(balance)];
      //   const combinedResponse = await messageAgent.generate(newMessages, { response: z.object({ body: z.string() }) })
      //   if (combinedResponse.type === "tool_call") {
      //     console.log('second tool call :/');
      //     bot.sendMessage(chatId, 'Sorry, I didn\'t understand that.');
      //     return;
      //   }
      //   console.log('combined response', JSON.stringify(combinedResponse));
      //   const reply = combinedResponse.value.body || "Sorry, I didn't understand that.";
      //   bot.sendMessage(chatId, reply);
      // } else {
      //   console.log('normal response');
      //   const reply = response.value.body || "Sorry, I didn't understand that.";
      //   bot.sendMessage(chatId, reply);
      // }
      
      const reply = response.messages || "Sorry, I didn't understand that.";
      bot.sendMessage(chatId, reply[reply.length - 1].content?.toString() || "Sorry, I didn't understand that.");
    } catch (error) {
      errorCatcher(error);
    }    
});

