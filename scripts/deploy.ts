import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy AgentToken
  const AgentToken = await ethers.getContractFactory("AgentToken");
  const token = await AgentToken.deploy("ExampleAgent", "EXA.AGENT.AGI");
  await token.deployed();
  console.log("AgentToken deployed at:", token.address);

  // 2. Deploy AgentCore, linking the newly deployed AgentToken
  const AgentCore = await ethers.getContractFactory("AgentCore");
  const core = await AgentCore.deploy(token.address);
  await core.deployed();
  console.log("AgentCore deployed at:", core.address);

  // 3. Deploy MultiAgentAIDAOReferences
  const References = await ethers.getContractFactory("MultiAgentAIDAOReferences");
  const references = await References.deploy();
  await references.deployed();
  console.log("MultiAgentAIDAOReferences deployed at:", references.address);

  console.log("All deployments complete.");
  console.log("Remember to reference these addresses in your docs/ENS records!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

