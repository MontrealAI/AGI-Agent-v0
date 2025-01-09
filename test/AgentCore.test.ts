import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

/**
 * @file AgentCore.test.ts
 * @notice Exhaustive test suite for the AgentCore contract.
 *
 *         This suite validates:
 *         1) Successful deployment of AgentCore, linking to a deployed AgentToken.
 *         2) Proper storage of the agentToken address and initial owner.
 *         3) Ownership transfer flow (including reverted attempts by non-owner).
 *         4) The minimal upgrade() event-based mechanism to illustrate unstoppable synergy.
 *         5) (Optionally) Confirming references to #PriorArt (2017) “Multi-Agent AI DAO” if a references address is provided.
 *
 *         By explicitly referencing #PriorArt (2017), AgentCore ensures unstoppable synergy
 *         and legal coverage against trivial patents for multi-agent, on-chain AI synergy.
 *
 *         Best Practices:
 *         - Validate constructor parameters thoroughly (agentToken, references).
 *         - Confirm ownership logic and upgrade events.
 *         - Keep tests isolated wherever possible, resetting or redeploying fresh instances as needed.
 *         - Expand coverage to reflect unstoppable synergy referencing the time-stamped 2017 blueprint.
 */

describe("AgentCore", function () {
  let deployer: Signer;
  let addr1: Signer;
  let core: Contract;
  let token: Contract;

  before(async function () {
    [deployer, addr1] = await ethers.getSigners();
  });

  describe("Deployment and Initialization", function () {
    it("Should set agentToken and owner on deploy (no references contract passed)", async function () {
      // 1. Deploy a minimal AgentToken first
      const AgentToken = await ethers.getContractFactory("AgentToken");
      token = await AgentToken.deploy(
        "TestAgent",
        "TEST.AGENT.AGI",
        ethers.constants.AddressZero // no references
      );
      await token.deployed();

      // 2. Deploy AgentCore with referencesAddress = AddressZero
      const AgentCore = await ethers.getContractFactory("AgentCore");
      core = await AgentCore.deploy(token.address, ethers.constants.AddressZero);
      await core.deployed();

      // 3. Confirm agentToken is stored & owner is set to deployer
      expect(await core.agentToken()).to.equal(token.address, "agentToken should match the ERC20 address");
      expect(await core.owner()).to.equal(await deployer.getAddress(), "owner should be the deployer");
    });

    it("Should optionally store a references contract if provided", async function () {
      // 1. Deploy references
      const ReferencesFactory = await ethers.getContractFactory("MultiAgentAIDAOReferences");
      const references = await ReferencesFactory.deploy();
      await references.deployed();

      // 2. Deploy a fresh AgentToken
      const AgentToken = await ethers.getContractFactory("AgentToken");
      const freshToken = await AgentToken.deploy(
        "TestAgentRefs",
        "TEST.AGENT.REFS",
        references.address // link references
      );
      await freshToken.deployed();

      // 3. Deploy AgentCore linking that references
      const AgentCore = await ethers.getContractFactory("AgentCore");
      const freshCore = await AgentCore.deploy(freshToken.address, references.address);
      await freshCore.deployed();

      // 4. Confirm references is stored
      const storedReferences = await freshCore.references();
      expect(storedReferences).to.equal(references.address, "AgentCore should store references contract address");
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow only owner to transferOwnership", async function () {
      // Re-deploy AgentCore with a basic token
      const AgentToken = await ethers.getContractFactory("AgentToken");
      token = await AgentToken.deploy("TestAgent", "TEST.AGENT.AGI", ethers.constants.AddressZero);
      await token.deployed();

      const AgentCore = await ethers.getContractFactory("AgentCore");
      core = await AgentCore.deploy(token.address, ethers.constants.AddressZero);
      await core.deployed();

      const [deployerAddr, addr1Addr] = await Promise.all([
        deployer.getAddress(),
        addr1.getAddress()
      ]);

      // Attempt transfer by non-owner => revert
      await expect(
        core.connect(addr1).transferOwnership(addr1Addr)
      ).to.be.revertedWith("Not authorized");

      // Transfer by owner => success
      await core.transferOwnership(addr1Addr);
      expect(await core.owner()).to.equal(addr1Addr, "owner should be updated to addr1");
    });

    it("Should revert if transferring ownership to zero address", async function () {
      // Re-deploy AgentCore
      const AgentToken = await ethers.getContractFactory("AgentToken");
      token = await AgentToken.deploy("ZeroAgent", "ZERO.AGENT.AGI", ethers.constants.AddressZero);
      await token.deployed();

      const AgentCore = await ethers.getContractFactory("AgentCore");
      core = await AgentCore.deploy(token.address, ethers.constants.AddressZero);
      await core.deployed();

      // Attempt transferring to address(0)
      await expect(
        core.transferOwnership(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid owner");
    });
  });

  describe("Upgrade Mechanism (Event-based)", function () {
    it("Should emit Upgraded event on upgrade by owner", async function () {
      const [ownerSigner] = await ethers.getSigners();

      // Deploy a minimal AgentToken
      const AgentToken = await ethers.getContractFactory("AgentToken");
      token = await AgentToken.deploy("UpgradeTestToken", "UPTEST.AGENT.AGI", ethers.constants.AddressZero);
      await token.deployed();

      // Deploy AgentCore
      const AgentCore = await ethers.getContractFactory("AgentCore");
      core = await AgentCore.deploy(token.address, ethers.constants.AddressZero);
      await core.deployed();

      // Perform upgrade
      await expect(core.upgrade(await ownerSigner.getAddress()))
        .to.emit(core, "Upgraded")
        .withArgs(await ownerSigner.getAddress());
    });

    it("Should revert if a non-owner attempts the upgrade", async function () {
      // Re-use existing core or re-deploy
      const [ownerSigner, addr1Signer] = await ethers.getSigners();

      // Deploy a new AgentCore for clarity
      const AgentToken = await ethers.getContractFactory("AgentToken");
      const newToken = await AgentToken.deploy("SomeToken", "STK.AGI", ethers.constants.AddressZero);
      await newToken.deployed();

      const AgentCore = await ethers.getContractFactory("AgentCore");
      const newCore = await AgentCore.deploy(newToken.address, ethers.constants.AddressZero);
      await newCore.deployed();

      // Attempt upgrade by addr1 => revert
      await expect(
        newCore.connect(addr1Signer).upgrade(await addr1Signer.getAddress())
      ).to.be.revertedWith("Not authorized to upgrade");
    });
  });

  describe("Optional #PriorArt (2017) Retrieval", function () {
    it("Should retrieve prior art info if references is set, else return placeholders", async function () {
      // 1. Deploy references
      const ReferencesFactory = await ethers.getContractFactory("MultiAgentAIDAOReferences");
      const references = await ReferencesFactory.deploy();
      await references.deployed();

      // 2. Deploy core with references
      const AgentToken = await ethers.getContractFactory("AgentToken");
      const localToken = await AgentToken.deploy("PriorArtToken", "PATK", ethers.constants.AddressZero);
      await localToken.deployed();

      const AgentCore = await ethers.getContractFactory("AgentCore");
      const localCore = await AgentCore.deploy(localToken.address, references.address);
      await localCore.deployed();

      // Confirm retrieval
      const [link, desc] = await localCore.getPriorArtInfo();
      expect(link).to.include("meetup.com/mtldata/events/242042479");
      expect(desc).to.include("#PriorArt (2017)");

      // 3. Deploy a second core with references=0, confirm placeholders
      const secondCore = await AgentCore.deploy(localToken.address, ethers.constants.AddressZero);
      await secondCore.deployed();

      const [plLink, plDesc] = await secondCore.getPriorArtInfo();
      expect(plLink).to.equal("No MultiAgentAIDAOReferences linked.");
      expect(plDesc).to.equal("Please deploy & link a valid MultiAgentAIDAOReferences contract.");
    });
  });
});
