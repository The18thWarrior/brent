import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import StyledTextArea from "./ui/StyledTextArea";



const ETFBuilder: React.FC = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Investing Philosophy Summary:", summary);
    // Add submit logic here
    //setSummary(summary);
    setLoading(true);
    setLoadingText("Submitting your investing philosophy...");
  };

  return (
    <Box width={'35vw'}>
        {!loading && 
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
        {loading && 
          <Box textAlign="center">
            <h3>{loadingText}</h3>
          </Box>
        }
    </Box>
    
  );
};

export default ETFBuilder;