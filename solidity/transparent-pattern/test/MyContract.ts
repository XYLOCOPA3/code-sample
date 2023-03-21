import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";

describe("MyContract (Transparent Proxy)", function () {
  async function deployMyContractFixture() {
    const MyContractFactory = await ethers.getContractFactory("MyContract");
    const myContract = await upgrades.deployProxy(MyContractFactory, [42], {
      initializer: "initialize",
    });
    await myContract.deployed();

    return { myContract };
  }

  describe("Deployment", function () {
    it("should be deployed with initial value", async function () {
      const { myContract } = await loadFixture(deployMyContractFixture);
      const value = await myContract.value();
      expect(value).to.equal(42);
    });
  });

  describe("Updating value", function () {
    it("should update the value", async function () {
      const { myContract } = await loadFixture(deployMyContractFixture);
      const tx = await myContract.setValue(50);
      await tx.wait();
      const value = await myContract.value();
      expect(value).to.equal(50);
    });
  });

  describe("Upgradability", function () {
    it("should be upgradable", async function () {
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
      expect(value).to.equal(43);
    });
  });
});
