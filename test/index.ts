// eslint-disable-next-line node/no-missing-import
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Donation testing", async function () {
  const testAmount = 500;
  const testWithdrawAddress = "0x257EbbabE8452848832BC866916fA2D1D09459c4";
  it("the initial contract balance must be equal to zero", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const balance = await contract.getBalance();
    expect(balance).to.equal(0);
  });
  it("the initial length of the sponsors array must be equal to zero", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const sponsors = await contract.getSponsors();
    expect(sponsors.length).to.equal(0);
  });
  it("Total amount after transaction was saving", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const ownerAddress = await contract.getOwner();
    const signers = await ethers.getSigners();
    const testAddress = signers.find(
      (signer) => signer.address !== ownerAddress
    );
    const initialAmount = await contract.getTotalAmount();
    expect(initialAmount).to.equal(0);
    await testAddress?.sendTransaction({
      to: contract.address,
      value: testAmount,
    });
    const amountAfterTransaction = await contract.getTotalAmount();
    expect(amountAfterTransaction).to.equal(500);
  });
  it("Sponsors after transaction was saving", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const ownerAddress = await contract.getOwner();
    const signers = await ethers.getSigners();
    const testAddress = signers.find(
      (signer) => signer.address !== ownerAddress
    );
    const sponsors = await contract.getSponsors();
    expect(sponsors.length).to.equal(0);
    await testAddress?.sendTransaction({
      to: contract.address,
      value: testAmount,
    });
    const sponsorsAfterTransaction = await contract.getSponsors();
    expect(sponsorsAfterTransaction.length).to.equal(1);
  });

  it("no one except the owner can send funds", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const ownerAddress = await contract.getOwner();
    const signers = await ethers.getSigners();
    const testAddress = signers.find(
      (signer) => signer.address !== ownerAddress
    );
    await testAddress?.sendTransaction({
      to: contract.address,
      value: testAmount,
    });
    await expect(
      // @ts-ignore
      contract.connect(testAddress).withdraw(testWithdrawAddress, testAmount)
    ).to.be.revertedWith("only owner can do this");
  });
  it("Only owner can make withdraw", async function () {
    const Factory = await ethers.getContractFactory("Donation");
    const contract = await Factory.deploy();
    const ownerAddress = await contract.getOwner();
    const signers = await ethers.getSigners();
    const owner = signers.find((signer) => signer.address === ownerAddress);
    await owner?.sendTransaction({
      to: contract.address,
      value: testAmount,
    });
    await contract.withdraw(testWithdrawAddress, testAmount);

    await expect(await contract.getBalance()).to.equal(0);
  });
});
