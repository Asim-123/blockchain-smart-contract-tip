import fs from "fs";
import path from "path";

export interface TipRow {
  id: number;
  from_address: string;
  amount: string;
  message: string;
  tx_hash: string;
  block_number: number;
  log_index: number;
  confirmed: number;
}

interface Store {
  lastProcessedBlock: number;
  tips: TipRow[];
  nextId: number;
}

const DATA_DIR = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.join(__dirname, "..", "data");
const STORE_PATH = path.join(DATA_DIR, "indexer.json");

function loadStore(): Store {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    return { lastProcessedBlock: 0, tips: [], nextId: 1 };
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as Store;
}

function saveStore(store: Store): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getLastProcessedBlock(): number {
  return loadStore().lastProcessedBlock;
}

export function setLastProcessedBlock(block: number): void {
  const store = loadStore();
  store.lastProcessedBlock = block;
  saveStore(store);
}

export function insertTip(tip: Omit<TipRow, "id" | "confirmed"> & { confirmed?: number }): void {
  const store = loadStore();
  const exists = store.tips.some((t) => t.tx_hash === tip.tx_hash && t.log_index === tip.log_index);
  if (exists) return;

  store.tips.push({
    id: store.nextId++,
    from_address: tip.from_address,
    amount: tip.amount,
    message: tip.message,
    tx_hash: tip.tx_hash,
    block_number: tip.block_number,
    log_index: tip.log_index,
    confirmed: tip.confirmed ?? 0,
  });
  saveStore(store);
}

export function markTipsConfirmed(upToBlock: number): void {
  const store = loadStore();
  let changed = false;
  for (const tip of store.tips) {
    if (tip.block_number <= upToBlock && tip.confirmed === 0) {
      tip.confirmed = 1;
      changed = true;
    }
  }
  if (changed) saveStore(store);
}

export function getConfirmedTips(): TipRow[] {
  return loadStore()
    .tips.filter((t) => t.confirmed === 1)
    .sort((a, b) => b.block_number - a.block_number || b.log_index - a.log_index);
}
