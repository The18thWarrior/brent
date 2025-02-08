import createIndexFund from './workflows/createIndexFund';
import createIndexFundDirect from './workflows/createIndexFundDirect';
import formatOutput from './workflows/formatOutput';
import tokenResearcherFlo from './workflows/tokenResearcherFlow';
import walletResearcherFlo from './workflows/walletResearcherFlow';

import walletResearcher from './agents/walletResearcher';
import tokenResearcher from './agents/tokenResearcher';
import summaryEvaluator from './agents/summaryEvaluator';
import outputGenerator from './agents/outputGenerator';
import tokenCategorizer from './agents/tokenCategorizer';

import polygonTokens from './data/polygon.json';
import baseTokens from './data/base.json';

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

export const polygonCoins = polygonTokens;
export const baseCoins = baseTokens;