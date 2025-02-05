import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";
import { runFlow, runFlowDirect, runFlowFormat } from "@/services/package";
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

const ETFBuilder: React.FC = () => {
  const {address} = useAccount();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft' as 'draft' | 'generating' | 'edit' );
  const [loadingText, setLoadingText] = useState("");
  const [response, setResponse] = useState([] as ChatCompletionMessageParam[]);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Investing Philosophy Summary:", summary);
    // Add submit logic here
    //setSummary(summary);

    setLoading(true);
    setStatus('generating');
    setLoadingText("Evaluating your investing philosophy...");
    const result = await runFlowDirect(JSON.stringify({summary, walletAddress: address}));
    console.log(result);
    if (typeof result === 'string') {
      setError(result);
      setOpenSnackbar(true);
      setStatus('draft');
    } else {
      const result2 = await runFlowFormat(JSON.stringify(result.messages));
      console.log(result2);
      if (typeof result2 === 'string') {
        setError(result2);
        setOpenSnackbar(true);
        setStatus('draft');
      } else {
        result2.messages.map((message) => {if (typeof message.content === 'string') {try{console.log(JSON.parse(message.content))}catch(err){console.log(message.content)}}else{console.log(message.content)}});
        const first = result2.messages.shift();
        setResponse(result2.messages);
        //setResponse([result.messages[result.messages.length - 1]]);
        setStatus('edit');   
      } 
    }
    setLoading(false);
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  return (
    <Box width={'35vw'}>
        {status === 'draft' && 
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
        {status === 'generating' && 
          <Box textAlign="center">
            <h3>{loadingText}</h3>
          </Box>
        }
        {status === 'edit' &&
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