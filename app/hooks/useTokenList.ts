import { useState, useEffect } from 'react'
import { useWallet } from './useWallet'
import { TronWeb } from '../tronweb'

interface Token {
  symbol: string
  name: string
  decimals: number
  tokenAddress: string
}

export function useTokenList(): Token[] {
  const { tronWeb, address } = useWallet()
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const fetchTokens = async () => {
      if (tronWeb && address) {
        try {
          // Fetch TRC20 token list
          const tokenList = await (tronWeb as TronWeb).trx.getAccount(address)
          const trc20Tokens = tokenList.trc20 || []

          const formattedTokens: Token[] = await Promise.all(
            Object.keys(trc20Tokens).map(async (tokenAddress) => {
              const contract = await (tronWeb as TronWeb).contract().at(tokenAddress)
              const symbol = await contract.symbol().call()
              const name = await contract.name().call()
              const decimals = await contract.decimals().call()

              return {
                symbol,
                name,
                decimals: parseInt(decimals),
                tokenAddress,
              }
            })
          )

          setTokens([
            { symbol: 'TRX', name: 'TRON', decimals: 6, tokenAddress: '' },
            ...formattedTokens,
          ])
        } catch (error) {
          console.error('Error fetching token list:', error)
        }
      }
    }

    fetchTokens()
  }, [tronWeb, address])

  return tokens
}