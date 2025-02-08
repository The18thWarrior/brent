'use client'

import { markdownLookBack } from "@llm-ui/markdown";
import { useLLMOutput, useStreamExample } from "@llm-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownComponent from "./MarkdownBlock";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Paper, Stack, Typography } from "@mui/material";


// Customize this component with your own styling
const MarkdownListComponent = ({ message }: {message: ChatCompletionMessageParam}) => {
  //const { isStreamFinished, output } = useStreamExample(message.content ? message.content?.toString(): '');
  const { blockMatches } = useLLMOutput({
    llmOutput: message.content ? message.content?.toString(): '',
    fallbackBlock: {
      component: MarkdownComponent, // from Step 1
      lookBack: markdownLookBack(),
    },
    isStreamFinished: true,
  });
  return (
    <Stack spacing={0} direction="column" my={2} p={2} ml={message.role === 'user' ? 4 : 0} mr={message.role !== 'user' ? 4 : 0} component={Paper} textAlign={message.role === 'user' ? 'right' : 'left'} elevation={message.role === 'user' ? 4 : 0 }>
      {blockMatches.map((blockMatch, index) => {
        const Component = blockMatch.block.component;
        return <Component key={index} blockMatch={blockMatch} />;
      })}
      <Typography variant="subtitle2" textAlign={message.role === 'user' ? 'right' : 'left'} color={'textSecondary'}>{message.role}</Typography>
    </Stack>
  )
};

export default MarkdownListComponent;


                