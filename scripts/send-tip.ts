import { ethers } from "hardhat";

async function main() {
  const deployment = await import("../deployments/TipJar.json");
  const address = deployment.address;
  const factory = await ethers.getContractFactory("TipJar");
  const tipJar = factory.attach(address);

  const [tipper] = await ethers.getSigners();
  const tx = await tipJar.connect(tipper).tip("Hello from test script!", {
    value: ethers.parseEther("0.01"),
  });
  await tx.wait();
  console.log("Tip sent:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
