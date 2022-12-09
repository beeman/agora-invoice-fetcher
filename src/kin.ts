import {
  Client,
  Environment,
  TransactionData,
  TransactionType,
} from "@kinecosystem/kin-sdk-v2";
import { decode, encode } from "bs58";

// This method converts values of an Agora transaction + invoice into plain json
function formatAgoraTransaction(tx: TransactionData) {
  return {
    txId: encode(tx.txId),
    payments: tx.payments.map(
      ({ sender, destination, quarks, type, invoice }) => ({
        sender: sender.toBase58(),
        destination: destination.toBase58(),
        quarks,
        type: TransactionType[type],
        invoice: {
          items: invoice?.Items?.map(({ title, description, amount, sku }) => ({
            title,
            amount: amount.toString(),
            sku: sku ? encode(sku) : undefined,
          })),
        },
      })
    ),
  };
}

export class Kin {
  readonly client: Client;

  constructor(env: Environment, appIndex?: number) {
    this.client = new Client(env, { appIndex });
  }

  async getTransactionDetails(signature: string) {
    // Get the transaction from Agora
    const tx = await this.client.getTransaction(decode(signature));

    if (tx) {
      // Format the transaction
      return formatAgoraTransaction(tx);
    } else {
      console.log(`No transaction found with id ${signature}`);
      return null;
    }
  }
}
