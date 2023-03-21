import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MyContract = await ethers.getContractFactory("MyContract");
  const myContractProxy = await upgrades.deployProxy(MyContract, [42], {
    initializer: "initialize",
  });
  await myContractProxy.deployed();
  console.log("Proxy deployed to:", myContractProxy.address);

  console.log("Verifying uups...");
  await run("verify:verify", {
    address: myContractProxy.address,
    constructorArguments: [],
  });

  console.log("Verification done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
