import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { NFTMarketplaceAddress } from '../config'

export default function List() {
  const [loading, setLoading] = useState(['loading'])
  const [nfts, setNFTs] = useState(['not-loaded'])
  const [price, setPrice] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchSoldNFTs()

    const myNFTs = await Promise.all(data.map(async i => {
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

    setNFTs(myNFTs)
    setLoading('loaded')
  }

  async function listNFT(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    const signer = provider.getSigner()
    const contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, signer)

    const ethPrice = ethers.utils.parseUnits(price.toString(), 'ether')
    const transaction  = await contract.listNFT(nft.id, ethPrice, {
      value: price
    })

    await transaction.wait()
    router.push('/buy')
  }

  if (loading === 'loaded' && !nfts.length) return (
    <div class="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <p class="text-center">This user does not own any NFT</p>
    </div>
  )

  return (

    <section class="pt-2 pb-2">
      <div class="container">
        <div class="row pt-5">
          <div class="col-12">
            <h3 class="border-bottom mb-4">List an NFT on the marketplace</h3>
          </div>
        </div>
        <div class="row">
        {
          nfts.map((nft, i) => (
            <div class="col-lg-4 mb-3 d-flex">
              <div class="card">
                <div class="card-header bg-light">
                  <div key={i}>
                    <img src={nft.image} class="card-img-top"/>
                  </div>
                </div>
                <div class="card-body d-flex flex-column bg-light rounded">
                  <h5 class="card-title">{nft.name}</h5>
                  <p class="card-text">{nft.description}</p>
                  <div class="row">
                    <label class="col-sm-2 col-form-label">ETH</label>
                    <div class="col-sm-10">
                      <input
                        placeholder="Price"
                        class="form-control"
                        type="number"
                        min="0"
                        required
                        onChange={e => setPrice(e.target.value)}
                      />
                    </div>
                    <p></p>
                  </div>
                  <div>
                    <button className="mt-auto btn input-block-level form-control btn-primary" onClick={() => listNFT(nft)}>List NFT</button>
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