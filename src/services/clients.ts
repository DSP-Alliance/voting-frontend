import { http, createPublicClient, createWalletClient, custom } from 'viem';
import { filecoin } from 'viem/chains';
import 'viem/window';

export const walletClient = window.ethereum
  ? createWalletClient({
      chain: filecoin,
      transport: custom(window.ethereum!),
    })
  : {};

export const publicClient = createPublicClient({
  chain: filecoin,
  transport: http('https://api.node.glif.io/'),
});
