import createIndexFund from './workflows/createIndexFund.ts';
import createIndexFundDirect from './workflows/createIndexFundDirect.ts';
import formatOutput from './workflows/formatOutput.ts';
import walletResearcher from './agents/walletResearcher.ts';
import tokenResearcher from './agents/tokenResearcher.ts';
import summaryEvaluator from './agents/summaryEvaluator.ts';
import outputGenerator from './agents/outputGenerator.ts';

export const createIndexFundFlow = createIndexFund;
export const createIndexFundDirectFlow = createIndexFundDirect;
export const formatOutputFlow = formatOutput;


export const walletResearcherAgent = walletResearcher;
export const tokenResearcherAgent = tokenResearcher;
export const summaryEvaluatorAgent = summaryEvaluator;
export const outputGeneratorAgent = outputGenerator;