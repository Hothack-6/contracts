// eslint-disable-next-line eslint-comments/disable-enable-pair -- not needed
/* eslint-disable camelcase -- Not needed */
import { ethers, upgrades } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;

  // const constructorParams: ILabrysSoulbound.ConstructorParamsStruct = {
  //   name_: "Labrys Proof of Employment",
  //   symbol_: "LPOE",
  //   description_: "A soulbound token for the employees of Labrys",
  //   defaultAdmin: "0xbabeD3b0088109E60F692f4aC3c0E1c9A6Bd6f95" // Jo test wallet
  // };

  // const soulboundTokenFactory = await ethers.getContractFactory(
  //   "LabrysSoulbound"
  // );

  // const soulboundToken = await upgrades.deployProxy(soulboundTokenFactory, [
  //   constructorParams,
  // ]);

  // // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  // await deployments.save("LabrysSoulbound", {
  //   ...soulboundToken,
  //   // abi: LabrysSoulbound__factory as any,
  // });
};

export default func;

func.tags = ["testbed", "_LabrysSoulbound"];