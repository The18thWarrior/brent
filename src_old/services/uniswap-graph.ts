import 'dotenv/config';
import { request, gql } from 'graphql-request';

const endpoint = `${process.env.GRAPH_BASE_URL}/${process.env.GRAPH_API_KEY}/subgraphs/id/${process.env.GRAPH_SUBGRAPH_ID}`;
const poolsQuery = `{
  pools(where: {token0_ends_with_nocase: "1", or: {token1_contains_nocase: "2"}}) {
    id
    liquidity
    token0Price
    token1Price
  }
}`;
const tokensQuery = ``
const query = `{
  factories(first: 5) {
    id
    poolCount
    txCount
    totalVolumeUSD
  }
  bundles(first: 5) {
    id
    ethPriceUSD
  }
}`;

async function fetchData() {
  try {
    const data = await request(endpoint, query);
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//fetchData();
