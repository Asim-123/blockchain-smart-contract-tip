import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const factory = await ethers.getContractFactory("TipJar");
  const tipJar = await factory.deploy();
  await tipJar.waitForDeployment();

  const address = await tipJar.getAddress();
  const deployTx = tipJar.deploymentTransaction();
  const receipt = deployTx ? await deployTx.wait() : null;
  const blockNumber = receipt?.blockNumber ?? 0;
  const network = await ethers.provider.getNetwork();

  console.log("TipJar deployed to:", address);
  console.log("Deployment block:", blockNumber);
  console.log("Chain ID:", network.chainId.toString());

  const artifact = await ethers.getContractFactory("TipJar");
  const deployment = {
    address,
    blockNumber,
    abi: artifact.interface.format("json"),
    chainId: network.chainId.toString(),
    network: network.chainId === 11155111n ? "sepolia" : network.chainId === 31337n ? "hardhat" : "unknown",
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const filename = network.chainId === 11155111n ? "TipJar.sepolia.json" : "TipJar.json";
  fs.writeFileSync(path.join(outDir, filename), JSON.stringify(deployment, null, 2));
  console.log(`Saved to deployments/${filename}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
