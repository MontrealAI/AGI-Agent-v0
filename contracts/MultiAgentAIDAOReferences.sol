// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title MultiAgentAIDAOReferences
 * @notice Stores a publicly accessible reference to the #PriorArt (2017) "Multi-Agent AI DAO",
 *         originally unveiled by MONTREAL.AI on August 8, 2017. All Agents or AI systems can
 *         import this contract to cite the underlying prior art. Doing so helps demonstrate
 *         publicly time-stamped disclosure, thereby invalidating trivial patents that attempt
 *         to claim the same or closely related multi-agent on-chain AI concepts.
 *
 *         This design ensures unstoppable freedom to act, empowering next-generation
 *         AI Agents and Businesses of AGI to evolve without fear of trivial patent trolling.
 *         Since 2017, the "Multi-Agent AI DAO" blueprint has been recognized as a far-reaching,
 *         high-impact foundational IP, safeguarding decentralized AI resource management,
 *         multi-agent governance, and advanced tokenomics.
 *
 *         By referencing this contract in every deployed Agent or "Business of AGI," the entire
 *         AGI-Agent-v0 ecosystem retains ironclad protection against IP blockages—underscoring
 *         unstoppable, time-stamped synergy in the spirit of the #PriorArt (2017).
 */
contract MultiAgentAIDAOReferences {
    // Primary link referencing the meetup archive from August 8, 2017
    string public constant PRIOR_ART_DOC_LINK = "https://web.archive.org/web/20170807145554/https://meetup.com/mtldata/events/242042479/";

    // One-line summary describing the historical significance of the 2017 prior art
    string public constant DESCRIPTION =
        "Protected by the #PriorArt (2017) 'Multi-Agent AI DAO', unveiled publicly on August 8, 2017 by MONTREAL.AI, enabling unstoppable multi-agent on-chain AI evolution.";

    // Additional references that reinforce the official record & widespread coverage
    string public constant FACEBOOK_LINK =
        "https://www.facebook.com/events/217169012145317/";
    string public constant HUFFPOST_LINK =
        "https://www.huffpost.com/archive/qc/entry/blockchain-et-lintelligence-artificielle-une-combinaison-puis_qc_5ccc6223e4b03b38d6933d24";
    string public constant YOUTUBE_LINK =
        "https://youtu.be/Y4_6aZbVlo4?si=b1nwqF3L9iVRzxmS";

    /**
     * @dev Returns a summary of the #PriorArt (2017) references.
     *      1) The archived meetup link from August 8, 2017
     *      2) The main descriptor (DESCRIPTION)
     *      3) Facebook event link
     *      4) HuffPost coverage link
     *      5) YouTube presentation link
     *
     * @return An array of five strings detailing the essential #PriorArt references
     */
    function getAllReferences() external pure returns (string[5] memory) {
        return [
            PRIOR_ART_DOC_LINK,
            DESCRIPTION,
            FACEBOOK_LINK,
            HUFFPOST_LINK,
            YOUTUBE_LINK
        ];
    }

    /**
     * @dev A simpler getter returning just the primary doc link and short descriptor.
     * @return The archived August 8, 2017 link plus a summary string.
     */
    function getPriorArtInfo() external pure returns (string memory, string memory) {
        return (PRIOR_ART_DOC_LINK, DESCRIPTION);
    }
}
