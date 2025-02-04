import createIndexFund from './workflows/createIndexFund.ts';
import walletResearcher from './agents/walletResearcher.ts';
import tokenResearcher from './agents/tokenResearcher.ts';

export const createIndexFundFlow = createIndexFund;
export const walletResearcherAgent = walletResearcher;
export const tokenResearcherAgent = tokenResearcher;
