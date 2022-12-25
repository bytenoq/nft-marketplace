// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title NFT Marketplace
/// @author Giorgos Kriaras
/// @notice Mint, buy & list NFTs
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

    event nftTransfer (
        uint256 indexed id,
        address owner,
        uint256 price,
        bool sold
    );

    /// @notice Mint an NFT on the marketplace
    function mintNFT(string memory uri) public payable returns (uint256) {
        _nftsAll++;
        uint256 id = _nftsAll;

        _mint(msg.sender, id);
        _setTokenURI(id, uri);

        idToNFT[id] = NFT (
            id,
            payable(msg.sender),
            0,
            true
        );

        return id;
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

        emit nftTransfer (
            id,
            msg.sender,
            price,
            false
        );
    }

    /// @notice Cancel listing of an NFT
    function cancelListing(uint256 id) public {
        require(idToNFT[id].owner == msg.sender, "Only the owner can cancel listing");
        require(idToNFT[id].sold == false, "NFT must be for sale");

        idToNFT[id].price = 0;
        idToNFT[id].sold = true;
        
        _transfer(address(this), msg.sender, id);
    }

    /// @notice Fetch all NFTs of the contract
    function fetchAllNFTs() public view returns (NFT[] memory) {
        uint256 index = 0;

        NFT[] memory nfts = new NFT[](_nftsAll);
        for(uint256 i = 0; i < _nftsAll; i++) {
            uint256 id = i + 1;
            NFT storage currentNFT = idToNFT[id];
            nfts[index] = currentNFT;
            index +=1;
        }

        return nfts;
    }

    /// @notice Fetch unsold NFTs of the contract
    function fetchUnsoldNFTs() public view returns (NFT[] memory) {
        uint256 index = 0;
        uint256 nftsUnsold = 0;

        for(uint256 i = 0; i< _nftsAll; i++) {
            if(idToNFT[i+1].sold == false)
                nftsUnsold++;
        }

        NFT[] memory nfts = new NFT[](nftsUnsold);
        for(uint256 i = 0; i < _nftsAll; i++) {
            if(idToNFT[i+1].sold == false) {
                uint256 id = i + 1;
                NFT storage currentNFT = idToNFT[id];
                nfts[index] = currentNFT;
                index +=1;
            }
        }

        return nfts;
    }

    /// @notice Fetch sold NFTs of the contract
    function fetchSoldNFTs() public view returns (NFT[] memory) {
        uint256 index = 0;
        uint256 nftsSold = 0;

        for(uint256 i = 0; i< _nftsAll; i++) {
            if(idToNFT[i+1].sold == true)
                nftsSold++;
        }

        NFT[] memory nfts = new NFT[](nftsSold);
        for(uint256 i = 0; i < _nftsAll; i++) {
            if(idToNFT[i+1].sold == true) {
                uint256 id = i + 1;
                NFT storage currentNFT = idToNFT[id];
                nfts[index] = currentNFT;
                index +=1;
            }
        }

        return nfts;
    }
}