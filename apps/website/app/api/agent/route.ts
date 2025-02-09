import { runFlowTokens, runFlowWallet, runTokenOutputGenerator, runWalletOutputGenerator } from "@/services/package";

export async function POST(
  req: Request
) {
  const body = await req.json()
  if (!body.type) {
    return new Response('Invalid route or message type.', {
      status: 401,
    });    
  } else if (body.type === 'runFlowTokens') {
    const result = await runFlowTokens(body.text);
    return Response.json(result)
  } else if (body.type === 'runFlowWallet') {
    const result = await runFlowWallet(body.text);
    return Response.json(result)
  } else if (body.type === 'runWalletOutputGenerator') {
    const result = await runWalletOutputGenerator(body.messages);
    return Response.json(result)
  } else if (body.type === 'runTokenOutputGenerator') {
    const result = await runTokenOutputGenerator(body.messages);
    return Response.json(result)
  } else {
    return new Response('Invalid route or message type.', {
      status: 401,
    });
  }
  
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 300,
}