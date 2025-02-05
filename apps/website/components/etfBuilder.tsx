import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";
import { runFlowDirect } from "@/services/package";
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
    setLoadingText("Submitting your investing philosophy...");
    const result = await runFlowDirect(JSON.stringify({summary, walletAddress: address}));
    console.log(result);
    if (typeof result === 'string') {
      setError(result);
      setOpenSnackbar(true);
      setStatus('draft');
    } else {
      setResponse(result.messages);
      setStatus('edit');    
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
            <h3>Investing Philosophy Summary:</h3>
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