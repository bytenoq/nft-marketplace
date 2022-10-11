## Requirements
1. Node.js
2. MetaMask

## Installation
1. Clone the project, change into the directory and install dependencies
```bash
git clone https://github.com/bytenoq/nft-marketplace
cd nft-marketplace
npm install
```
2. Start local HardHat node
```bash
npx hardhat node
```
3. Deploy the contracts
```bash
npx hardhat run scripts/deploy.js --network localhost
```
4. Run the development server:
```bash
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
