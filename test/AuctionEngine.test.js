const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AuctionEngine', () => {
  let owner, seller, buyer, auction;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    const AuctionEngine = await ethers.getContractFactory(
      'AuctionEngine',
      owner
    );
    auction = await AuctionEngine.deploy();
    await auction.deployed();
  });

  it('sets owner', async () => {
    const currentOwner = await auction.owner();
    expect(currentOwner).to.eq(owner.address);
  });

  const getTimestamp = async (blockNumber) => {
    return (await ethers.provider.getBlock(blockNumber)).timestamp;
  };

  it('create auction correctly', async () => {
    const duration = 60;
    const tx = await auction.createAuction(
      ethers.utils.parseEther('0.001'),
      3,
      'fake',
      duration
    );
    const currentAuction = await auction.auctions(0);
    const ts = await getTimestamp(tx.blockNumber);
    expect(currentAuction.endsAt).to.eq(ts + duration);
  });
});
