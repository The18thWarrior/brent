import {config} from 'dotenv';
import {writeFileSync, readFileSync} from "fs";
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
const enrichData = async (chainName: string) => {

  const fileContent = readFileSync('./files/base.json', 'utf8');
  const coingecko: CoinData[] = JSON.parse(fileContent);
  console.log('executing run');
  const _filteredData = coingecko.filter((item) => item.platforms && (item.platforms as unknown as Record<string, string>)[chainName] && (item.platforms as unknown as Record<string, string>)[chainName].length > 0);

  let alreadyProcessed = 0;
  let notProcessed = 0;
  let errors = 0;
  let processed = 0;
  const enrichedData = await Promise.all(_filteredData.map(async (item) => {

    if (item.api_name) {
      alreadyProcessed++;
      printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed}`);
      return {...item}
    }
    const myHeaders = new Headers({
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY as string,
    });
    try {
      const result = await fetch(`https://api.coingecko.com/api/v3/coins/${item.id}`, {
        method: 'GET',
        headers: myHeaders,
      });
      if (!result.ok) {
        notProcessed++;
        printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed} | Errors: ${errors}`);
        return {
          ...item
        }
      }
      const data = await result.json();
      processed++;
      printProgress(`Already processed: ${alreadyProcessed} | Not processed: ${notProcessed} | Processed: ${processed} | Errors: ${errors}`);
      return {
        ...item,
        api_name: data.name,
        logo: data.image.small,
        symbol: data.symbol,
        address: data.platforms[chainName],
        market_cap: data.market_data?.market_cap?.usd,
        rank: data.market_data.market_cap_rank,
        description: data.description.en,
        decimals: data.decimals || 18,
        risk: "medium",
        tags: data.categories.join(',')
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

  //console.log(enrichedData);
  writeFile(destination + chainName + '.json', JSON.stringify(enrichedData, null, 2));
  
  return enrichedData;
}


setInterval(async () => {
  await enrichData('base');
}, 60000);

// enrichData('base');
