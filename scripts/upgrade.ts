import { ethers } from "hardhat";

/**
 * @file upgrade.ts
 * @notice A comprehensive Hardhat script demonstrating how to “upgrade”
 *         an AgentCore instance in the AGI-Agent-v0 architecture.
 *
 *         Key Points:
 *         1) We retrieve an AgentCore contract by its deployed address.
 *         2) We call the AgentCore.upgrade(...) function, passing a newImplementationAddress.
 *         3) The script logs the transaction details and waits for confirmation.
 *
 *         Note: This example is purely conceptual for demonstration. In a real scenario,
 *         a proxy-based approach (e.g., TransparentUpgradeableProxy) might be used for real code upgrades.
 *         Here, we rely on the minimal event-based approach in AgentCore to record an upgrade reference on-chain.
 *
 *         Usage (example):
 *         npx hardhat run scripts/upgrade.ts --network localhost
 *         (Make sure to edit agentCoreAddress and newImplementationAddress below before running)
 */

async function main() {
  // 1. Retrieve the default deployer from Hardhat signers
  const [deployer] = await ethers.getSigners();
  console.log("\n--------------------------------------------------------");
  console.log("Initiating 'upgrade' script with account:", deployer.address);
  console.log("--------------------------------------------------------\n");

  // 2. Update these addresses prior to running the script:
  //    - agentCoreAddress: The AgentCore contract you wish to "upgrade" in a conceptual sense.
  //    - newImplementationAddress: The address representing your new logic or modules.
  const agentCoreAddress = "REPLACE_WITH_DEPLOYED_AGENTCORE_ADDRESS";
  const newImplementationAddress = "REPLACE_WITH_NEW_IMPLEMENTATION";

  if (agentCoreAddress === "REPLACE_WITH_DEPLOYED_AGENTCORE_ADDRESS" ||
      newImplementationAddress === "REPLACE_WITH_NEW_IMPLEMENTATION") {
    throw new Error("Please update agentCoreAddress and newImplementationAddress with actual addresses.");
  }

  console.log("AgentCore contract to upgrade:", agentCoreAddress);
  console.log("Proposed newImplementationAddress:", newImplementationAddress);

  // 3. Attach to the existing AgentCore contract at agentCoreAddress
  const AgentCore = await ethers.getContractFactory("AgentCore");
  const agentCore = AgentCore.attach(agentCoreAddress);

  // 4. Execute the upgrade(...) call; in our minimal approach, it just emits an event
  const tx = await agentCore.upgrade(newImplementationAddress);
  console.log("Transaction submitted, waiting for confirmation...");

  // 5. Wait for the transaction to be mined/confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed with receipt:", receipt.transactionHash);

  console.log("\n--------------------------------------------------------");
  console.log(`AgentCore at ${agentCoreAddress} "upgraded" to new logic/module at ${newImplementationAddress}`);
  console.log("--------------------------------------------------------\n");

  console.log("Upgrade flow complete. If using a real proxy-based approach, ensure your new logic is deployed properly.");
}

// Standard Hardhat pattern: handle errors + exit properly
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nUpgrade script error encountered:", error);
    process.exit(1);
  });
