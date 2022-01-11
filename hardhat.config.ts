import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/index.ts";

dotenv.config();

const url = process.env.CHAIN_URL as string;
const privateKey = process.env.PRIVATE_KEY as string;
const chainId = Number(process.env.CHAIN_ID as string) || 0;
const reportGas = (process.env.REPORT_GAS as string) === "true";
const apiKey = process.env.API_KEY as string;

const requiredEnvs = [
  { value: url, key: "CHAIN_URL" },
  { value: privateKey, key: "PRIVATE_KEY" },
  { value: chainId, key: "CHAIN_ID" },
  { value: apiKey, key: "API_KEY" },
];

requiredEnvs.forEach((item) => {
  if (!item.value) {
    throw new Error(
      `Please check that the ${item.key} value exist in the .env file`
    );
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    kovan: {
      url,
      accounts: privateKey ? [privateKey] : [],
      chainId: chainId,
    },
  },
  gasReporter: {
    enabled: reportGas,
    currency: "USD",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  etherscan: {
    apiKey: apiKey,
  },
};

export default config;
