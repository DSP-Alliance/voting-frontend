import {
    http,
    Address,
    Hash,
    TransactionReceipt,
    createPublicClient,
    createWalletClient,
    custom,
    stringify,
} from "viem";
import { filecoin } from "viem/chains";
import "viem/window";


export const walletClient = createWalletClient({
    chain: filecoin,
    transport: custom(window.ethereum!),
});
export const publicClient = createPublicClient({
    chain: filecoin,
    transport: http("https://api.node.glif.io/"),
});