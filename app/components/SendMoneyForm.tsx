'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '../hooks/useWallet'
import TokenBalance, { useTokenBalance } from './TokenBalance'

export default function SendMoneyForm() {
	const router = useRouter()
	const { tronWeb, address } = useWallet()
	const [recipient, setRecipient] = useState('')
	const [amount, setAmount] = useState('')
	const [selectedToken, setSelectedToken] = useState('')
	const { tokensWithBalance } = useTokenBalance()
	const [emailError, setEmailError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		// Implement your send money logic here
		
		// Navigate to the /sending page with query parameters
		const queryParams = new URLSearchParams({
			email: recipient,
			amount: amount,
			token: selectedToken
		}).toString()
		
		router.push(`/sending?${queryParams}`)
	}

	const validateEmail = (email: string) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		return re.test(String(email).toLowerCase())
	}

	const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const email = e.target.value
		setRecipient(email)
		if (email && !validateEmail(email)) {
			setEmailError('Please enter a valid email address')
		} else {
			setEmailError('')
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
						Recipient Email
					</label>
					<input
						type="email"
						id="recipient"
						value={recipient}
						onChange={handleRecipientChange}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						required
					/>
					{emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
				</div>
				<div>
					<label htmlFor="amount" className="block text-sm font-medium text-gray-700">
						Amount
					</label>
					<input
						type="number"
						id="amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						required
					/>
				</div>
				<div>
					<label htmlFor="token" className="block text-sm font-medium text-gray-700">
						Token
					</label>
					<select
						id="token"
						value={selectedToken}
						onChange={(e) => setSelectedToken(e.target.value)}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						required
					>
						<option value="">Select a token</option>
						{tokensWithBalance && tokensWithBalance.length > 0 ? (
							tokensWithBalance.map((token) => (
								<option key={token.tokenAddress} value={token.symbol}>
									{token.symbol}
								</option>
							))
						) : (
							<option value="" disabled>Loading tokens...</option>
						)}
					</select>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
					disabled={!!emailError || !recipient || !amount || !selectedToken}
				>
					Send
				</button>
			</form>
		</div>
	)
}