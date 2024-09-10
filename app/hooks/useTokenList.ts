import { useState, useEffect } from 'react'
import { useWallet } from './useWallet'

interface Token {
  address: string
  symbol: string
  balance: string
}

export function useTokenList() {
  const [tokens, setTokens] = useState<Token[]>([])
  const { tronWeb, address } = useWallet()

  useEffect(() => {
    const fetchTokens = async () => {
      if (tronWeb && address) {
        try {
          // Fetch TRC20 token list
          const tokenList = await tronWeb.trx.getAccount(address)
          const trc20Tokens = tokenList.trc20 || []

          const formattedTokens: Token[] = await Promise.all(
            Object.entries(trc20Tokens).map(async ([contractAddress, balance]) => {
              const contract = await tronWeb.contract().at(contractAddress)
              const symbol = await contract.symbol().call()
              return {
                address: contractAddress,
                symbol: symbol,
                balance: tronWeb.fromSun(balance)
              }
            })
          )

          // Add TRX balance
          const trxBalance = await tronWeb.trx.getBalance(address)
          formattedTokens.unshift({
            address: 'TRX',
            symbol: 'TRX',
            balance: tronWeb.fromSun(trxBalance)
          })

          setTokens(formattedTokens)
        } catch (error) {
          console.error('Error fetching token list:', error)
        }
      }
    }

    fetchTokens()
  }, [tronWeb, address])

  return { tokens }
}