import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgentCore", function () {
  it("Should set agentToken and owner on deploy", async function () {
    const [owner] = await ethers.getSigners();

    // Deploy a fake token first
    const AgentToken = await ethers.getContractFactory("AgentToken");
    const token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI");
    await token.deployed();

    // Deploy AgentCore
    const AgentCore = await ethers.getContractFactory("AgentCore");
    const core = await AgentCore.deploy(token.address);
    await core.deployed();

    expect(await core.agentToken()).to.equal(token.address);
    expect(await core.owner()).to.equal(owner.address);
  });

  it("Should allow only owner to transferOwnership", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const AgentToken = await ethers.getContractFactory("AgentToken");
    const token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI");
    await token.deployed();

    const AgentCore = await ethers.getContractFactory("AgentCore");
    const core = await AgentCore.deploy(token.address);
    await core.deployed();

    // Attempt transfer by non-owner
    await expect(core.connect(addr1).transferOwnership(addr1.address))
      .to.be.revertedWith("Not authorized");

    // Transfer by owner
    await core.transferOwnership(addr1.address);
    expect(await core.owner()).to.equal(addr1.address);
  });

  it("Should emit Upgraded event on upgrade", async function () {
    const [owner] = await ethers.getSigners();

    const AgentToken = await ethers.getContractFactory("AgentToken");
    const token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI");
    await token.deployed();

    const AgentCore = await ethers.getContractFactory("AgentCore");
    const core = await AgentCore.deploy(token.address);
    await core.deployed();

    await expect(core.upgrade(owner.address))
      .to.emit(core, "Upgraded")
      .withArgs(owner.address);
  });
});

