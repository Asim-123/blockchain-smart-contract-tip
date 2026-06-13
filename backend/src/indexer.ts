import { createPublicClient, http, parseAbiItem, defineChain, type Log, type Chain } from "viem";
import { hardhat, sepolia } from "viem/chains";
import {
  getLastProcessedBlock,
  setLastProcessedBlock,
  insertTip,
  markTipsConfirmed,
} from "./db";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CHAIN_ID = parseInt(process.env.CHAIN_ID || "31337", 10);
const CONTRACT_ADDRESS = (process.env.CONTRACT_ADDRESS || "") as `0x${string}`;
const CONFIRMATIONS = parseInt(process.env.CONFIRMATIONS || "1", 10);
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || "5000", 10);
const DEPLOYMENT_BLOCK = parseInt(process.env.DEPLOYMENT_BLOCK || "0", 10);

const newTipEvent = parseAbiItem(
  "event NewTip(address indexed from, uint256 amount, string message)"
);

function getChain(): Chain {
  if (CHAIN_ID === sepolia.id) return sepolia;
  if (CHAIN_ID === hardhat.id) return hardhat;
  return defineChain({
    id: CHAIN_ID,
    name: `Chain ${CHAIN_ID}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  });
}

const chain = getChain();
const client = createPublicClient({ chain, transport: http(RPC_URL) });

export async function startIndexer(): Promise<void> {
  if (!CONTRACT_ADDRESS) {
    console.warn("CONTRACT_ADDRESS not set — indexer idle until configured");
    return;
  }

  console.log(
    `Indexer started: chain=${CHAIN_ID} contract=${CONTRACT_ADDRESS} confirmations=${CONFIRMATIONS}`
  );

  const poll = async () => {
    try {
      await indexNewTips();
      await confirmTips();
    } catch (err) {
      console.error("Indexer error:", err);
    }
  };

  await poll();
  setInterval(poll, POLL_INTERVAL_MS);
}

async function indexNewTips(): Promise<void> {
  const latest = await client.getBlockNumber();
  let fromBlock = getLastProcessedBlock();

  if (fromBlock === 0) {
    fromBlock = BigInt(DEPLOYMENT_BLOCK);
  } else {
    fromBlock = BigInt(fromBlock + 1);
  }

  if (fromBlock > latest) return;

  const logs = await client.getLogs({
    address: CONTRACT_ADDRESS,
    event: newTipEvent,
    fromBlock,
    toBlock: latest,
  });

  for (const log of logs) {
    processLog(log);
  }

  setLastProcessedBlock(Number(latest));
}

function processLog(log: Log<bigint, number, false, typeof newTipEvent, true>): void {
  const { from, amount, message } = log.args;
  if (from === undefined || amount === undefined || message === undefined) return;

  insertTip({
    from_address: from,
    amount: amount.toString(),
    message,
    tx_hash: log.transactionHash!,
    block_number: Number(log.blockNumber),
    log_index: log.logIndex!,
    confirmed: 0,
  });
}

async function confirmTips(): Promise<void> {
  const latest = await client.getBlockNumber();
  const confirmedUpTo = Number(latest) - CONFIRMATIONS;
  if (confirmedUpTo < 0) return;
  markTipsConfirmed(confirmedUpTo);
}
