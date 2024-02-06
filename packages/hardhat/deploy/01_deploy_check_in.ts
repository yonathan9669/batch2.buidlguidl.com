import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "deployCheckIn" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCheckIn: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  let batchRegistryAddress;

  try {
    const batchRegistry = await hre.ethers.getContract<Contract>("BatchRegistry", deployer);
    batchRegistryAddress = await batchRegistry.getAddress();
  } catch (e) {
    console.log("BatchRegistry not found, checking env...");
    if (hre.network.name === "optimism") {
      const { OPTIMISM_REGISTRY_ADDRESS } = process.env;
      batchRegistryAddress = OPTIMISM_REGISTRY_ADDRESS;
    }

    if (!batchRegistryAddress)
      throw new Error(`REGISTRY ADDRESS is not set for ${hre.network.name} network. Please set it in .env file.`);
  }

  await deploy("CheckIn", {
    from: deployer,
    args: [deployer, batchRegistryAddress],
    log: true,
    autoMine: true,
  });

  // const checkIn = await hre.ethers.getContract<Contract>("BatchRegistry", deployer);
  // console.log("CheckIn deployed to:", await checkIn.getAddress());
};

export default deployCheckIn;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployCheckIn.tags = ["CheckIn"];
