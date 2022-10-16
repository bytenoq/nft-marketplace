import { create } from 'ipfs-http-client'
import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { NFTMarketplaceAddress } from '../config'

const IPFS_PROJECT_ID = process.env.IPFS_PROJECT_ID
const IPFS_API_KEY_SECRET = process.env.IPFS_API_KEY_SECRET
const auth = `Basic ${Buffer.from(`${IPFS_PROJECT_ID}:${IPFS_API_KEY_SECRET}`).toString('base64')}`
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

export default function Mint() {
  const [form, setForm] = useState({ name: '', description: '', price: ''})
  const [file, setFile] = useState('')
  const router = useRouter()

  async function upload(e) {
    const file = e.target.files[0]
    try {
      const response = await ipfs.add(file)
      const url = `https://ipfs.infura.io/ipfs/${response.path}`
      setFile(url)
    } catch (e) {
      console.log(e)
    }
  }
    
  async function create() {
    const { name , description, price } = form
    if(!name || !description || !file || !price) return
    const metadata = JSON.stringify({name, description, file})
    try {
      const response = await ipfs.add(metadata)
      const uri = `https://ipfs.infura.io/ipfs/${response.path}`
      return uri
    } catch (e) {
      console.log(e)
    }
  }

  async function mint() {
    const uri = await create()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplace.abi, signer)
    const price = ethers.utils.parseUnits(form.price, 'ether')
    let transaction = await contract.mintNFT(uri, price)
    await transaction.wait()
    router.push('/')
  }
    
  return (
    <div class="d-flex justify-content-center text-center">
      <div class="form-group col-md-4">
        <br></br>
        <input
          class="form-control"
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <br></br>
        <textarea
          class="form-control"
          placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <br></br>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">ETH</label>
          <div class="col-sm-10">
            <input
              class="form-control"
              placeholder="Price"
              type="number"
              min="0"
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>
        <br></br>
        <input
          class="form-control"
          type="file"
          onChange={upload}
        />
        <img
            class="form-control-file"
            src={file}
        />
        <br></br>
        <button
          onClick={mint}
          class="btn btn-primary">
          Mint NFT
        </button>
      </div>
    </div>
  )
}