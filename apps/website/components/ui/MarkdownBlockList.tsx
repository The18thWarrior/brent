import { markdownLookBack } from "@llm-ui/markdown";
import { useLLMOutput, useStreamExample } from "@llm-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownComponent from "./MarkdownBlock";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


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
    <div>
      {blockMatches.map((blockMatch, index) => {
        const Component = blockMatch.block.component;
        return <Component key={index} blockMatch={blockMatch} />;
      })}
    </div>
  )
};

export default MarkdownListComponent;


                