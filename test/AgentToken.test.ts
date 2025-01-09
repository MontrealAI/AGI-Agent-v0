import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

/**
 * @file AgentToken.test.ts
 * @notice Exhaustive test suite for the AgentToken contract.
 *
 *         This suite validates:
 *         1) Successful deployment with an optional initial supply minted to the deployer.
 *         2) Basic ERC20 functionality (transfer, balances).
 *         3) Integration with the #PriorArt (2017) “Multi-Agent AI DAO” references:
 *            - If a references contract is passed, we confirm getPriorArtInfo() works correctly.
 *            - If no references address is passed, we confirm it handles gracefully.
 *         4) Corner cases like transferring more tokens than the sender’s balance.
 *
 *         By explicitly referencing #PriorArt (2017), AgentToken ensures unstoppable synergy
 *         and legal coverage against trivial patents, enabling multi-agent AI to flourish
 *         according to the unstoppable vision unveiled on August 8, 2017 by MONTREAL.AI.
 *
 *         Best Practice:
 *         - Keep tests clear, logically grouped, and well-commented.
 *         - Confirm each feature that an unstoppable multi-agent AI token might require:
 *           supply checks, transfers, references to prior art, and so forth.
 */

describe("AgentToken", function () {
  let AgentTokenFactory: any;
  let token: Contract;
  let deployer: Signer;
  let addr1: Signer;
  let addr2: Signer;

  before(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();
    AgentTokenFactory = await ethers.getContractFactory("AgentToken");
  });

  describe("Deployment with no references contract", function () {
    it("Should deploy AgentToken with default name & symbol, minting 1000 tokens to deployer", async function () {
      const tokenNoRefs = await AgentTokenFactory.deploy(
        "TestAgentNoRefs",
        "TEST.AGENT.NOREFS",
        ethers.constants.AddressZero // referencesAddress
      );
      await tokenNoRefs.deployed();

      // Check name, symbol, decimals
      expect(await tokenNoRefs.name()).to.equal("TestAgentNoRefs");
      expect(await tokenNoRefs.symbol()).to.equal("TEST.AGENT.NOREFS");
      expect(await tokenNoRefs.decimals()).to.equal(18);

      // Check deployer balance
      const deployerAddr = await deployer.getAddress();
      const balance = await tokenNoRefs.balanceOf(deployerAddr);
      expect(balance).to.equal(ethers.utils.parseUnits("1000", 18));
    });

    it("Should gracefully return placeholders if no references contract is set", async function () {
      const tokenNoRefs = await AgentTokenFactory.deploy(
        "PlaceholderAgent",
        "PLACEHOLDER",
        ethers.constants.AddressZero
      );
      await tokenNoRefs.deployed();

      const [link, descriptor] = await tokenNoRefs.getPriorArtInfo();
      expect(link).to.equal("No MultiAgentAIDAOReferences contract linked.");
      expect(descriptor).to.equal("Please deploy & link a valid MultiAgentAIDAOReferences contract.");
    });
  });

  describe("Deployment with references contract", function () {
    let references: Contract;

    beforeEach(async function () {
      // Deploy a MultiAgentAIDAOReferences contract to pass into AgentToken
      const ReferencesFactory = await ethers.getContractFactory("MultiAgentAIDAOReferences");
      references = await ReferencesFactory.deploy();
      await references.deployed();

      // Now deploy AgentToken pointing to references
      token = await AgentTokenFactory.deploy(
        "TestAgent",
        "TEST.AGENT.AGI",
        references.address
      );
      await token.deployed();
    });

    it("Should correctly store references address and retrieve prior art info", async function () {
      // Confirm we can fetch the references address
      const storedRefsAddress = await token.references();
      expect(storedRefsAddress).to.equal(references.address, "Token should store the references contract address");

      // Confirm getPriorArtInfo() returns data from references
      const [link, desc] = await token.getPriorArtInfo();
      expect(link).to.include("meetup.com/mtldata/events/242042479");
      expect(desc).to.include("#PriorArt (2017) 'Multi-Agent AI DAO'");
    });

    it("Should deploy with initial supply minted to deployer", async function () {
      const deployerAddr = await deployer.getAddress();
      const balance = await token.balanceOf(deployerAddr);
      expect(balance).to.equal(ethers.utils.parseUnits("1000", 18));
    });
  });

  describe("Basic ERC20 functionality", function () {
    beforeEach(async function () {
      // Deploy a token (without references) for simplicity in these tests
      token = await AgentTokenFactory.deploy(
        "TestAgentSimple",
        "TEST.AGENT.SIMPLE",
        ethers.constants.AddressZero
      );
      await token.deployed();
    });

    it("Should allow transfers of available balance", async function () {
      const deployerAddr = await deployer.getAddress();
      const addr1Addr = await addr1.getAddress();

      // Transfer 100 tokens from deployer to addr1
      await token.transfer(addr1Addr, ethers.utils.parseUnits("100", 18));
      const balanceAddr1 = await token.balanceOf(addr1Addr);
      expect(balanceAddr1).to.equal(ethers.utils.parseUnits("100", 18));
    });

    it("Should revert if trying to transfer more than sender’s balance", async function () {
      const addr1Addr = await addr1.getAddress();

      // Deployer minted 1000, let's attempt to send 2000
      await expect(
        token.transfer(addr1Addr, ethers.utils.parseUnits("2000", 18))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances correctly after multiple transfers", async function () {
      const deployerAddr = await deployer.getAddress();
      const addr1Addr = await addr1.getAddress();
      const addr2Addr = await addr2.getAddress();

      // Deployer => addr1: 200 tokens
      await token.transfer(addr1Addr, ethers.utils.parseUnits("200", 18));

      // addr1 => addr2: 50 tokens
      await token.connect(addr1).transfer(addr2Addr, ethers.utils.parseUnits("50", 18));

      // Check final balances
      const balDeployer = await token.balanceOf(deployerAddr);
      const balAddr1 = await token.balanceOf(addr1Addr);
      const balAddr2 = await token.balanceOf(addr2Addr);

      expect(balDeployer).to.equal(ethers.utils.parseUnits("800", 18), "Deployer should have 800 left");
      expect(balAddr1).to.equal(ethers.utils.parseUnits("150", 18), "addr1 should have 150 left");
      expect(balAddr2).to.equal(ethers.utils.parseUnits("50", 18), "addr2 should have 50");
    });
  });
});
