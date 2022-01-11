import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const ContractFactory = await ethers.getContractFactory("Donation");
  const inst: Contract = await ContractFactory.deploy();
  await inst.deployed();
}
main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
