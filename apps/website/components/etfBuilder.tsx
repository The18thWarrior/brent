import { useTheme } from "@mui/material";
import React, { useState } from "react";

const ETFBuilder: React.FC = () => {
  const [summary, setSummary] = useState("");
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Investing Philosophy Summary:", summary);
    // Add submit logic here
    setSummary("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Describe your investing philosophy"
        style={{
          width: "100%",
          minHeight: "150px",
          padding: "8px",
          paddingRight: "40px", // space for the submit button
          boxSizing: "border-box",
          borderRadius: "4px",
          resize: "vertical",
          color: theme.palette.mode === 'dark' ? 'white' : 'black',
          backgroundColor: theme.palette.mode === 'dark' ? 'dimgray' : 'lightgray'
        }}
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
  );
};

export default ETFBuilder;