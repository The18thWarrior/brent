import { BaseGoldRushTool, BaseGoldRushSchema } from "@covalenthq/ai-agent-sdk";
import { type Chain } from "@covalenthq/client-sdk";
import { z } from "zod";

export const TransactionsSchema = BaseGoldRushSchema.extend({
    timeframe: z.enum(["1h", "24h", "7d", "30d"]),
});

export type TransactionsParams = z.infer<typeof TransactionsSchema>;

export class TransactionsTool extends BaseGoldRushTool {
    constructor(apiKey?: string) {
        super(
            "transactions",
            "Fetch transactions for a wallet address on a specific blockchain",
            TransactionsSchema,
            apiKey
        );
    }

    protected async fetchData(params: TransactionsParams): Promise<string> {
        try {
            const { chain, address, timeframe = "24h" } = params;
            const txs =
                await this.client.TransactionService.getAllTransactionsForAddressByPage(
                    chain as Chain,
                    address,
                    {
                        quoteCurrency: "USD",
                        noLogs: true,
                        withSafe: true,
                    }
                );

            if (txs.error) {
                throw new Error(txs.error_message);
            }
            const trimmedItems = txs.data.items?.map((tx) => {
              return {
                  block_height: tx.block_height,
                  tx_hash: tx.tx_hash,
                  tx_offset: tx.tx_offset,
                  successful: tx.successful,
                  from_address: tx.from_address,
                  to_address: tx.to_address,
                  value: tx.value,
                  gas_price: tx.gas_price
              };
          });
            return `Transactions for ${address} on ${chain} in last ${timeframe}: ${JSON.stringify({...txs.data, items: trimmedItems}, this.bigIntReplacer)}`;
        } catch (error) {
            return `Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}