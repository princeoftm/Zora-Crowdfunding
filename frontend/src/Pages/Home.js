import React, { useState, useEffect } from 'react';
// Assuming ethers is available globally via a script tag or installed as a dependency
import { ethers } from 'ethers'; // If using npm/yarn install
import { Link } from 'react-router-dom';
import Mint from './mint';

// Placeholder for your contract's ABI and Address
// IMPORTANT: Replace these with your actual deployed contract's details.
// Make sure to get the COMPLETE and CORRECT ABI from your compiled contract,
// including all ERC721 functions like `tokenURI`.
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


function ViewContent({ navigateTo }) { // Receive navigateTo as a prop
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    // New state to track paid content for the current session
    const [paidContent, setPaidContent] = useState({}); // { contentIdRaw: true/false }

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            setStatusMessage('Fetching content...');
            if (!window.ethereum) {
                setStatusMessage('MetaMask or a compatible wallet is not detected. Cannot fetch content.');
                setLoading(false);
                return;
            }

            try {
                // Connect to a provider (e.g., MetaMask's provider or a public RPC)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

                // Fetch all ContentRegistered events
                // For a production app, you might want to fetch events in chunks or use a backend indexer.
                // Using a block range from 0 to 'latest' to get all historical events.
                const events = await contract.queryFilter(contract.filters.ContentRegistered(), 0, 'latest');

                const fetchedVideos = [];

                for (const event of events) {
                    try {
                        const { contentId, price, contentOwner, tokenId } = event.args;

                        // Get the token URI for the NFT
                        const tokenURI = await contract.tokenURI(tokenId);
                        const ipfsGatewayUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');

                        // Fetch the metadata JSON from IPFS
                        const metadataRes = await fetch(ipfsGatewayUrl);
                        if (!metadataRes.ok) {
                            console.warn(`Failed to fetch metadata for tokenId ${tokenId} from ${ipfsGatewayUrl}`);
                            continue; // Skip this one if metadata can't be fetched
                        }
                        const metadata = await metadataRes.json();

                        // Check if it's a video (has animation_url)
                        if (metadata.animation_url) {
                            // Safely parse contentId or display raw if parsing fails
                            let displayContentId = contentId;
                            try {
                                displayContentId = ethers.utils.parseBytes32String(contentId);
                            } catch (e) {
                                // If parsing fails (e.g., non-printable chars), display a truncated raw version
                                console.warn(`Could not parse bytes32 contentId ${contentId} to string:`, e);
                                displayContentId = `${contentId.substring(0, 8)}...${contentId.substring(contentId.length - 8)}`;
                            }

                            fetchedVideos.push({
                                contentIdRaw: contentId, // The bytes32 raw ID used for contract calls
                                contentId: displayContentId, // The display-friendly ID
                                price: ethers.utils.formatEther(price), // Convert Wei to Ether
                                contentOwner: contentOwner,
                                tokenId: tokenId.toString(),
                                name: metadata.name,
                                description: metadata.description,
                                imageUrl: metadata.image ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : "https://placehold.co/300x200/cccccc/000000?text=No+Image",
                                videoUrl: metadata.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                            });
                        }
                    } catch (innerError) {
                        console.error(`Error processing event for content:`, event, innerError);
                        setStatusMessage(`Error processing some content: ${innerError.message}`);
                    }
                }

                setVideos(fetchedVideos);
                setStatusMessage(`Found ${fetchedVideos.length} video(s).`);

            } catch (error) {
                console.error("Error fetching content:", error);
                setStatusMessage(`Error fetching content: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []); // Empty dependency array means this runs once on mount

    const handleViewContent = async (contentIdRaw, priceInEth) => {
        setStatusMessage(`Attempting to view content for ${ethers.utils.parseBytes32String(contentIdRaw)}...`);
        if (!window.ethereum) {
            setStatusMessage('MetaMask is not detected. Please install it to view content.');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Convert price from Ether to Wei for the transaction value
            const priceInWei = ethers.utils.parseEther(priceInEth);

            const tx = await contract.viewContent(contentIdRaw, { value: priceInWei });
            setStatusMessage(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
            const receipt = await tx.wait();
            setStatusMessage(`Content viewed successfully! Transaction confirmed: ${receipt.transactionHash}`);
            console.log("View Content Transaction Receipt:", receipt);

            // Mark this content as paid in the local state
            setPaidContent(prev => ({ ...prev, [contentIdRaw]: true }));

        } catch (error) {
            console.error("Error viewing content:", error);
            setStatusMessage(`Failed to view content: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-inter">
            {/* Load ethers.js from CDN if not already available */}
            <script src="https://cdn.ethers.io/5.7.2/ethers.umd.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-purple-400 mb-8">All Pay-Per-View Videos</h2>
				<Link to="/mint">
                <button
                    className="mb-6 w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out shadow-md transform hover:scale-105"
                >
                    Mint New Content
                </button>
				</Link>
                {loading && (
                    <div className="text-center text-blue-400 text-lg">
                        <p>{statusMessage}</p>
                        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                    </div>
                )}

                {!loading && statusMessage && (
                    <div className={`mt-6 p-4 rounded-lg text-sm ${statusMessage.includes('Error') || statusMessage.includes('failed') ? 'bg-red-800 text-red-200' : 'bg-blue-800 text-blue-200'}`}>
                        <p className="font-medium">Status:</p>
                        <p>{statusMessage}</p>
                    </div>
                )}

                {!loading && videos.length === 0 && !statusMessage.includes('Error') && (
                    <div className="text-center text-gray-400 text-lg mt-8">
                        <p>No videos found. Try minting some content first!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {videos.map((video) => {
                        const isPaid = paidContent[video.contentIdRaw];
                        return (
                            <div key={video.tokenId} className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600 flex flex-col">
                                <h3 className="text-xl font-semibold text-purple-300 mb-2 truncate">{video.name}</h3>
                                <p className="text-gray-300 text-sm mb-2 line-clamp-2">{video.description}</p>

                                <div className="relative w-full h-48 rounded-lg mb-4 overflow-hidden">
                                    {video.videoUrl ? (
                                        <>
                                            <video
                                                controls={isPaid} // Only show controls if paid
                                                className={`w-full h-full object-cover transition-all duration-500 ${isPaid ? 'filter-none' : 'filter blur-lg'}`}
                                                src={video.videoUrl}
                                                type="video/mp4" // Assuming MP4 for simplicity
                                                // Preload metadata to allow play/pause without full load
                                                preload="metadata"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                            {!isPaid && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center text-lg font-bold">
                                                    Video Blurred (Pay to View)
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <img src={video.imageUrl} alt={video.name} className="w-full h-full object-cover rounded-lg" />
                                    )}
                                </div>

                                <div className="text-sm text-gray-400 mb-2">
                                    <p><strong>Content ID:</strong> {video.contentId}</p>
                                    <p><strong>Price:</strong> {video.price} ETH</p>
                                    {/* Apply flex and truncate to the owner address */}
                                    <p className="flex items-center">
                                        <strong>Owner:</strong> <span className="ml-1 truncate">{video.contentOwner}</span>
                                    </p>
                                    <p><strong>Token ID:</strong> {video.tokenId}</p>
                                </div>

                                {!isPaid ? (
                                    <button
                                        onClick={() => handleViewContent(video.contentIdRaw, video.price)}
                                        className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition duration-300 ease-in-out shadow-md transform hover:scale-105"
                                    >
                                        View Content (Pay {video.price} ETH)
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-white bg-green-700 cursor-not-allowed"
                                    >
                                        Content Unlocked!
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default ViewContent;
