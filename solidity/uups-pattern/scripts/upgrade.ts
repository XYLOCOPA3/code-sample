import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const myContractAddress = "0x9b83e1751274C2E18f25E9DA15C22B43bA5562aA";

  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContractV2proxy = await upgrades.upgradeProxy(
    myContractAddress,
    MyContractV2
  );
  await myContractV2proxy.deployed();

  console.log(
    "MyContract upgraded to MyContractV2 at address:",
    myContractV2proxy.address
  );

  console.log("Verifying uups...");
  await run("verify:verify", {
    address: myContractV2proxy.address,
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
