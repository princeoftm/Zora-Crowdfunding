"use client";

import { useState } from 'react';
import axios from 'axios';

export default function UploadToPinata() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // ⚠️ Secure this in an environment variable in a real application
    const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMDAyZTUxYS0yMjdmLTRlOTctOTcxZC0xODg1ODc4MDM4NWYiLCJlbWFpbCI6InJhb2FuaXJ1ZGRoOTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRhMDQ0ZmI5MTM2YmZiMWNlNDM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDc5N2I3Yzc5OTcyNDBmYjQ5YzdkZTAzMzlmNDNiMmRiYjAwODhiMmJkMGFlNTg0NWU3MTkxOTI5YWY2YjZhNiIsImV4cCI6MTc4MzA5MzE5M30.r3pfs_P6Gdhl0OeZCzcVHffb0ABEgvJs7Uq1ErNNmiw';

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    'Authorization': `Bearer ${PINATA_JWT}`
                }
            });

            const ipfsHash = res.data.IpfsHash;
            console.log("File uploaded successfully. IPFS Hash:", ipfsHash);
            alert(`Upload successful! IPFS Hash: ${ipfsHash}`);

        } catch (err) {
            console.error("Error uploading file:", err);
            alert("Error during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload a File to Pinata</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload to Pinata'}
            </button>
        </div>
    );
}