import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";

import { Fantasia, Fantasia__factory as FantasiaFactory } from "../typechain";

describe("Fantasia Token-- Initialize and Mint", () => {
  let token: Fantasia;
  let tokenFactory: FantasiaFactory;
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture("testbed");

    [deployer, alice] = await ethers.getSigners();
    tokenFactory = await ethers.getContractFactory("Fantasia");
    token = await tokenFactory.deploy();
    await token.deployed();
    await token.initialize(
      deployer.address,// Owner
      "pretendUri.com", // baseUri
      "Fantasia", // name
      "FAN", // symbol
      "NFT memorabilia for live performances" // description
    );

    // grant Admin role
    await token.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN")),
      deployer.address
    );
  });

  it("Should revert functions if contract not initialized", async () => {
    const tokenV2
      = await tokenFactory.deploy();

    await expect(
      tokenV2.grantRole(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN")),
        deployer.address
      )
    ).to.be.reverted;
  });

  it("Should not initialize with a 0 address as the default admin", async () => {
    const tokenV2
      = await tokenFactory.deploy();
    await expect(
      tokenV2.initialize(
        ethers.constants.AddressZero,// Owner
        "pretendUri.com", // baseUri
        "Fantasia", // name
        "FAN", // symbol
        "NFT memorabilia for live performances" // description
      )
    ).to.be.revertedWithCustomError(token, "CannotUseAddressZero");
  });

  it("Should not allow initialize to be called twice", async () => {
    await expect(
      token.initialize(
        deployer.address,// Owner
        "pretendUri.com", // baseUri
        "Fantasia", // name
        "FAN", // symbol
        "NFT memorabilia for live performances" // description
      )
    ).to.be.revertedWith("Initializable: contract is already initialized");
  });

  it("Should set the baseURI, name, symbol, and description on deployment", async () => {
    expect(await token.baseUri()).to.eq("pretendUri.com");
    expect(await token.name()).to.eq("Fantasia");
    expect(await token.symbol()).to.eq("FAN");
    expect(await token.description()).to.eq("NFT memorabilia for live performances");
  });

  it("Should grant default admin role on deployment", async () => {
    expect(await token.hasRole("0x0000000000000000000000000000000000000000000000000000000000000000", deployer.address)).to.be.true;
  });

  it("Should update base URI", async () => {
    await token.updateBaseUri("newUri.com");
    expect(await token.baseUri()).to.equal("newUri.com")
  });

  it("Should protect functions with onlyRole(ADMIN)", async () => {
    await expect(token.connect(alice).updateBaseUri("alice.com")).to.be.reverted;
  })

  it("Should mint a token", async () => {
    const aliceInitBalance = await token.balanceOf(alice.address, 1);
    await token.mint(alice.address, 1, 1, []);
    const aliceNewBalance = await token.balanceOf(alice.address, 1);

    expect(aliceNewBalance).to.eq(aliceInitBalance.add(1));
  });

  it("Should mint token batches", async () => {
    const aliceToken1InitBalance = await token.balanceOf(alice.address, 1);
    const aliceToken2InitBalance = await token.balanceOf(alice.address, 2);
    await token.mintBatch(alice.address, [1, 2,], [10, 50], []);
    const aliceToken1NewBalance = await token.balanceOf(alice.address, 1);
    const aliceToken2NewBalance = await token.balanceOf(alice.address, 2);

    expect(aliceToken1NewBalance).to.eq(aliceToken1InitBalance.add(10));
    expect(aliceToken2NewBalance).to.eq(aliceToken2InitBalance.add(50));
  });

  it("Should return token URI with JSON", async () => {
    expect(await token.uri(1)).to.eq("pretendUri.com/1.json");
    expect(await token.uri(2)).to.eq("pretendUri.com/2.json");
  });
});