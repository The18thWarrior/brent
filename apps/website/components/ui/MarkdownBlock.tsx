import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


// Customize this component with your own styling
const MarkdownComponent = ({ blockMatch }: {blockMatch: any}) => {
  const markdown = blockMatch.output;
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
};

export default MarkdownComponent;