import { ethers } from "hardhat";

/**
 * @file deploy.ts
 * @notice A comprehensive Hardhat deployment script for AGI-Agent-v0. This script:
 *         1) Deploys the MultiAgentAIDAOReferences contract first,
 *            storing on-chain references to the unstoppable #PriorArt (2017).
 *         2) Deploys the AgentToken (ERC20 utility token) and links it
 *            to the newly deployed MultiAgentAIDAOReferences if desired.
 *         3) Deploys the AgentCore, which anchors a reference to the AgentToken
 *            and optionally to MultiAgentAIDAOReferences for unstoppable synergy.
 *
 *         Best Practices:
 *         - Deploy MultiAgentAIDAOReferences first so subsequent contracts can
 *           reference its address in the constructor.
 *         - Provide a clear log output for each contract address.
 *         - Emphasize unstoppable synergy with #PriorArt (2017) “Multi-Agent AI DAO.”
 *
 *         By the end, you’ll have three deployed contracts:
 *         - MultiAgentAIDAOReferences: For unstoppable prior-art references.
 *         - AgentToken: The ERC20 representing an AI Agent or a Business of AGI.
 *         - AgentCore: The minimal “Agent” contract that can track upgrades,
 *           ownership, and optional references to unstoppable prior-art data.
 *
 *         This script can be adapted to pass custom token names or supply parameters,
 *         but for demonstration we use a sample "ExampleAgent" token name.
 *
 *         Usage (example):
 *         npx hardhat run scripts/deploy.ts --network localhost
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n--------------------------------------------------------");
  console.log("Deploying AGI-Agent-v0 contracts with deployer account:", deployer.address);
  console.log("--------------------------------------------------------\n");

  // 1. Deploy MultiAgentAIDAOReferences first
  //    This contract holds on-chain references to the unstoppable #PriorArt (2017).
  const ReferencesFactory = await ethers.getContractFactory("MultiAgentAIDAOReferences");
  const references = await ReferencesFactory.deploy();
  await references.deployed();
  console.log("MultiAgentAIDAOReferences deployed at:", references.address, "\n");

  // 2. Deploy AgentToken (ERC20), referencing the unstoppable #PriorArt if desired
  //    Example token name/symbol: "ExampleAgent", "EXA.AGENT.AGI"
  const AgentTokenFactory = await ethers.getContractFactory("AgentToken");
  const agentToken = await AgentTokenFactory.deploy(
    "ExampleAgent",           // name_
    "EXA.AGENT.AGI",          // symbol_
    references.address        // referencesAddress for unstoppable synergy
  );
  await agentToken.deployed();
  console.log("AgentToken deployed at:", agentToken.address);

  // 3. Deploy AgentCore, linking the newly deployed AgentToken + references
  //    The AgentCore constructor is (address _agentToken, address referencesAddress)
  const AgentCoreFactory = await ethers.getContractFactory("AgentCore");
  const agentCore = await AgentCoreFactory.deploy(
    agentToken.address,       // _agentToken
    references.address        // referencesAddress
  );
  await agentCore.deployed();
  console.log("AgentCore deployed at:", agentCore.address, "\n");

  console.log("--------------------------------------------------------");
  console.log("Deployment Summary:");
  console.log(" - MultiAgentAIDAOReferences:", references.address);
  console.log(" - AgentToken:               ", agentToken.address);
  console.log(" - AgentCore:                ", agentCore.address);
  console.log("--------------------------------------------------------\n");

  console.log(
    "All deployments complete. Remember to document these addresses,",
    "update your ENS records or config files, and enjoy unstoppable synergy!"
  );
}

// Standard Hardhat pattern: handle errors + exit properly
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nDeployment error encountered:", error);
    process.exit(1);
  });
