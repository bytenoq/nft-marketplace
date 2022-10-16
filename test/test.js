describe("NFTMarketplace", function () {

  it("Should mint, list & buy NFTs", async function () {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftmarketplace = await NFTMarketplace.deploy()
    await nftmarketplace.deployed()

    // await nftmarketplace.mintNFT("https://img.seadn.io/files/9a317c060230fee1d19059f3380cae88.png", 2)
    // await nftmarketplace.mintNFT("https://img.seadn.io/files/30b75129421c0eceda8830dd0997c104.png", 5)

    const [_, user1, user2] = await hre.ethers.getSigners()

    // await network.provider.send("hardhat_setBalance", [
    //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
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