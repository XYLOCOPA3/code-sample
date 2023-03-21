import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const proxyAddress = "0x629BB3a9Ee209ae07db37720ebEf9E77938eeb03";

  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContract = await upgrades.upgradeProxy(proxyAddress, MyContractV2);
  console.log("MyContract upgraded at:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
