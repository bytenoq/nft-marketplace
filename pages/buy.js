import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { NFTMarketplaceAddress } from '../config'

export default function Buy() {
  const [loading, setLoading] = useState(['loading'])
  const [nfts, setNFTs] = useState(['not-loaded'])
  const router = useRouter()

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchUnsoldNFTs()

    const unsoldNFTs = await Promise.all(data.map(async i => {
      const uri = await contract.tokenURI(i.id)
      const meta = await axios.get(uri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      let nft = {
        id: i.id.toNumber(),
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image,
        owner: i.owner,
        price
      }
      return nft
    }))

    setNFTs(unsoldNFTs)
    setLoading('loaded')
  }

  async function buyNFT(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    const signer = provider.getSigner()
    const contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction  = await contract.buyNFT(nft.id, {
      value: price
    })

    await transaction.wait()
    router.push('/list')
  }

  if (loading === 'loaded' && !nfts.length) return (
    <div class="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <p class="text-center">There are no NFTs to buy from the marketplace</p>
    </div>
  )

  return (
    <section class="pt-2 pb-2">
      <div class="container">
        <div class="row pt-5">
          <div class="col-12">
            <h3 class="border-bottom mb-4">Buy an NFT from the marketplace</h3>
          </div>
        </div>
        <div class="row">
        {
          nfts.map((nft, i) => (
            <div class="col-lg-4 mb-3 d-flex">
              <div class="card rounded">
                <div class="card-header bg-light">
                  <div key={i}>
                    <img src={nft.image} class="card-img-top"/>
                  </div>
                </div>
                <div class="card-body d-flex flex-column bg-light rounded-bottom">
                  <h5 class="card-title">{nft.name}</h5>
                  <p class="card-text">{nft.description}</p>
                  <h6 class="card-text">{nft.price} ETH</h6>
                  <div>
                    <button className="mt-auto btn input-block-level form-control btn-primary" onClick={() => buyNFT(nft)}>Buy NFT</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </section>
  )
}