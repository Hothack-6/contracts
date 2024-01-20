// eslint-disable-next-line eslint-comments/disable-enable-pair -- not needed
/* eslint-disable camelcase -- Not needed */
import { ethers, upgrades } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Fantasia__factory } from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getUnnamedAccounts } = hre;

  const [deployer] = await getUnnamedAccounts();

  const tokenFactory = await ethers.getContractFactory(
    "Fantasia"
  );

  const token = await upgrades.deployProxy(tokenFactory, [
    deployer,// Owner
    "pretendUri.com", // baseUri
    "Fantasia", // name
    "FAN", // symbol
    "NFT memorabilia for live performances" // description
  ]);

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  await deployments.save("Fantasia", {
    ...token,
    abi: Fantasia__factory as any,
  });
};

export default func;

func.tags = ["testbed", "_Fantasia"];