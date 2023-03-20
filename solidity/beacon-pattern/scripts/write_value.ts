import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Reading value with the account:", deployer.address);

  // Replace this with the MyContractProxy contract address from the deploy.js output
  const myContractProxyAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Attach to the existing MyContractProxy contract
  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const myContractProxy = MyContractV2.attach(myContractProxyAddress);

  // Call the 'value' getter function through the proxy
  const tx = await myContractProxy.incrementValue();
  await tx.wait();
  const value = await myContractProxy.value();
  console.log("Value stored in MyContract:", value.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
