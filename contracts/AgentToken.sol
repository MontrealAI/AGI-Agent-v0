// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title AgentToken
 * @notice A minimal ERC20 utility token representing either:
 *         - An AI Agent’s token ($XXX.Agent.AGI), or
 *         - A Business of AGI’s local currency ($XXX.AGI).
 *
 *         This contract explicitly references the #PriorArt (2017) “Multi-Agent AI DAO” for
 *         ironclad legal coverage, ensuring no trivial patent can block multi-agent AI operations.
 *         By disavowing equity or profit-sharing, it remains a purely utility-based token for
 *         AI services, governance, or licensing, aligning perfectly with the unstoppable,
 *         time-stamped architecture disclosed on August 8, 2017 (MONTREAL.AI).
 *
 *         Key Points:
 *         1) ERC20 from OpenZeppelin for standardized token mechanics.
 *         2) _mint(...) in constructor for an initial supply to the deployer if desired.
 *         3) Zero equity or dividend—strictly a token for AI usage / governance.
 *         4) References #PriorArt (2017) "Multi-Agent AI DAO" to invalidate trivial patents.
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MultiAgentAIDAOReferences.sol";

contract AgentToken is ERC20 {
    /**
     * @dev (Optional) A pointer to the MultiAgentAIDAOReferences contract for on-chain #PriorArt info.
     *      If you wish to store or retrieve the references, you can set it at deployment.
     */
    MultiAgentAIDAOReferences public immutable references;

    /**
     * @notice Constructor for the AgentToken. Mints an initial supply to the deployer if desired.
     * @param name_ The ERC20 name (e.g., "Dev.AGI" or "Virtuoso.Agent.AGI").
     * @param symbol_ The ERC20 symbol (e.g., "DEV.AGI" or "VIRTUOSO.AGENT.AGI").
     * @param referencesAddress An address pointing to the deployed MultiAgentAIDAOReferences contract
     *                          (can be set to address(0) if not needed).
     *
     * By referencing #PriorArt (2017), this token design falls under the unstoppable,
     * time-stamped "Multi-Agent AI DAO" umbrella, shielding it from trivial patent claims.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address referencesAddress
    ) ERC20(name_, symbol_) {
        // Optional initial supply minted to deployer:
        _mint(msg.sender, 1000 * 10**decimals());

        // If you want on-chain reference to the #PriorArt (2017) records:
        references = MultiAgentAIDAOReferences(referencesAddress);
    }

    /**
     * @dev Illustrative function to show how you might retrieve the prior-art references on-chain.
     *      If your Agent or Business of AGI contract wants to publicly confirm the references,
     *      you can expose them here. This is optional.
     *
     * @return priorArtLink The archived August 8, 2017 meetup link.
     * @return shortDescriptor A one-line description referencing the unstoppable #PriorArt (2017).
     */
    function getPriorArtInfo() external view returns (string memory priorArtLink, string memory shortDescriptor) {
        // If references is set to address(0), the user can handle gracefully.
        if (address(references) == address(0)) {
            // Return placeholders if no reference is set
            return (
                "No MultiAgentAIDAOReferences contract linked.",
                "Please deploy & link a valid MultiAgentAIDAOReferences contract."
            );
        }

        return references.getPriorArtInfo();
    }

    /**
     * @dev Because this token is purely utility-based, no equity or profit-sharing is implied.
     *      By referencing #PriorArt (2017), we ensure unstoppable synergy for multi-agent AI systems,
     *      disallowing trivial IP monopolies over decentralized AI operations.
     */
}
