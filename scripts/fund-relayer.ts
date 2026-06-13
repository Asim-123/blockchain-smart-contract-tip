import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const relayerAddress = "0x79B02f3eC8b925660fD4F1e6C95211017cF06966";

  console.log(`Funding relayer ${relayerAddress} from ${signer.address}...`);

  const tx = await signer.sendTransaction({
    to: relayerAddress,
    value: ethers.parseEther("10.0"), // Send 10 ETH
  });

  await tx.wait();
  
  const balance = await ethers.provider.getBalance(relayerAddress);
  console.log(`Relayer balance: ${ethers.formatEther(balance)} ETH`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
