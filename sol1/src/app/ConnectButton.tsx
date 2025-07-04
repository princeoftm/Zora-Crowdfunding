'use client';

import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa'; // Using react-icons for a wallet icon

export default function ConnectButton() {
  const [account, setAccount] = useState<string | null>(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  // Display connected account address (shortened)
  if (account) {
    return (
      <div className="rounded-full bg-green-500/20 px-6 py-3 text-base font-semibold text-green-300">
        Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
      </div>
    );
  }

  // Display connect button
  return (
    <button
      onClick={connectWallet}
      className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-200"
    >
      <FaWallet className="h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
      Connect Wallet
    </button>
  );
}

// Add this interface to your project, often in a `globals.d.ts` file
declare global {
  interface Window {
    ethereum?: any;
  }
}