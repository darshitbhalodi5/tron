'use client'

import { useState, useEffect } from 'react'
import { useTokenList } from '../hooks/useTokenList'
import { useWallet } from '../hooks/useWallet'

interface TokenWithBalance {
  symbol: string
  name: string
  decimals: number
  tokenAddress: string
  balance: string
}

export function useTokenBalance() {
  const tokens = useTokenList()
  const { tronWeb, address } = useWallet()
  const [tokensWithBalance, setTokensWithBalance] = useState<TokenWithBalance[]>([])

  useEffect(() => {
    const fetchBalances = async () => {
      if (!tronWeb || !address || tokens.length === 0) return

      const updatedTokens = await Promise.all(tokens.map(async (token) => {
        let balance = '0'
        if (token.symbol === 'TRX') {
          const account = await tronWeb.trx.getAccount(address)
          balance = tronWeb.fromSun(account.balance || '0')
        } else {
          const contract = await tronWeb.contract().at(token.tokenAddress)
          const result = await contract.balanceOf(address).call()
          balance = tronWeb.toBigNumber(result).dividedBy(10 ** token.decimals).toString()
        }
        return { ...token, balance }
      }))

      setTokensWithBalance(updatedTokens)
    }

    fetchBalances()
  }, [tokens, tronWeb, address])

  return { tokensWithBalance }
}

export default function TokenBalance() {
  const { tokensWithBalance } = useTokenBalance()
  const { address } = useWallet()

  if (!address) {
    return <p>Please connect your wallet to view token balances.</p>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Token Balances</h2>
      {tokensWithBalance.length === 0 ? (
        <p>Loading token balances...</p>
      ) : (
        <ul>
          {tokensWithBalance.map((token) => (
            <li key={token.tokenAddress} className="mb-2 text-black">
              <span className="font-medium">{token.symbol}:</span> {token.balance} {token.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}