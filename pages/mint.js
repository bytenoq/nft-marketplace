import { create } from 'ipfs-http-client'
import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { NFTMarketplaceAddress } from '../config'

const IPFS_PROJECT_ID = process.env.IPFS_PROJECT_ID
const IPFS_API_KEY_SECRET = process.env.IPFS_API_KEY_SECRET

const auth = `${IPFS_PROJECT_ID}:${IPFS_API_KEY_SECRET}`

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
  },
})

export default function Mint() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const router = useRouter()

  async function imageToIPFS(e) {
    const file = e.target.files[0]
    try {
      const response = await client.add(file)
      const url = `https://icsd-nft-marketplace.infura-ipfs.io/ipfs/${response.path}`
      client.pin.add(response.path).then((result) => {
      console.log(result)
      setFile(url)
    })
    } catch (e) {
      console.log(e)
    }
  }

  async function uriToIPFS() {
    if (!name || !description || !file) return
    const metadata = JSON.stringify({
      name, description, image: file
    })
    try {
      const response = await client.add(metadata)
      const uri = `https://icsd-nft-marketplace.infura-ipfs.io/ipfs/${response.path}`
      return uri
    } catch (e) {
      console.log(e)
    }  
  }

  async function mint() {
    const uri = await uriToIPFS()
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    const signer = provider.getSigner()
    let contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, signer)
    let transaction = await contract.mintNFT(uri)
    await transaction.wait()
    router.push('/list')
  }

  return (
    <section class="vh-100 pt-2 pb-2">
      <div class="container col-md-5">
        <div class="row pt-5">
          <div class="col-12">
            <h3 class="border-bottom mb-2">Mint an NFT on the marketplace</h3>
          </div>
        </div>
        <div class="text-center">
          <div class="form-group">
            <br></br>
            <input 
              placeholder="Name"
              class="form-control"
              required
              onChange={e => setName(e.target.value)}
            />
            <br></br>
            <textarea
              placeholder="Description"
              class="form-control"
              required
              onChange={e => setDescription(e.target.value)}
            />
            <br></br>
            <input
              type="file"
              name="File"
              class="form-control"
              onChange={imageToIPFS}
            />
            <br></br>
            <img
              class="form-control-file img-thumbnail"
              src={file}
            />
            <p></p>
            <button onClick={mint} class="btn btn-primary">
              Mint NFT
            </button>
          </div>
          <p></p>
        </div>
      </div>
    </section>
  )
}