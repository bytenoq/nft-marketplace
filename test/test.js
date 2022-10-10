describe("NFTMarketplace", function () {

  it("Should mint, list & buy NFTs", async function () {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftmarketplace = await NFTMarketplace.deploy()
    await nftmarketplace.deployed()

    await nftmarketplace.mintNFT(/*url, price*/)
    await nftmarketplace.mintNFT(/*url, price*/)

    const [_, user1, user2] = await hre.ethers.getSigners()

    // await network.provider.send("hardhat_setBalance", [
    //   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    //   "0xc6c0c100fa8c00",
    // ]);

    // await nftmarketplace.connect(user1).buyNFT(1)
    // await nftmarketplace.connect(user1).listNFT(1, 7)
    // await nftmarketplace.connect(user2).buyNFT(1)
    // await nftmarketplace.connect(user2).buyNFT(2)

    const balance0ETH = await nftmarketplace.provider.getBalance(user1.address);
    console.log('balance: ', balance0ETH.toString())

    allNFTs = await nftmarketplace.fetchAllNFTs()
    allNFTs = await Promise.all(allNFTs.map(async i => {
      const uri = await nftmarketplace.tokenURI(i.id)
      let nft = {
        uri,
        id: i.id.toString(),
        owner: i.owner,
        price: i.price.toString()
      }
      return nft
    }))

    console.log('NFTs: ', allNFTs)
  });
})