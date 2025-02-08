'use client'

import { Box } from "@mui/material";
import MarkdownListComponent from "./MarkdownBlockList";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";


// Customize this component with your own styling
const ConversationHistory = ({ conversation }: {conversation: ChatCompletionMessageParam[]}) => {
  return (
    <Box>
      {conversation.map((message, index) => {
        return <MarkdownListComponent key={index} message={message} />;
      })}
    </Box>
  );
};

export default ConversationHistory;