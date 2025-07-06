// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC-721 standard for NFTs
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Import OpenZeppelin's Counters utility for safe incrementing of token IDs

/**
 * @title ZoraPayPerView
 * @dev A smart contract for a pay-per-view system on the Zora Network that also
 * mints an NFT for each registered content item.
 * Content owners can register content with a price, users can pay to access it,
 * and the owner can withdraw the accumulated funds.
 * Each registered content piece will have a unique NFT associated with it.
 */
contract ZoraPayPerView is ERC721URIStorage { // Inherit from ERC721 to enable NFT functionality
    // Use OpenZeppelin's Counters library for managing unique token IDs
    
    uint _tokenIdCounter; // Counter for unique NFT token IDs

    // The address of the contract owner, who can register content and withdraw funds.
    address public owner;

    // A mapping to store content details: contentId => (price, owner, tokenId)
    // For simplicity, contentId can be a hash of the content, a unique string, or an arbitrary ID.
    // The price is in Wei (the smallest unit of Ether).
    struct Content {
        uint256 price;
        address payable contentOwner; // The address that receives payment for this content
        bool exists; // To check if the content ID has been registered
        uint256 tokenId; // New: Stores the ID of the NFT minted for this content
    }

    // Mapping from content ID (bytes32) to its Content struct.
    mapping(bytes32 => Content) public contents;

    // Event emitted when new content is registered.
    event ContentRegistered(bytes32 indexed contentId, uint256 price, address indexed contentOwner, uint256 indexed tokenId);

    // Event emitted when content is 'viewed' (paid for).
    event ContentViewed(bytes32 indexed contentId, address indexed viewer, uint256 amountPaid);

    // Event emitted when funds are withdrawn by the contract owner.
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor: Initializes the ERC721 contract with a name and symbol,
     * and sets the deployer of the contract as the owner.
     * @param _name The name of the NFT collection (e.g., "Zora PPV Content").
     * @param _symbol The symbol of the NFT collection (e.g., "ZPPVC").
     */
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to restrict functions to the contract owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    /**
     * @dev Registers new content with a specified price and mints a unique NFT for it.
     * Only the contract owner can register content.
     * @param _contentId A unique identifier for the content (e.g., a hash, a unique string converted to bytes32).
     * @param _price The price in Wei that users must pay to view this content.
     * @param _contentOwner The address that will receive the payment for this specific content.
     * This allows different content owners to register content on the same contract.
     * @param _tokenURI The URI pointing to the NFT's metadata (e.g., IPFS hash of a JSON file).
     */
    function registerContent(
        bytes32 _contentId,
        uint256 _price,
        address payable _contentOwner,
        string memory _tokenURI
    ) public onlyOwner {
        require(!contents[_contentId].exists, "Content ID already registered");
        require(_price > 0, "Price must be greater than zero");
        require(_contentOwner != address(0), "Content owner address cannot be zero");

        // Increment the token ID counter to get a new unique ID for the NFT
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;

        // Mint the new NFT to the specified content owner
        _mint(_contentOwner, newItemId);
        // Set the token URI for the newly minted NFT, linking it to its metadata
        _setTokenURI(newItemId, _tokenURI);

        // Store the content details, including the new NFT's token ID
        contents[_contentId] = Content({
            price: _price,
            contentOwner: _contentOwner,
            exists: true,
            tokenId: newItemId // Associate the minted NFT with this content
        });

        // Emit an event indicating that content has been registered and an NFT minted
        emit ContentRegistered(_contentId, _price, _contentOwner, newItemId);
    }

    /**
     * @dev Allows a user to 'view' content by paying its specified price.
     * The payment is forwarded to the content owner.
     * @param _contentId The unique identifier of the content to view.
     */
    function viewContent(bytes32 _contentId) public payable {
        Content storage content = contents[_contentId];
        require(content.exists, "Content ID does not exist");
        require(msg.value >= content.price, "Insufficient payment to view content");

        // Transfer the payment to the content owner.
        // Using call for robustness, but handle its return value.
        (bool success, ) = content.contentOwner.call{value: msg.value}("");
        require(success, "Failed to send Ether to content owner");

        emit ContentViewed(_contentId, msg.sender, msg.value);
    }

    /**
     * @dev Allows the contract owner to withdraw any remaining funds in the contract.
     * This is useful if there are any accidental transfers to the contract address
     * that are not associated with specific content payments.
     */
    function withdrawContractBalance() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw from contract balance");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw contract balance");

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @dev Fallback function to receive Ether.
     * This allows the contract to receive Ether even if no specific function is called.
     * It's good practice to have this, especially for contracts that receive payments.
     */
    receive() external payable {
        // Optionally, you could add logic here to handle unexpected direct Ether transfers,
        // e.g., log them or revert if not intended. For this simple contract, we just allow it.
    }
}
