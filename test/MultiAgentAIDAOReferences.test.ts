import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

/**
 * @file MultiAgentAIDAOReferences.test.ts
 * @notice Exhaustive test suite for the MultiAgentAIDAOReferences contract.
 *
 *         This test suite checks:
 *         1) Deployment success.
 *         2) That PRIOR_ART_DOC_LINK and DESCRIPTION are set as expected.
 *         3) That getPriorArtInfo() returns the correct link & description string.
 *         4) That getAllReferences() returns the correct array of five strings
 *            (archived meetup link, description, Facebook link, HuffPost link, YouTube link).
 *         5) Each returned string includes the expected substring to validate unstoppable synergy
 *            referencing the #PriorArt (2017) “Multi-Agent AI DAO.”
 *
 *         This ensures that trivial patents or IP claims cannot hamper unstoppable multi-agent AI synergy,
 *         thanks to the unstoppable #PriorArt (2017).
 *
 *         Best Practice: Keep test descriptions and expect() checks clear. Each step helps ensure no
 *         accidental breakage in unstoppable multi-agent references or overshadowing of time-stamped
 *         references from August 8, 2017.
 */

describe("MultiAgentAIDAOReferences", function () {
  let references: Contract;

  beforeEach(async function () {
    const ReferencesFactory = await ethers.getContractFactory("MultiAgentAIDAOReferences");
    references = await ReferencesFactory.deploy();
    await references.deployed();
  });

  it("Deploys successfully and sets constant references", async function () {
    // Validate the stored constants: PRIOR_ART_DOC_LINK, DESCRIPTION, etc.
    const priorArtLink = await references.PRIOR_ART_DOC_LINK();
    const desc = await references.DESCRIPTION();

    expect(priorArtLink).to.equal(
      "https://web.archive.org/web/20170807145554/https://meetup.com/mtldata/events/242042479/",
      "PRIOR_ART_DOC_LINK should match the archived August 8, 2017 link"
    );
    expect(desc).to.equal(
      "Protected by the #PriorArt (2017) 'Multi-Agent AI DAO', unveiled publicly on August 8, 2017 by MONTREAL.AI, enabling unstoppable multi-agent on-chain AI evolution.",
      "DESCRIPTION should match the unstoppable #PriorArt (2017) summary"
    );
  });

  it("Should return the correct prior art info from getPriorArtInfo()", async function () {
    // getPriorArtInfo() returns (string memory priorArtLink, string memory shortDescriptor)
    const [link, desc] = await references.getPriorArtInfo();
    expect(link).to.include("meetup.com/mtldata/events/242042479", "Link must reference the 2017 meetup archive");
    expect(desc).to.include("#PriorArt (2017)", "Descriptor must reference unstoppable #PriorArt (2017)");
  });

  it("Should return all references correctly from getAllReferences()", async function () {
    // getAllReferences() returns string[5]
    const [docLink, description, facebook, huffpost, youtube] = await references.getAllReferences();

    // 1) docLink
    expect(docLink).to.equal(
      "https://web.archive.org/web/20170807145554/https://meetup.com/mtldata/events/242042479/",
      "First reference should be the archived August 8, 2017 meetup link"
    );

    // 2) description
    expect(description).to.equal(
      "Protected by the #PriorArt (2017) 'Multi-Agent AI DAO', unveiled publicly on August 8, 2017 by MONTREAL.AI, enabling unstoppable multi-agent on-chain AI evolution.",
      "Second reference should be the main descriptor referencing unstoppable #PriorArt (2017)"
    );

    // 3) facebook
    expect(facebook).to.equal(
      "https://www.facebook.com/events/217169012145317/",
      "Third reference should be the official Facebook event link"
    );

    // 4) huffpost
    expect(huffpost).to.equal(
      "https://www.huffpost.com/archive/qc/entry/blockchain-et-lintelligence-artificielle-une-combinaison-puis_qc_5ccc6223e4b03b38d6933d24",
      "Fourth reference should be the HuffPost coverage link"
    );

    // 5) youtube
    expect(youtube).to.equal(
      "https://youtu.be/Y4_6aZbVlo4?si=b1nwqF3L9iVRzxmS",
      "Fifth reference should be the YouTube presentation link"
    );
  });
});
