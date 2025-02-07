import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";
import { runFlow, runFlowDirect, runFlowFormat, runOutputGenerator, runFlowWallet, runFlowTokens} from "@/services/package";
import { useAccount } from "wagmi";
import Snackbar from '@mui/material/Snackbar';
import { DNA } from 'react-loader-spinner'
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

const ETFBuilder: React.FC = () => {
  const {address} = useAccount();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft' as 'draft' | 'generating' | 'edit' );
  const [loadingText, setLoadingText] = useState("");
  const [response, setResponse] = useState([] as ChatCompletionMessageParam[]);

  const [generatedData, setGeneratedData] = useState("");
  const theme = useTheme();

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
    console.log('running token data')

    setLoadingText("Generating a token list for you...");
    const tokenData = await runFlowTokens(JSON.stringify(walletData.messages));
    console.log(tokenData);
    if (typeof tokenData === 'string') {
      setError(tokenData);
      setOpenSnackbar(true);
      setStatus('draft');
      setLoading(false);
      return;
    }
    //const result2 = await runFlowFormat(JSON.stringify(result.messages));
    //console.log(result2);
    //result.messages.shift();

    setLoadingText("Validating the token list...");
    console.log('running output generator');
    const result2 = await runOutputGenerator(tokenData.messages);
    console.log(result2);
    setGeneratedData(JSON.stringify(result2));
    setResponse(tokenData.messages);
    //setResponse([result.messages[result.messages.length - 1]]);
    setStatus('edit');   
      
    setLoading(false);
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  return (
    <Box width={'35vw'}>
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

        {status === 'edit' &&
          <OpaqueCard sx={{mt:2}}>
            <ResultsList source={JSON.parse(generatedData)}/>
          </OpaqueCard>
        }


        {status === 'draft' &&
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Button aria-label="refreh" onClick={executeAnalysis} variant={'contained'}>
              Start Analysis
            </Button>
          </Stack>
        }
        {status === 'generating' && 
          <Box >
            <Typography variant={'h5'} textAlign={'center'} sx={{pb:2}}>{loadingText}</Typography>
            {/* <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            /> */}
            <LoadingComponent />
          </Box>
        }
        {status === 'edit' && false && 
          <Box>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant={'h5'}>Investing Philosophy Summary:</Typography>
              <IconButton aria-label="refreh" onClick={() => {setStatus('draft');setSummary('');}}>
                <Refresh />
              </IconButton>
            </Stack>
            <Box>
              {response.map((message, index) => {
                return <MarkdownListComponent key={index} message={message} />;
              })}

              <Typography variant={'h5'}>Generated Data:</Typography>
              <Typography variant={'body1'}>{generatedData}</Typography>
            </Box>
          </Box>
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