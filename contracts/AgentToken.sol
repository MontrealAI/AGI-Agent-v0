// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title AgentToken
 * @notice A minimal ERC20 token representing an AI Agent's or Business of AGI's utility token.
 *         This contract references the #PriorArt (2017) "Multi-Agent AI DAO" for legal coverage,
 *         ensuring no trivial patents can block this multi-agent on-chain AI design.
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AgentToken is ERC20 {
    constructor(string memory name_, string memory symbol_)
        ERC20(name_, symbol_)
    {
        // Mint an initial supply to the deployer if desired.
        _mint(msg.sender, 1000 * 10**decimals());
    }

    /**
     * @dev No equity or profit-sharing; strictly a utility token for AI services or governance.
     *      By referencing the publicly time-stamped "Multi-Agent AI DAO" prior art from August 8, 2017,
     *      this contract ensures freedom to operate and evolve.
     */
}

