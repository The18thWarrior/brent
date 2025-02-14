
import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { user, assistant } from "@covalenthq/ai-agent-sdk/dist/core/base";
import {createIndexFundFlow} from "@brent/index-builder";
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

const apiKey = process.env.COVALENT_API_KEY as string;
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

    //const messages = [user(text)];
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

