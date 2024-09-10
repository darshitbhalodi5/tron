'use client'

import { useTokenList } from '../hooks/useTokenList'
import { useWallet } from '../hooks/useWallet'

export default function TokenBalance() {
  const { tokens } = useTokenList()
  const { address } = useWallet()

  if (!address) {
    return <p className="text-gray-600 italic">Please connect your wallet to view token balances.</p>
  }

  if (tokens.length === 0) {
    return <p className="text-gray-600 italic">Loading token balances...</p>
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tokens.map((token) => (
          <li key={token.address} className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{token.symbol}</span>
            <span className="text-sm text-gray-500">{parseFloat(token.balance).toFixed(6)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}