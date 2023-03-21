import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";

async function deployMyContractFixture() {
  const [deployer, addr1] = await ethers.getSigners();

  const MyContract = await ethers.getContractFactory("MyContract");
  const beacon = await upgrades.deployBeacon(MyContract);
  await beacon.deployed();

  const beaconProxy1 = await upgrades.deployBeaconProxy(beacon, MyContract, [
    42,
  ]);
  await beaconProxy1.deployed();

  const beaconProxy2 = await upgrades.deployBeaconProxy(beacon, MyContract, [
    84,
  ]);
  await beaconProxy2.deployed();

  return {
    MyContract,
    beacon,
    beaconProxy1,
    beaconProxy2,
    deployer,
    addr1,
  };
}

describe("MyContract", function () {
  let beacon: Contract;
  let beaconProxy1: Contract;
  let beaconProxy2: Contract;

  beforeEach(async function () {
    ({ beacon, beaconProxy1, beaconProxy2 } = await loadFixture(
      deployMyContractFixture
    ));
  });

  describe("Deployment", function () {
    it("Should initialize the contract with the correct value 1", async function () {
      const storedValue = await beaconProxy1.value();
      expect(storedValue).to.equal(42);
    });

    it("Should initialize the contract with the correct value 2", async function () {
      const storedValue = await beaconProxy2.value();
      expect(storedValue).to.equal(84);
    });
  });

  describe("setValue", function () {
    it("Should set the value correctly", async function () {
      const tx = await beaconProxy1.setValue(50);
      await tx.wait();
      const storedValue = await beaconProxy1.value();
      expect(storedValue).to.equal(50);
    });
  });

  describe("Upgradability", function () {
    it("Should be upgradable", async function () {
      const MyContractV2 = await ethers.getContractFactory("MyContractV2");
      await upgrades.upgradeBeacon(beacon.address, MyContractV2, {
        unsafeAllow: ["constructor"],
      });

      const proxiedMyContractV21 = MyContractV2.attach(beaconProxy1.address);
      const tx1 = await proxiedMyContractV21.incrementValue();
      await tx1.wait();
      const storedValue1 = await proxiedMyContractV21.value();
      expect(storedValue1).to.equal(43);

      const proxiedMyContractV22 = MyContractV2.attach(beaconProxy2.address);
      const tx2 = await proxiedMyContractV22.incrementValue();
      await tx2.wait();
      const storedValue2 = await proxiedMyContractV22.value();
      expect(storedValue2).to.equal(85);
    });
  });
});
