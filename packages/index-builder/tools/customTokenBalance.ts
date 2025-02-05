import { BaseGoldRushTool, BaseGoldRushSchema } from "@covalenthq/ai-agent-sdk";
import { type Chain } from "@covalenthq/client-sdk";
import type { z } from "zod";

export const TokenBalancesSchema = BaseGoldRushSchema;
export type TokenBalancesParams = z.infer<typeof TokenBalancesSchema>;

export class TokenBalancesTool extends BaseGoldRushTool {
    constructor(apiKey?: string) {
        super(
            "token-balances",
            "Fetch token balances for a wallet address on a specific blockchain",
            TokenBalancesSchema,
            apiKey
        );
    }

    protected async fetchData(params: TokenBalancesParams): Promise<string> {
        try {
            const { chain, address } = params;
            const balances =
                await this.client.BalanceService.getTokenBalancesForWalletAddress(
                    chain as Chain,
                    address
                );

            if (balances.error) {
                throw new Error(balances.error_message);
            }
            const trimmedBalances = balances.data.items?.map((balance) => {
                return {
                    contract_address: balance.contract_address,
                    contract_name: balance.contract_name,
                    contract_ticker_symbol: balance.contract_ticker_symbol,
                    contract_decimals: balance.contract_decimals,
                    balance: balance.balance,
                    quote: balance.quote,
                    type: balance.type,
                    is_spam: balance.is_spam
                };
            });
            return `Token balances for ${address} on ${chain}: ${JSON.stringify({...balances.data, items:trimmedBalances}, this.bigIntReplacer)}`;
        } catch (error) {
            return `Error fetching token balances: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}