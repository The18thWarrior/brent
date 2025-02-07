export type Token = {
    address: string;
    risk: string;
    category: string;
    logo?:string;
    name?:string;
    decimals: number;
    description?: string;
    fee?: number;
}

export type SourceList = {
    walletAddress: string;
    tolerance: string;
    tokens: Token[];
}


export interface PoolData {
  id: string;
  sourceToken: Token2;
  targetToken: Token2;
  feeTier: number;
  liquidity: string;
}

export interface Token2 {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logo?: string;
}
