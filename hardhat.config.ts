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
import "./tasks/verifyOnEtherscan"

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
    arbitrumSepolia: {
      url: process.env.ALCHEMY_URI || "",
      accounts
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: 'SGB9WXVY8X4R22V6XUMTEADA1GM7JVG51X'
    },
    customChains: [
      {
          network: "arbitrumSepolia",
          chainId: 421614,
          urls: {
              apiURL: "https://api-sepolia.arbiscan.io/api",
              browserURL: "https://sepolia.arbiscan.io/",
          },
      },
  ],
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