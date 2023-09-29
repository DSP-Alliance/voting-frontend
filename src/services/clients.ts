import { http, createPublicClient, createWalletClient, custom } from 'viem';
import { filecoin } from 'viem/chains';
import 'viem/window';

export const RPC_URL = 'https://api.node.glif.io/';

export const walletClient = window.ethereum
  ? createWalletClient({
      chain: filecoin,
      transport: custom(window.ethereum!),
    })
  : {};

export const publicClient = createPublicClient({
  batch: {
    multicall: true, 
  },
  chain: filecoin,
  transport: http(),
});
