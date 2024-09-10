'use client'

import { useWallet } from '../hooks/useWallet'

export default function TronLinkConnector() {
  const { address, connectWallet } = useWallet()

  return (
    <div className="flex flex-col items-center gap-4">
      {address ? (
        <p className="text-sm text-white bg-green-500 px-4 py-2 rounded-full">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out"
        >
          Connect TronLink
        </button>
      )}
    </div>
  )
}