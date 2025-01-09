import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgentToken", function () {
  it("Should deploy AgentToken with an initial supply to the deployer", async function () {
    const [owner] = await ethers.getSigners();
    const AgentToken = await ethers.getContractFactory("AgentToken");
    const token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI");
    await token.deployed();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("Should allow transfers", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const AgentToken = await ethers.getContractFactory("AgentToken");
    const token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI");
    await token.deployed();

    // Transfer 100 tokens to addr1
    await token.transfer(addr1.address, ethers.utils.parseUnits("100", 18));
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.utils.parseUnits("100", 18));
  });
});

