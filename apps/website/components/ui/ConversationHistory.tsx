'use client'

import { Box, Typography } from "@mui/material";
import MarkdownListComponent from "./MarkdownBlockList";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import OpaqueCard from "./OpaqueCard";


// Customize this component with your own styling
const ConversationHistory = ({ conversation }: {conversation: ChatCompletionMessageParam[]}) => {
  return (
    <OpaqueCard sx={{p:4}}>
      {conversation.length > 0 ? (
        conversation.map((message, index) => {
          return <MarkdownListComponent key={index} message={message} />;
        })
      ) : (
        <Typography variant="body1" textAlign="center">No conversation history available.</Typography>
      )}
    </OpaqueCard>
  );
};

export default ConversationHistory;