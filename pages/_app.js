import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'

function MyApp({ Component, pageProps }) {

  const [address, setAddress] = useState([''])

  useEffect(() => {
    connect()
  }, [])

  async function connect() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
    });

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
  }

  return (
    <div>
      <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-black">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <img src="logo.png" width="24" height="24" class="d-inline-block align-text-top" />
            AegeanSea
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/mint">Mint</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/buy">Buy</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/list">List</a>
              </li>
            </ul>
          </div>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item border">
                <a class="nav-link" href={"https://etherscan.io/address/"+address}>{address}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp