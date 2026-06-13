import { expect } from "chai";
import { ethers } from "hardhat";
import { TipJar } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TipJar", () => {
  let tipJar: TipJar;
  let owner: HardhatEthersSigner;
  let tipper: HardhatEthersSigner;
  let other: HardhatEthersSigner;

  beforeEach(async () => {
    [owner, tipper, other] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("TipJar");
    tipJar = await factory.deploy();
  });

  it("accepts a tip and emits NewTip with correct payload", async () => {
    const amount = ethers.parseEther("0.01");
    const message = "Great work!";

    await expect(tipJar.connect(tipper).tip(message, { value: amount }))
      .to.emit(tipJar, "NewTip")
      .withArgs(tipper.address, amount, message);

    expect(await ethers.provider.getBalance(await tipJar.getAddress())).to.equal(amount);
  });

  it("allows owner to withdraw accumulated balance", async () => {
    const amount = ethers.parseEther("0.05");
    await tipJar.connect(tipper).tip("tip1", { value: amount });

    const ownerBefore = await ethers.provider.getBalance(owner.address);
    const tx = await tipJar.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasCost = receipt!.gasUsed * receipt!.gasPrice;

    const ownerAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerAfter).to.equal(ownerBefore + amount - gasCost);
    expect(await ethers.provider.getBalance(await tipJar.getAddress())).to.equal(0n);
  });

  it("reverts when non-owner calls withdraw", async () => {
    await tipJar.connect(tipper).tip("tip", { value: ethers.parseEther("0.01") });
    await expect(tipJar.connect(other).withdraw()).to.be.revertedWithCustomError(tipJar, "NotOwner");
  });

  it("reverts tip with zero value", async () => {
    await expect(tipJar.connect(tipper).tip("empty", { value: 0 })).to.be.revertedWithCustomError(
      tipJar,
      "NoValue"
    );
  });
});
