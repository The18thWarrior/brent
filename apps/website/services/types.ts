export type Token = {
    address: string;
    risk: string;
    category: string;
    logo?:string;
    name?:string;
    decimals: number;
}

export type SourceList = {
    walletAddress: string;
    tolerance: string;
    tokens: Token[];
}
