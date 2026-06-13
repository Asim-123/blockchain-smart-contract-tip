export const TIP_JAR_ABI = [
  {
    type: "function",
    name: "tip",
    inputs: [{ name: "message", type: "string" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "NewTip",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "message", type: "string", indexed: false },
    ],
  },
] as const;

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || "") as `0x${string}`;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
