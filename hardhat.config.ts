import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

const accounts: string[] =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [] as string[];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: { sources: "contracts/" },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_API_KEY || "",
      polygon: process.env.POLYGON_API_KEY || ""
    },
  },
  namedAccounts: {
    deployer: 0,
    hirer: 1,
    talent: 2,
    carol: 3,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;