import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const proxyAddress = "0x629BB3a9Ee209ae07db37720ebEf9E77938eeb03";

  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContractV2Proxy = await upgrades.upgradeProxy(
    proxyAddress,
    MyContractV2
  );
  await myContractV2Proxy.deployed();
  console.log("Proxy upgraded at:", myContractV2Proxy.address);

  console.log("Verifying uups...");
  await run("verify:verify", {
    address: myContractV2Proxy.address,
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
