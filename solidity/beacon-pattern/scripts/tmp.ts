import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the MyContract implementation contract
  const MyContract = await ethers.getContractFactory("MyContract");
  const myContract = await MyContract.deploy();
  await myContract.deployed();

  // Encode the MyContract constructor call for initializing the proxy
  const myContractInitializeData = myContract.interface.encodeFunctionData(
    "initialize",
    [42]
  );
  console.log("myContractInitializeData:", myContractInitializeData);

  console.log("Deployment finished.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
