import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MyContract = await ethers.getContractFactory("MyContract");
  const myContract = await upgrades.deployProxy(MyContract, [42], {
    initializer: "initialize",
  });
  console.log("MyContract deployed to:", myContract.address);

  const proxyAddress = await upgrades.admin.getInstance();
  console.log("TransparentUpgradeableProxy deployed to:", proxyAddress.address);

  const initData = myContract.interface.encodeFunctionData("initialize", [42]);
  console.log("Initial data for proxy:", initData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
