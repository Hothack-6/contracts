import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/ethers-v5";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import { HardhatUserConfig } from "hardhat/types";
import "solidity-coverage";
import "./tasks/verifyOnEtherscan"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      saveDeployments: false,
    },
    localhost: {
      saveDeployments: false,
    },
    // sepolia: {
    //   saveDeployments: true,
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    // },
    // goerli: {
    //   saveDeployments: true,
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
    // }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2,
    carol: 3,
    ted: 4,
    system1: 5,
    system2: 6,
  },
};

export default config;