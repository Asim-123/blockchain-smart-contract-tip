import "dotenv/config";
import express from "express";
import cors from "cors";
import { getConfirmedTips } from "./db";
import { startIndexer } from "./indexer";

const PORT = parseInt(process.env.PORT || "3001", 10);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/tips", (_req, res) => {
  const tips = getConfirmedTips().map((t) => ({
    from: t.from_address,
    amount: t.amount,
    message: t.message,
    txHash: t.tx_hash,
    block: t.block_number,
  }));
  res.json(tips);
});

app.listen(PORT, async () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  await startIndexer();
});
