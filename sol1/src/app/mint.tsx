import { useState } from 'react';
import { useChainId, usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import axios from 'axios';

export default function MintWithZora() {
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { address } = useAccount();
    const { writeContract } = useWriteContract();

    const [videoFile, setVideoFile] = useState(null);
    const [previewImageFile, setPreviewImageFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMDAyZTUxYS0yMjdmLTRlOTctOTcxZC0xODg1ODc4MDM4NWYiLCJlbWFpbCI6InJhb2FuaXJ1ZGRoOTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRhMDQ0ZmI5MTM2YmZiMWNlNDM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDc5N2I3Yzc5OTcyNDBmYjQ5YzdkZTAzMzlmNDNiMmRiYjAwODhiMmJkMGFlNTg0NWU3MTkxOTI5YWY2YjZhNiIsImV4cCI6MTc4MzA5MzE5M30.r3pfs_P6Gdhl0OeZCzcVHffb0ABEgvJs7Uq1ErNNmiw';  // ⚠️ Secure in env file

    const uploadToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: { 'Authorization': `Bearer ${PINATA_JWT}` }
        });

        return res.data.IpfsHash;
    };

    const handleMint = async () => {
        if (!publicClient || !address) return alert("Connect your wallet");

        setUploading(true);

        try {
            // Upload files to IPFS
            const videoCid = await uploadToPinata(videoFile);
            const imageCid = await uploadToPinata(previewImageFile);

            // Upload metadata
            const metadata = {
                name,
                description,
                image: `ipfs://${imageCid}`,
                animation_url: `ipfs://${videoCid}`
            };

            const metaRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
                headers: { 'Authorization': `Bearer ${PINATA_JWT}` }
            });

            const tokenURI = `ipfs://${metaRes.data.IpfsHash}`;
            console.log("Metadata Token URI:", tokenURI);

            // Mint with Zora Protocol
            const collectorClient = createCollectorClient({ chainId, publicClient });

            // Replace with your deployed Zora contract address and correct mintType
            const { prepareMint } = await collectorClient.getToken({
                tokenContract: '0xYourZoraContractAddressHere',
                mintType: '721',  // or '721' depending on your collection
                tokenId: 1n  // optional, depends on mint type
            });

            const { parameters, costs } = prepareMint({
                minterAccount: address,
                quantityToMint: 1n
            });

            console.log("Mint cost breakdown:", costs);

            writeContract(parameters);

        } catch (err) {
            console.error(err);
            alert("Error during minting");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Mint Your Video NFT on Zora</h2>
            {/* Inputs for name, description, video, image */}
            <button onClick={handleMint} disabled={uploading}>
                {uploading ? 'Minting...' : 'Upload & Mint'}
            </button>
        </div>
    );
}
