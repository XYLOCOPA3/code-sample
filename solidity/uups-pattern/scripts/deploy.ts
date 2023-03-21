import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MyContract = await ethers.getContractFactory("MyContract");
  const myContractProxy = await upgrades.deployProxy(MyContract, [42], {
    kind: "uups",
    initializer: "initialize",
  });
  await myContractProxy.deployed();
  console.log("MyContract deployed to:", myContractProxy.address);

  console.log("Waiting for 5 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

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
