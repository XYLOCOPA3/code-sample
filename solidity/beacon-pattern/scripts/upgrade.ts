import { ethers, upgrades, run } from "hardhat";

async function main() {
  const beaconAddress = "0x66E7B4E375B6f57C0b760244D4736105024Bda11";

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address);

  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const beacon = await upgrades.upgradeBeacon(beaconAddress, MyContractV2, {
    unsafeAllow: ["constructor"],
  });
  await beacon.deployed();
  console.log("Beacon deployed to:", beacon.address);
  console.log(
    "MyContract implementation deployed to:",
    await upgrades.beacon.getImplementationAddress(beacon.address)
  );

  console.log("Upgrade finished.");

  console.log("Verifying beacon...");
  await run("verify:verify", {
    address: beacon.address,
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
