'use client'

import { Box, Button, IconButton, Stack, Typography, useTheme, Tab } from "@mui/material";
import {TabContext, TabList, TabPanel} from '@mui/lab';
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";
import { runFlow, runFlowDirect, runFlowFormat, runFlowWallet, runFlowTokens, runWalletOutputGenerator, runTokenOutputGenerator} from "@/services/package";
import { useAccount } from "wagmi";
import Snackbar from '@mui/material/Snackbar';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
  codeBlockLookBack,
  findCompleteCodeBlock,
  findPartialCodeBlock,
} from "@llm-ui/code";
import { markdownLookBack } from "@llm-ui/markdown";
import { useLLMOutput, useStreamExample } from "@llm-ui/react";
import MarkdownComponent from "./ui/MarkdownBlock";
import MarkdownListComponent from "./ui/MarkdownBlockList";
import RefreshIcon from '@mui/icons-material/Refresh';
import Refresh from "@mui/icons-material/Refresh";
import LoadingComponent from "./loadingComponent";
import ResultsList from "./resultsList";
import { SourceList } from "@/services/types";
import OpaqueCard from "./ui/OpaqueCard";
import ConversationHistory from "./ui/ConversationHistory";

const ETFBuilder: React.FC = () => {
  const [tabValue, setTabValue] = React.useState('loading' as 'loading' | 'results' | 'walletHistory' | 'tokenHistory');
  const {address} = useAccount();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft' as 'draft' | 'generating' | 'edit' );
  const [loadingText, setLoadingText] = useState("");
  const [walletConversationResponse, setWalletConversationResponse] = useState([] as ChatCompletionMessageParam[]);
  const [tokenConversationResponse, setTokenConversationResponse] = useState([] as ChatCompletionMessageParam[]);

  const [generatedData, setGeneratedData] = useState("");
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue as 'loading' | 'results' | 'walletHistory' | 'tokenHistory');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Investing Philosophy Summary:", summary);
    // Add submit logic here
    //setSummary(summary);

    executeAnalysis();
  };
  
  const executeAnalysis = async () => {
    setLoading(true);
    setStatus('generating');
    setLoadingText("Evaluating your investing philosophy...");
    //const result = await runFlowDirect(JSON.stringify({summary, walletAddress: address}));
    const data = `Use the wallet address '${address}' to evaluate the investing philosophy of the wallet and give it a risk tier on chain 'matic-mainnet'. Persist the wallet address and chain in the state.`;
    console.log('running wallet data');
    const walletData = await runFlowWallet(data);
    console.log(walletData);
    if (typeof walletData === 'string') {
      setError(walletData);
      setOpenSnackbar(true);
      setStatus('draft');
      setLoading(false);
      return;
    }
    setWalletConversationResponse(walletData.messages);
    console.log('running token data')

    const walletSummary = await runWalletOutputGenerator(walletData.messages);
    console.log('Wallet Summary:', walletSummary);
    if (typeof walletSummary === 'string') {
      setError(walletSummary);
      setOpenSnackbar(true);
      setStatus('draft');
      setLoading(false);
      return;
    }
    setLoadingText("Generating a token list for you...");
    const tokenData = await runFlowTokens(JSON.stringify(walletSummary));
    console.log(tokenData);
    if (typeof tokenData === 'string') {
      setError(tokenData);
      setOpenSnackbar(true);
      setStatus('draft');
      setLoading(false);
      return;
    }
    setTokenConversationResponse(tokenData.messages);

    setLoadingText("Validating the token list...");
    console.log('running output generator');
    const generatedData = await runTokenOutputGenerator(tokenData.messages);
    console.log('generated data',generatedData);

    if (typeof generatedData === 'string') {
      setError(generatedData);
      setOpenSnackbar(true);
      setStatus('draft');
      setLoading(false);
      return;
    }

    setGeneratedData(JSON.stringify(generatedData));
    setTabValue('results');
    
    //setResponse([result.messages[result.messages.length - 1]]);
    setStatus('edit');   
      
    setLoading(false);
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  const handleRefresh = () => {
    setStatus('draft');
    setSummary('');
    setWalletConversationResponse([]);
    setTokenConversationResponse([]);
    setGeneratedData('');
    setTabValue('loading');
  }

  const RefreshButton = () => {
    return (
      <IconButton aria-label="refreh" onClick={handleRefresh}>
        <Refresh />
      </IconButton>
    );
  }

  return (
    <Box width={'55vw'}>
        {status === 'draft' && false &&
          <form
            onSubmit={handleSubmit}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <StyledTextArea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe your investing philosophy"
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M2 21l21-9L2 3v7l15 2-15 2v7z"
                  fill={theme.palette.mode === 'dark' ? 'white' : 'black'}
                />
              </svg>
            </button>
          </form>
        } 

        {status === 'draft' &&
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Button aria-label="refreh" onClick={executeAnalysis} variant={'contained'}>
              Start Analysis
            </Button>
          </Stack>
        }
        {status !== 'draft' && 
          <OpaqueCard sx={{mt:2}} >
             <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  {generatedData.length === 0 && <Tab label="Loading" value="loading" />}
                  {generatedData.length > 0 && <Tab label="Results" value="results" />}
                  <Tab label="Wallet Agent" value="walletHistory" />
                  <Tab label="Token Agent" value="tokenHistory" />
                </TabList>
              </Box>
              {generatedData.length === 0 && 
                <TabPanel value="loading">
                  <Box>
                    <Typography variant={'h6'} textAlign={'center'} sx={{pb:2}}>{loadingText}</Typography>
                    <LoadingComponent />
                  </Box>
                </TabPanel>
              }
              <TabPanel value="walletHistory"><OpaqueCard sx={{p:2, border: '1px solid grey'}} ><ConversationHistory conversation={walletConversationResponse} /></OpaqueCard></TabPanel>
              <TabPanel value="tokenHistory"><OpaqueCard sx={{p:2, border: '1px solid grey'}} ><ConversationHistory conversation={tokenConversationResponse} /></OpaqueCard></TabPanel>
              <TabPanel value="results">
                <Box>
                  {generatedData.length > 0 && <ResultsList refresh={handleRefresh} source={JSON.parse(generatedData) as SourceList}/>}
                </Box>
              </TabPanel>
            </TabContext>
            
          </OpaqueCard>
        }

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Error"
          action={error}
        />
    </Box>
    
  );
};

export default ETFBuilder;