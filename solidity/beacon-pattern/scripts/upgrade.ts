import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Upgrading contracts with the account:", deployer.address);

  // Replace this with the Beacon contract address from the deploy.js output
  const beaconAddress = "0x54C2521786CF10E475131be3bc1b935C37BA17F8";

  // Deploy the new MyContractV2 implementation contract
  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContractV2 = await MyContractV2.deploy();
  await myContractV2.deployed();
  console.log("MyContractV2 implementation deployed to:", myContractV2.address);

  // Attach to the existing Beacon contract
  const Beacon = await ethers.getContractFactory("Beacon");
  const beacon = Beacon.attach(beaconAddress);

  // Update the Beacon contract with the new MyContractV2 implementation address
  await beacon.upgradeTo(myContractV2.address);
  console.log("Beacon implementation updated to:", myContractV2.address);

  console.log("Upgrade finished.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
