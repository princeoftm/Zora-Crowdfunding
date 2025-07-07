import React, { useState } from 'react';
// Assuming ethers is available globally via a script tag or installed as a dependency
import { ethers } from 'ethers'; 
import { Link } from 'react-router-dom';

// Placeholder for your contract's ABI and Address
// IMPORTANT: Replace these with your actual deployed contract's details
const CONTRACT_ADDRESS = "0xa01c73Fbd74AAb10e0FceAfd374245cE92045225"; // e.g., "0xAbCdEf12345..."
const CONTRACT_ABI = [
    
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "contentId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "contentOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ContentRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "contentId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "viewer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountPaid",
				"type": "uint256"
			}
		],
		"name": "ContentViewed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "contents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "contentOwner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_contentId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_contentOwner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_tokenURI",
				"type": "string"
			}
		],
		"name": "registerContent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_contentId",
				"type": "bytes32"
			}
		],
		"name": "viewContent",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawContractBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

function Mint() {
    // Pinata JWT for authentication. Keep this secure in a real application (e.g., environment variable).
    const pinata_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMDAyZTUxYS0yMjdmLTRlOTctOTcxZC0xODg1ODc4MDM4NWYiLCJlbWFpbCI6InJhb2FuaXJ1ZGRoOTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3ZjlhZmI3OTJmZTIwMzY1ZDRiIiwic2NvcGVkS2V5U2VjcmV0IjoiM2YxODA3MzY5NmVmZjI4M2MyNThmMDk0OTM1M2UwZWE3OTE1OWZlYmU1YzEyNjFhNzMwY2Q0NTk3MzFlYzAzMSIsImV4cCI6MTc4MzMyMDI1MX0.1DAIJK844U-mtCxa-Q1nnsU57vrQw5uKLnbkAg3C2lo";
    const [contentId, setContentId] = useState('');
    const [price, setPrice] = useState(''); // Price in Ether
    const [contentOwner, setContentOwner] = useState('');
    const [mediaFile, setMediaFile] = useState(null); // Changed from imageFile to mediaFile
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [nftTokenId, setNftTokenId] = useState(null);

    // Function to upload a file to Pinata
    const uploadFileToPinata = async (file) => {
        try {
            setStatusMessage(`Uploading ${file.type.startsWith('image') ? 'image' : 'video'} to Pinata...`);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${pinata_jwt}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                // Improved error message: stringify the entire errorData object
                throw new Error(`Pinata file upload failed: ${JSON.stringify(errorData)}`);
            }

            const resData = await res.json();
            const ipfsHash = resData.IpfsHash;
            console.log("Media uploaded to Pinata:", `ipfs://${ipfsHash}`);
            setStatusMessage(`Media uploaded: ipfs://${ipfsHash}`);
            return `ipfs://${ipfsHash}`;
        } catch (error) {
            console.error("Error uploading file to Pinata:", error);
            setStatusMessage(`Error uploading media: ${error.message}`);
            throw error; // Re-throw to be caught by the calling function
        }
    };

    // Function to upload JSON metadata to Pinata
    const uploadJsonToPinata = async (json) => {
        try {
            setStatusMessage('Uploading metadata to Pinata...');
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${pinata_jwt}`,
                },
                body: JSON.stringify(json),
            });

            if (!res.ok) {
                const errorData = await res.json();
                // Improved error message: stringify the entire errorData object
                throw new Error(`Pinata JSON upload failed: ${JSON.stringify(errorData)}`);
            }

            const resData = await res.json();
            const ipfsHash = resData.IpfsHash;
            console.log("Metadata uploaded to Pinata:", `ipfs://${ipfsHash}`);
            setStatusMessage(`Metadata uploaded: ipfs://${ipfsHash}`);
            return `ipfs://${ipfsHash}`;
        } catch (error) {
            console.error("Error uploading JSON to Pinata:", error);
            setStatusMessage(`Error uploading metadata: ${error.message}`);
            throw error;
        }
    };

    // Function to handle the minting process
    const handleMint = async () => {
        setLoading(true);
        setStatusMessage('Starting minting process...');
        setNftTokenId(null);

        if (!window.ethereum) {
            setStatusMessage('MetaMask or a compatible wallet is not detected. Please install it.');
            setLoading(false);
            return;
        }

        if (!mediaFile) { // Changed from imageFile to mediaFile
            setStatusMessage('Please select an image or video file.');
            setLoading(false);
            return;
        }

        if (!contentId || !price || !contentOwner) {
            setStatusMessage('Please fill in all content details.');
            setLoading(false);
            return;
        }

        try {
            // 1. Upload media (image or video) to Pinata
            const mediaIpfsHash = await uploadFileToPinata(mediaFile);
            const mediaGatewayUrl = `https://ipfs.io/ipfs/${mediaIpfsHash.replace('ipfs://', '')}`;

            // 2. Prepare NFT metadata
            const nftMetadata = {
                name: `Zora PPV Content: ${contentId}`,
                description: `This NFT grants access to exclusive content identified by ${contentId} on the Zora Network.`,
                attributes: [
                    { trait_type: "Content ID", value: contentId },
                    { trait_type: "Price (ETH)", value: price },
                    { trait_type: "Content Owner", value: contentOwner },
                    { trait_type: "Media Type", value: mediaFile.type.startsWith('image') ? 'Image' : 'Video' }
                ],
            };

            // Conditionally set 'image' and 'animation_url' based on media type
            if (mediaFile.type.startsWith('image')) {
                nftMetadata.image = mediaGatewayUrl;
            } else if (mediaFile.type.startsWith('video')) {
                // For videos, 'image' can be a placeholder/thumbnail, and 'animation_url' points to the video
                // For simplicity, we'll use the video itself as the 'image' if no separate thumbnail is provided.
                // In a real app, you might upload a separate thumbnail and use it for 'image'.
                nftMetadata.image = "https://placehold.co/500x500/cccccc/000000?text=Video+Content"; // Placeholder thumbnail
                nftMetadata.animation_url = mediaGatewayUrl;
            }


            // 3. Upload metadata to Pinata
            const metadataIpfsHash = await uploadJsonToPinata(nftMetadata);
            const tokenURI = `ipfs://${metadataIpfsHash.replace('ipfs://', '')}`; // Use ipfs:// for the contract

            // 4. Interact with the smart contract
            setStatusMessage('Connecting to wallet and minting NFT...');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        	if (accounts.length === 0) {
            	setStatusMessage('Please connect your MetaMask account to proceed.');
            	return;
        	}
            const signer = provider.getSigner();

            // Convert contentId string to bytes32
            // Ensure contentId is 32 bytes. If shorter, it will be padded. If longer, it will be truncated.
            // For a robust solution, you might want to hash the contentId string.
            const contentIdBytes32 = ethers.utils.formatBytes32String(contentId);

            // Convert price from Ether to Wei
            const priceInWei = ethers.utils.parseEther(price);

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Call the registerContent function on your smart contract
            const tx = await contract.registerContent(
                contentIdBytes32,
                priceInWei,
                contentOwner,
                tokenURI
            );

            setStatusMessage(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
            const receipt = await tx.wait();
            setStatusMessage(`NFT minted successfully! Transaction confirmed in block ${receipt.blockNumber}.`);
            console.log("Transaction Receipt:", receipt);

            // Parse the ContentRegistered event to get the tokenId
            const contentRegisteredEvent = receipt.events?.find(e => e.event === 'ContentRegistered');
            if (contentRegisteredEvent) {
                const mintedTokenId = contentRegisteredEvent.args.tokenId.toString();
                setNftTokenId(mintedTokenId);
                setStatusMessage(`NFT minted successfully! Token ID: ${mintedTokenId}. Transaction: ${tx.hash}`);
            } else {
                setStatusMessage(`NFT minted successfully! Transaction: ${tx.hash}. Could not find Token ID.`);
            }

        } catch (error) {
            console.error("Error during minting process:", error);
            setStatusMessage(`Minting failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-inter">
            {/* Load ethers.js from CDN if not already available */}
            <script src="https://cdn.ethers.io/5.7.2/ethers.umd.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-purple-400 mb-8">Mint Zora PPV Content NFT</h2>
                <Link to="/">
                    <button                     className="mb-6 w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out shadow-md transform hover:scale-105">Go to Home page</button>
                </Link>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="contentId" className="block text-sm font-medium text-gray-300 mb-1">
                            Content ID (Unique Identifier)
                        </label>
                        <input
                            type="text"
                            id="contentId"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                            placeholder="e.g., my-exclusive-video-001"
                            value={contentId}
                            onChange={(e) => setContentId(e.target.value)}
                            disabled={loading}
                        />
                        <p className="mt-1 text-xs text-gray-400">This will be converted to bytes32 for the contract.</p>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                            Price (in ETH)
                        </label>
                        <input
                            type="number"
                            id="price"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                            placeholder="e.g., 0.01"
                            step="0.0001"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="contentOwner" className="block text-sm font-medium text-gray-300 mb-1">
                            Content Owner Address
                        </label>
                        <input
                            type="text"
                            id="contentOwner"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                            placeholder="e.g., 0x..."
                            value={contentOwner}
                            onChange={(e) => setContentOwner(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-300 mb-1">
                            NFT Media File (Image or Video)
                        </label>
                        <input
                            type="file"
                            id="mediaFile" // Changed ID to mediaFile
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer"
                            accept="image/*,video/*" // Now accepts both images and videos
                            onChange={(e) => setMediaFile(e.target.files[0])} // Changed state setter
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleMint}
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 ease-in-out
                            ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg transform hover:scale-105'}`}
                    >
                        {loading ? 'Minting NFT...' : 'Mint NFT'}
                    </button>
                </div>

                {statusMessage && (
                    <div className={`mt-6 p-4 rounded-lg text-sm ${statusMessage.includes('Error') || statusMessage.includes('failed') ? 'bg-red-800 text-red-200' : 'bg-blue-800 text-blue-200'}`}>
                        <p className="font-medium">Status:</p>
                        <p>{statusMessage}</p>
                    </div>
                )}

                {nftTokenId && (
                    <div className="mt-6 p-4 rounded-lg bg-green-800 text-green-200 text-sm">
                        <p className="font-medium">Minting Successful!</p>
                        <p>NFT Token ID: <span className="font-bold">{nftTokenId}</span></p>
                        <p>You can view this NFT on a Zora block explorer or NFT marketplace once indexed.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mint;
