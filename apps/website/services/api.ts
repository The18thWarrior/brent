'use client'
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const timeout = 300000;

export async function runFlowTokens (
  text: string,
) {
  const sendMessage = await axios({
    url: `/api/agent`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify({ text, type: 'runFlowTokens' }),
    timeout      
  });

  return sendMessage.data;
}

export async function runFlowWallet (
  text: string,
) {
  const sendMessage = await axios({
    url: `/api/agent`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify({ text, type: 'runFlowWallet' }),
    timeout      
  });

  return sendMessage.data;
}

export async function runWalletOutputGenerator (
  messages: ChatCompletionMessageParam[]
) {
  const sendMessage = await axios({
    url: `/api/agent`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify({ messages, type: 'runWalletOutputGenerator' }),
    timeout   
  });

  return sendMessage.data;
}

export async function runTokenOutputGenerator (
  messages: ChatCompletionMessageParam[]
) {
  const sendMessage = await axios({
    url: `/api/agent`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    data: JSON.stringify({ messages, type: 'runTokenOutputGenerator' }),
    timeout 
  });

  return sendMessage.data;
}
