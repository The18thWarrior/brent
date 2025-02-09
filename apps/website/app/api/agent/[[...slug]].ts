// Make sure to add OPENAI_API_KEY as a secret

import {
  OpenAI,
} from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { runFlowTokens, runFlowWallet, runTokenOutputGenerator, runWalletOutputGenerator } from "@/services/package";


async function chatHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'GET method is not implemented yet.' });
  } else if (req.method === 'POST') {
    await handlePost(req, res);
  } else if (req.method === 'PATCH') {
    res.status(200).json({ message: 'PATCH method is not implemented yet.' });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const path = req.query;
  if (!path.slug) {
    res.status(404).json({ error: 'Invalid route or message type.' });
  } else if (path.slug[0] === 'runFlowTokens') {
    const result = await runFlowTokens(req.body.text);
    res.status(200).json(result);
  } else if (path.slug[0] === 'runFlowWallet') {
    const result = await runFlowWallet(req.body.text);
    res.status(200).json(result);
  } else if (path.slug[0] === 'runWalletOutputGenerator') {
    const result = await runWalletOutputGenerator(req.body.messages);
    res.status(200).json(result);
  } else if (path.slug[0] === 'runTokenOutputGenerator') {
    const result = await runTokenOutputGenerator(req.body.messages);
    res.status(200).json(result);
  } else {
    res.status(404).json({ error: 'Invalid route or message type.' });
  }
  
}

export default chatHandler;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 120,
}