import { expect } from "chai";
import { ethers } from "hardhat";

describe("MultiAgentAIDAOReferences", function () {
  it("Should return the correct prior art info", async function () {
    const References = await ethers.getContractFactory("MultiAgentAIDAOReferences");
    const references = await References.deploy();
    await references.deployed();

    const [link, desc] = await references.getPriorArtInfo();
    expect(link).to.include("meetup.com/mtldata/events/242042479");
    expect(desc).to.include("#PriorArt (2017) 'Multi-Agent AI DAO'");
  });
});

