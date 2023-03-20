import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";

async function deployMyContractFixture() {
  const [deployer, addr1] = await ethers.getSigners();

  const MyContract = await ethers.getContractFactory("MyContract");
  const MyContractProxy = await ethers.getContractFactory("MyContractProxy");
  const Beacon = await ethers.getContractFactory("Beacon");

  const myContract = await MyContract.deploy();
  await myContract.deployed();

  const beacon = await Beacon.deploy(myContract.address);
  await beacon.deployed();

  const myContractInitializeData = myContract.interface.encodeFunctionData(
    "initialize",
    [10]
  );
  const myContractProxy = await MyContractProxy.deploy(
    beacon.address,
    myContractInitializeData
  );
  await myContractProxy.deployed();

  return {
    MyContract,
    MyContractProxy,
    Beacon,
    myContract,
    myContractProxy,
    beacon,
    deployer,
    addr1,
  };
}

describe("MyContract", function () {
  let myContract: Contract;
  let myContractProxy: Contract;
  let beacon: Contract;
  let deployer: Signer;

  beforeEach(async function () {
    ({ myContract, myContractProxy, beacon, deployer } = await loadFixture(
      deployMyContractFixture
    ));
  });

  it("initialize", async function () {
    const proxiedMyContract = myContract.attach(myContractProxy.address);

    const storedValue = await proxiedMyContract.value();

    expect(storedValue).to.equal(10);
  });

  it("stores the value via proxy", async function () {
    const proxiedMyContract = myContract.attach(myContractProxy.address);

    await proxiedMyContract.setValue(42);
    const storedValue = await proxiedMyContract.value();

    expect(storedValue).to.equal(42);
  });

  it("updates implementation contract via beacon", async function () {
    const MyContractV2 = await ethers.getContractFactory("MyContractV2");
    const myContractV2 = await MyContractV2.deploy();
    await myContractV2.deployed();

    await beacon.connect(deployer).upgradeTo(myContractV2.address);

    const proxiedMyContractV2 = MyContractV2.attach(myContractProxy.address);
    const tx = await proxiedMyContractV2.incrementValue();
    await tx.wait();
    const storedValue = await proxiedMyContractV2.value();

    expect(storedValue).to.equal(11);
  });
});
