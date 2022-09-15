// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title NFT Marketplace
/// @author Giorgos Kriaras
/// @notice Mint, list & buy NFTs
contract NFTMarketplace is ERC721URIStorage {
    uint256 private _nftsAll;
    address public owner;

    constructor() ERC721("AegeanSea", "AEGC") {
        owner = msg.sender;
    }

    struct NFT {
        uint256 id;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => NFT) private idToNFT;

    event nftListed (
        uint256 indexed id,
        address owner,
        uint256 price,
        bool sold
    );

    /// @notice Mint a new NFT
    function mintNFT(string memory tokenURI, uint256 price) public payable returns (uint256) {
        _nftsAll++;
        uint256 id = _nftsAll;

        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        listNFT(id, price);

        return id;
    }

    /// @notice List an NFT on the marketplace
    function listNFT(uint256 id, uint256 price) public payable {
        require(price > 0, "Price must be greater than 0");

        idToNFT[id] = NFT (
            id,
            payable(msg.sender),
            price,
            false
        );

        _transfer(msg.sender, address(this), id);

        emit nftListed (
            id,
            msg.sender,
            price,
            false
        );
    }

    /// @notice Buy an NFT from the marketplace
    function buyNFT(uint256 id) public payable {
        owner = idToNFT[id].owner;
        bool sold = idToNFT[id].sold;

        require(id > 0 && id <= _nftsAll, "NFT must exist");
        require(sold == false, "NFT must be for sale");

        idToNFT[id].owner = payable(msg.sender);
        idToNFT[id].sold = true;

        _transfer(address(this), msg.sender, id);
        payable(owner).transfer(msg.value);
    }
}