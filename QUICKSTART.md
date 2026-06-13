# 🚀 Quick Start Guide

## Your Project is Running! ✅

All services are up and running. Here's what's active:

| Service | Status | Address | Port |
|---------|--------|---------|------|
| 🔗 **Hardhat Blockchain** | ✅ Running | `http://127.0.0.1:8545` | 8545 |
| 🔧 **Backend Server** | ✅ Running | `http://localhost:3001` | 3001 |
| 💻 **Frontend App** | ✅ Running | `http://localhost:5175` | 5175 |

**Deployed Contract**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

---

## 🎯 Next Steps

### 1. Open the Application

**Click here**: 👉 **http://localhost:5175** 👈

You should see the Tip Jar dApp with:
- Connect Wallet button in the top right
- Send a Tip form
- Recent Tips feed (currently showing existing tips)

### 2. Connect Your Wallet

To test the app, you need to add the local Hardhat network to MetaMask:

#### Add Custom Network in MetaMask:

1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add network" → "Add a network manually"
4. Enter these details:

| Setting | Value |
|---------|-------|
| **Network name** | Hardhat Local |
| **RPC URL** | `http://127.0.0.1:8545` |
| **Chain ID** | `31337` |
| **Currency symbol** | ETH |

5. Click "Save"

#### Import Test Account:

The Hardhat blockchain comes with pre-funded test accounts. Import this one:

**Private Key**: 
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf6f4c2b1
```

**Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

This account has **10,000 ETH** for testing!

### 3. Send Your First Tip! 💸

1. Click **"Connect Wallet"** in the app
2. Select MetaMask and approve the connection
3. Fill out the tip form:
   - **Amount**: Try `0.01` ETH
   - **Message**: "Hello from the blockchain! 🚀"
4. Click **"🫙 Send Tip"**
5. Confirm the transaction in MetaMask
6. **Watch the magic**: Your tip appears in the feed within 3-5 seconds!

### 4. Try Gasless Mode (Optional) ⛽️

1. Toggle **"Gasless tip"** switch in the form
2. Fill out amount and message
3. Click **"✍️ Sign & Relay Tip"**
4. Sign the message in MetaMask (no gas needed!)
5. Backend relayer submits the transaction for you

---

## 🔍 What's Happening Behind the Scenes?

### Real-Time Updates in Action

Open your browser console (F12) and watch for these logs:

```
Socket connected: <socket-id>
New tip received: {...}
Tips confirmed: X
```

### Backend Activity

Check your backend terminal for:
- Indexer polling every 3 seconds
- WebSocket client connections
- Tips being indexed and confirmed

### The Flow

```
📝 You send tip
   ↓
⛓️ Transaction mined on blockchain
   ↓
🔍 Backend indexer detects it (3s polling)
   ↓
📡 WebSocket emits "tip:new" event
   ↓
💻 Frontend receives event instantly
   ↓
✨ UI updates in real-time!
```

---

## 📊 Test the Real-Time Updates

### Multiple Browser Windows

1. Open the app in 2-3 browser tabs: `http://localhost:5175`
2. Send a tip from ONE tab
3. **Watch all tabs update simultaneously!** ⚡

This proves the WebSocket push system is working.

### Check the Data

The indexed tips are stored in:
```
backend/data/indexer.json
```

You can see the raw data structure there.

---

## 🎨 Features to Try

### ✅ On-Chain Tips
- Every tip is recorded permanently on the blockchain
- View transaction hashes and block numbers
- All data is publicly verifiable

### ✅ Real-Time Feed
- Tips appear instantly (no refresh needed)
- WebSocket-powered updates
- Multiple tabs stay synchronized

### ✅ Gasless Tipping
- EIP-712 signatures
- Backend relayer pays gas
- Lower barrier for users

### ✅ Stats Bar
- Total tips count
- Total volume in ETH
- Current network info

---

## 🛠️ Troubleshooting

### "Connect Wallet" not working?
- Make sure MetaMask is installed
- Verify you added the Hardhat Local network
- Check the network is selected in MetaMask

### Tips not appearing?
- Check browser console for errors
- Verify backend is running (check terminal)
- Ensure blockchain node is running on port 8545

### WebSocket not connecting?
- Check backend terminal shows "WebSocket server ready"
- Look for "Socket connected" in browser console
- Verify no firewall is blocking port 3001

### Transaction fails?
- Make sure you have ETH (import the test account)
- Verify you're on the Hardhat Local network
- Check MetaMask isn't set to a different network

---

## 📈 Next: Deploy to Production

When you're ready to deploy to a real testnet:

1. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Sepolia deployment
2. Get free testnet ETH from a faucet
3. Deploy to Vercel (frontend) + Render (backend)

---

## 🔗 Useful Links

- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3001/tips
- **Health Check**: http://localhost:3001/health
- **Blockchain RPC**: http://127.0.0.1:8545

---

## 💡 Tips for Development

### Restart Services

If you need to restart any service:

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

**Blockchain**:
```bash
npm run node
```

### Reset Blockchain

To start fresh:
```bash
# Stop blockchain (Ctrl+C)
# Delete chain data
# Restart: npm run node
# Redeploy: npm run deploy:local
# Update CONTRACT_ADDRESS in .env files
```

---

## 🎉 You're All Set!

Your Tip Jar dApp is running with:
- ✅ Smart contract deployed
- ✅ Backend indexing + WebSocket server
- ✅ Frontend with real-time updates
- ✅ Gasless tipping enabled
- ✅ Test account with 10,000 ETH

**Start tipping!** 💸

Open http://localhost:5175 and try sending your first tip! 🚀
