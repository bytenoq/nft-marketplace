require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {ETH_API_KEY, ETH_API_KEY_SECRET} = process.env;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${ETH_API_KEY}`,
      accounts: [`${ETH_API_KEY_SECRET}`]
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${ETH_API_KEY}`,
      accounts: [`${ETH_API_KEY_SECRET}`]
    }
  },
  solidity: "0.8.9",
};