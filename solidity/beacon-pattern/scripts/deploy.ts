import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the MyContract implementation contract
  const MyContract = await ethers.getContractFactory("MyContract");
  const myContract = await MyContract.deploy();
  await myContract.deployed();
  console.log("MyContract implementation deployed to:", myContract.address);

  // Deploy the Beacon with the MyContract implementation address
  const Beacon = await ethers.getContractFactory("Beacon");
  const beacon = await Beacon.deploy(myContract.address);
  await beacon.deployed();
  console.log("Beacon deployed to:", beacon.address);

  // Encode the MyContract constructor call for initializing the proxy
  const myContractInitializeData = myContract.interface.encodeFunctionData(
    "initialize",
    [42]
  );

  // Deploy the MyContractProxy contract with the Beacon address and the constructor data
  const MyContractProxy = await ethers.getContractFactory("MyContractProxy");
  const myContractProxy = await MyContractProxy.deploy(
    beacon.address,
    myContractInitializeData
  );
  await myContractProxy.deployed();
  console.log("MyContractProxy deployed to:", myContractProxy.address);

  console.log("Deployment finished.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
