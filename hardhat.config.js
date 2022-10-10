require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {API_KEY, PRIVATE_KEY} = process.env;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  solidity: "0.8.9",
};