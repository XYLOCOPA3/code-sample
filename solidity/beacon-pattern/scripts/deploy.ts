import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MyContract = await ethers.getContractFactory("MyContract");
  const beacon = await upgrades.deployBeacon(MyContract);
  await beacon.deployed();
  console.log("Beacon deployed to:", beacon.address);
  console.log(
    "MyContract implementation deployed to:",
    await upgrades.beacon.getImplementationAddress(beacon.address)
  );

  const beaconProxy1 = await upgrades.deployBeaconProxy(beacon, MyContract, [
    42,
  ]);
  await beaconProxy1.deployed();
  console.log("beaconProxy1 deployed to:", beaconProxy1.address);

  const beaconProxy2 = await upgrades.deployBeaconProxy(beacon, MyContract, [
    84,
  ]);
  await beaconProxy2.deployed();
  console.log("beaconProxy2 deployed to:", beaconProxy2.address);

  console.log("Deployment finished.");

  console.log("Verifying beaconProxy1...");
  await run("verify:verify", {
    address: beaconProxy1.address,
    constructorArguments: [],
  });

  console.log("Verifying beaconProxy2...");
  await run("verify:verify", {
    address: beaconProxy2.address,
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
