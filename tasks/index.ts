import { task } from "hardhat/config";

task("deploy-contract", "Deploy contract").setAction(async (args, hre) => {
  try {
    // @ts-ignore
    const Factory = await hre.ethers.getContractFactory("Donation");
    await Factory.deploy();
    console.log("Contract was deployed");
  } catch (e) {
    console.log("Contract was not deployed");
  }
});

task("contract-balance", "Prints an contract's balance").setAction(
  async (args, hre) => {
    // @ts-ignore
    const balance = await hre.ethers.provider.getBalance(
      process.env.CONTRACT_ADDRESS as string
    );
    console.log(
      "Contract current balance:",
      // @ts-ignore
      hre.ethers.utils.formatEther(balance)
    );
  }
);

task("send-transaction")
  .addParam("amount", "Amount value")
  .setAction(async ({ amount }, hre) => {
    // @ts-ignore
    const [acc] = await hre.ethers.getSigners();
    // @ts-ignore
    const value = hre.ethers.utils.parseEther(amount);
    const tx = {
      to: process.env.CONTRACT_ADDRESS,
      value,
    };
    const trx = await acc.sendTransaction(tx);
    await trx.wait();
  });

task("withdraw", "Withdraw donations")
  .addParam("recipient", "Recipient address")
  .addParam("amount", "withdrow amount")
  .setAction(async ({ recipient, amount }, hre) => {
    // @ts-ignore
    const instance = await hre.ethers.getContractAt(
      "Donation",
      process.env.CONTRACT_ADDRESS as string
    );
    // @ts-ignore
    const newAmount = hre.ethers.utils.parseEther(amount);
    await instance.withdraw(recipient, newAmount);
  });
