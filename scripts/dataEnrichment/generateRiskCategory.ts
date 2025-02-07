import {config} from 'dotenv';
import {writeFileSync, readFileSync} from "fs";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { ChatCompletionMessageParam } from "openai/resources";
import { tokenCategorizerAgent } from "@brent/index-builder";
import { z } from "zod";
import { user } from '@covalenthq/ai-agent-sdk/dist/core/base';
config();

const destination = './files/'

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  address: string;
  market_cap: number;
  rank: number;
  description: string;
  decimals: number;
  risk: string;
  tags: string;
  api_name: string;
  logo: string;
  platforms: Record<string, string>;
}


const printProgress = (progress: string) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
};
const writeFile = (location: string, data: string) => {
  writeFileSync(location, data);
};

const runOutputGenerator = async (messages: string) => {
  try {
    const schema = { data : z.object({
          risk: z.enum(['low', 'medium', 'high']).describe("The risk level of the token.")
      })
    };

    const state2 = {
      role: 'user',
      content: messages
    } as ChatCompletionMessageParam;
    const response = await tokenCategorizerAgent.generate([state2], schema);
    //const response = await ZeeWorkflow.run(outputGeneratorAgent, await StateFn.root(outputGeneratorAgent.description));
    if (response.type === 'tool_call') throw new Error('Tool call not supported');
    
    return response.value;
  } catch (error) {
    console.error("Error generating response:", error);
    return "There was an error processing your request.";
  }
}

const enrichData = async (chainName: string) => {

  const fileContent = readFileSync(`./files/${chainName}.json`, 'utf8');
  const coingecko: CoinData[] = JSON.parse(fileContent);
  console.log('executing run');

  let alreadyProcessed = 0;
  let notProcessed = 0;
  let errors = 0;
  let processed = 0;
  const enrichedData = await Promise.all(coingecko.map(async (item) => {

    // if (item.risk.length > 0) {
    //   alreadyProcessed++;
    //   printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed}`);
    //   return {...item}
    // }

    

    try {
      const result = await runOutputGenerator(JSON.stringify(item));
      
      if (result === "There was an error processing your request.") {
        notProcessed++;
        printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed} | Errors: ${errors}`);
        return {
          ...item
        }
      }
      processed++;
      //if (result.risk !== item.risk) console.log('Risk changed:', item.id, item.risk, result.risk);
      printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed} | Errors: ${errors}`);
      return {
        ...item,
        risk: result.risk,
      };
    } catch (err) {
      errors++;
      printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed} | Errors: ${errors}`);
      //console.error('Error fetching data for:', item.id, err);
      return {
        ...item
      }
    }
  }));

  const totals = enrichedData.reduce((acc, item) => {
    if (item.risk === 'low') acc.low++;
    if (item.risk === 'medium') acc.medium++;
    if (item.risk === 'high') acc.high++;
    return acc;
  }, {low: 0, medium: 0, high: 0});
  console.log(totals);
  writeFile(destination + chainName + '.json', JSON.stringify(enrichedData, null, 2));
  
  return enrichedData;
}


// setInterval(async () => {
//   await enrichData('base');
// }, 60000);

enrichData('base');
