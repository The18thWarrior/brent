import { ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import fundAgent from "../agents/fundBuilder";
import tokenResearcher from "../agents/tokenResearcher";

export default new ZeeWorkflow({
    description: "A workflow that helps users understand their ERC20 token balances.",
    output: "The goal of this workflow is to provide users with the balance of an ERC20 token.",
    agents: { tokenResearcher, fundAgent },
  });