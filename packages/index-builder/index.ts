import createIndexFund from './workflows/createIndexFund.ts';
import createIndexFundDirect from './workflows/createIndexFundDirect.ts';
import walletResearcher from './agents/walletResearcher.ts';
import tokenResearcher from './agents/tokenResearcher.ts';
import summaryEvaluator from './agents/summaryEvaluator.ts';

export const createIndexFundFlow = createIndexFund;
export const createIndexFundDirectFlow = createIndexFundDirect;
export const walletResearcherAgent = walletResearcher;
export const tokenResearcherAgent = tokenResearcher;
export const summaryEvaluatorAgent = summaryEvaluator;