'use client'
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function runFlowTokens (
  text: string,
) {
  const sendMessage = await axios({
    url: `/api/agent/runFlowTokens`,
    method: "POST",
    data: JSON.stringify({ text }),
    timeout: 120000      
  });

  return sendMessage.data;
}

export async function runFlowWallet (
  text: string,
) {
  const sendMessage = await axios({
    url: `/api/agent/runFlowWallet`,
    method: "POST",
    data: JSON.stringify({ text }),
    timeout: 120000      
  });

  return sendMessage.data;
}

export async function runWalletOutputGenerator (
  messages: ChatCompletionMessageParam[]
) {
  const sendMessage = await axios({
    url: `/api/agent/runWalletOutputGenerator`,
    method: "POST",
    data: JSON.stringify({ messages }),
    timeout: 120000      
  });

  return sendMessage.data;
}

export async function runTokenOutputGenerator (
  messages: ChatCompletionMessageParam[]
) {
  const sendMessage = await axios({
    url: `/api/agent/runTokenOutputGenerator`,
    method: "POST",
    data: JSON.stringify({ messages }),
    timeout: 120000      
  });

  return sendMessage.data;
}
