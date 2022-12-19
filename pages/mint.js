import { create } from 'ipfs-http-client'
import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { NFTMarketplaceAddress } from '../config'

const IPFS_PROJECT_ID = process.env.IPFS_PROJECT_ID
const IPFS_API_KEY_SECRET = process.env.IPFS_API_KEY_SECRET

console.log(IPFS_PROJECT_ID)
console.log(IPFS_API_KEY_SECRET)
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
  const [price, setPrice] = useState('')
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
    if (!name || !description || !price || !file) return
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
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, signer)
    const ethPrice = ethers.utils.parseUnits(price, 'ether')
    let transaction = await contract.mintNFT(uri, ethPrice)
    await transaction.wait()
    router.push('/')
  }

  return (
    <div class="d-flex justify-content-center text-center">
      <div class="form-group col-md-4">
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
        <div class="form-group row">
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
        </div>
        <br></br>
        <input
          type="file"
          name="File"
          class="form-control"
          onChange={imageToIPFS}
        />
        <br></br>
        <button onClick={mint} class="btn btn-primary">
          Mint NFT
        </button>
        <p></p>
        <img
          class="form-control-file"
          src={file}
        />
      </div>
    </div>
  )
}