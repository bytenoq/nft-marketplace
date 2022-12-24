require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
  },
  solidity: "0.8.9",
};