import createIndexFund from './workflows/createIndexFund.ts';
import createIndexFundDirect from './workflows/createIndexFundDirect.ts';
import formatOutput from './workflows/formatOutput.ts';
import tokenResearcherFlo from './workflows/tokenResearcherFlow.ts';
import walletResearcherFlo from './workflows/walletResearcherFlow.ts';

import walletResearcher from './agents/walletResearcher.ts';
import tokenResearcher from './agents/tokenResearcher.ts';
import summaryEvaluator from './agents/summaryEvaluator.ts';
import outputGenerator from './agents/outputGenerator.ts';
import tokenCategorizer from './agents/tokenCategorizer.ts';

export const createIndexFundFlow = createIndexFund;
export const createIndexFundDirectFlow = createIndexFundDirect;
export const formatOutputFlow = formatOutput;
export const tokenResearcherFlow = tokenResearcherFlo;
export const walletResearcherFlow = walletResearcherFlo;

export const tokenCategorizerAgent = tokenCategorizer;
export const walletResearcherAgent = walletResearcher;
export const tokenResearcherAgent = tokenResearcher;
export const summaryEvaluatorAgent = summaryEvaluator;
export const outputGeneratorAgent = outputGenerator;