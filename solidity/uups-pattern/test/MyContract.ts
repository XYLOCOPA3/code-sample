import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";

describe("MyContract", function () {
  async function deployMyContractFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await upgrades.deployProxy(MyContract, [10], {
      kind: "uups",
      initializer: "initialize",
    });
    await myContract.deployed();

    return { myContract, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should initialize the contract with the correct value", async function () {
      const { myContract } = await loadFixture(deployMyContractFixture);

      expect(await myContract.value()).to.equal(10);
    });
  });

  describe("setValue", function () {
    it("Should set the value correctly", async function () {
      const { myContract } = await loadFixture(deployMyContractFixture);

      const tx = await myContract.setValue(42);
      await tx.wait();
      expect(await myContract.value()).to.equal(42);
    });
  });

  describe("Upgradability", function () {
    it("Should be upgradable", async function () {
      const { myContract } = await loadFixture(deployMyContractFixture);

      const MyContractV2Factory = await ethers.getContractFactory(
        "MyContractV2"
      );
      const myContractV2 = await upgrades.upgradeProxy(
        myContract.address,
        MyContractV2Factory
      );

      const tx = await myContractV2.incrementValue();
      await tx.wait();
      const value = await myContractV2.value();
      expect(value).to.equal(11);
    });
  });
});
