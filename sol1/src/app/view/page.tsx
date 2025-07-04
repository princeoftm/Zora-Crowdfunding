"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PinataFilesViewer() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ⚠️ Secure this in an environment variable in a real application
    const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMDAyZTUxYS0yMjdmLTRlOTctOTcxZC0xODg1ODc4MDM4NWYiLCJlbWFpbCI6InJhb2FuaXJ1ZGRoOTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRhMDQ0ZmI5MTM2YmZiMWNlNDM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDc5N2I3Yzc5OTcyNDBmYjQ5YzdkZTAzMzlmNDNiMmRiYjAwODhiMmJkMGFlNTg0NWU3MTkxOTI5YWY2YjZhNiIsImV4cCI6MTc4MzA5MzE5M30.r3pfs_P6Gdhl0OeZCzcVHffb0ABEgvJs7Uq1ErNNmiw';

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Pinata API endpoint to query pinned files
                const url = `https://api.pinata.cloud/data/pinList?status=pinned`;

                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${PINATA_JWT}`
                    }
                });

                // The list of files is in response.data.rows
                setFiles(response.data.rows);

            } catch (err) {
                console.error("Error fetching files from Pinata:", err);
                setError("Failed to fetch files. Check your JWT or network connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, []); // The empty array [] means this effect runs once when the component mounts

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return <div>Loading your files from Pinata...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>My Uploaded Pinata Files</h2>
            <p>Showing all content currently pinned to your account.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>CID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Size</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Date Pinned</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{file.metadata.name || 'No Name'}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Click to view file"
                                >
                                    {`${file.ipfs_pin_hash.substring(0, 8)}...${file.ipfs_pin_hash.substring(file.ipfs_pin_hash.length - 8)}`}
                                </a>
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatBytes(file.size)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(file.date_pinned)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {files.length === 0 && <p>You have not pinned any files yet.</p>}
        </div>
    );
}