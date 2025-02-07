import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";
import { runFlow, runFlowDirect, runFlowFormat, runOutputGenerator, runFlowWallet, runFlowTokens} from "@/services/package";
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

  const handleRefresh = () => {
    setStatus('draft');
    setSummary('');
  }

  const RefreshButton = () => {
    return (
      <IconButton aria-label="refreh" onClick={handleRefresh}>
        <Refresh />
      </IconButton>
    );
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

        {status === 'draft' &&
          <OpaqueCard sx={{mt:2}}>
            <ResultsList refresh={handleRefresh} source={{
              walletAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
              tolerance: 'medium',
              tokens: [
                {
                  address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
                  name: 'Uniswap',
                  description: 'Uniswap is a decentralized finance protocol that is used to exchange cryptocurrencies. It is also the name of the company that initially built the Uniswap protocol.',
                  logo: 'https://assets.coingecko.com/coins/images/125/125.png',
                  decimals: 18,
                  risk: "medium",
                  category: "dex"
                },
                {
                  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                  name: 'WETH',
                  description: 'Wrapped Ether (WETH) is a token that represents Ether and is compliant with the ERC20 standard.',
                  logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                  decimals: 18,
                  risk: "low",
                  category: "infrastructure"
                },
                {
                  address: '0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3',
                  name: 'BNB',
                  description: 'BNB is the native cryptocurrency of the Binance Smart Chain.',
                  logo: 'https://assets.coingecko.com/coins/images/279/small/bnb.png',
                  decimals: 18,
                  risk: "low",
                  category: "infrastructure"
                },
                {
                  address: '0xd93f7E271cB87c23AaA73edC008A79646d1F9912',
                  name: 'WSOL',
                  description: 'Solana is a high-performance blockchain that can facilitate up to 65,000 transactions per second.',
                  logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                  decimals: 18,
                  risk: "medium",
                  category: "infrastructure"
                },
                {
                  address: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
                  name: 'LINK',
                  description: 'Chainlink (LINK) is a decentralized oracle network that connects smart contracts with real-world data.',
                  logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                  decimals: 18,
                  risk: "medium",
                  category: "infrastructure"
                },
                {
                  address: '0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec',
                  name: 'SHIB',
                  description: 'SHIB is a cryptocurrency token created as an experiment in decentralized community building.',
                  logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                  decimals: 18,
                  risk: "high",
                  category: "token"
                }
              ]
            }}/>
          </OpaqueCard>
        }


        {status === 'edit' &&
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
              <RefreshButton />
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