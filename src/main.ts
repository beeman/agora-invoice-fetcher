import { Solana } from "@kin-kinetic/solana";
import { Environment } from "@kinecosystem/kin-sdk-v2";
import { Kin } from "./kin";

export async function main(): Promise<number> {
  // We set up the Kin client to fetch transactions and invoices Agora
  const kin = new Kin(Environment.Prod);

  // We set up the Solana client to fetch the latest transactions from the target wallet
  const solana = new Solana("mainnet-beta");

  // Replace this with another wallet to get their transaction history
  const TARGET_WALLET = "5WuYxq75GcEv7YUwWrUR7HayZgqgDyjsrVNz5LJuEG1d";

  // In this example we use the Solana connecting directly to get the latest transactions from the target wallet
  const signatures: string[] = await solana
    .getTokenAccountsHistory([TARGET_WALLET])
    .then((res) => {
      // FIXME: there might be multiple token accounts here!
      // In this example, we just use the first one
      return res[0].history.map((tx: any) => {
        return tx.signature;
      });
    });

  // Look over the transactions and fetch the Agora data
  // NOTE: we slice 10 because we are just interested in a few transactions
  for (const signature of signatures.slice(0, 10)) {
    console.log(`Getting transaction details for ${signature}`);
    // Get the Agora transaction details for this signature
    const formatted = await kin.getTransactionDetails(signature);
    // Show result or error
    if (formatted) {
      console.log(JSON.stringify(formatted, null, 2));
    } else {
      console.error(`No transaction found for signature ${signature}`);
    }
  }

  console.log("✅ Done!");
  return 0;
}
