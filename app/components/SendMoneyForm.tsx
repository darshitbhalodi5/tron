'use client'

import { useState } from 'react'
import { useTokenList } from '../hooks/useTokenList'
import { useWallet } from '../hooks/useWallet'
import { useRouter } from 'next/navigation'

export default function SendMoneyForm() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const { tokens } = useTokenList()
  const { address } = useWallet()
  const router = useRouter()

  console.log('SendMoneyForm rendered with tokens:', tokens)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { recipientEmail, amount, selectedToken })
    // Redirect to the sending page with form data
    router.push(`/sending?email=${recipientEmail}&amount=${amount}&token=${selectedToken}`)
  }

  if (!address) {
    console.log('Wallet not connected')
    return <p className="text-gray-600 italic">Please connect your wallet to send tokens.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Recipient Email</label>
        <input
          type="email"
          id="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          placeholder="Enter recipient email"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          placeholder="Enter amount"
          required
        />
      </div>
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700">Select Token</label>
        <select
          id="token"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          required
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Send Token
      </button>
    </form>
  )
}