import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const myContractAddress = "0x06410Df73050b40A1209322982428d0177428Ac6";

  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContractV2 = await upgrades.upgradeProxy(
    myContractAddress,
    MyContractV2
  );

  console.log(
    "MyContract upgraded to MyContractV2 at address:",
    myContractV2.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
