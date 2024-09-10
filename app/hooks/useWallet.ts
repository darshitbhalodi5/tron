import { useState, useEffect, useCallback } from 'react'
import { TronWeb } from '../tronweb'

export function useWallet() {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const checkTronLink = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        setTronWeb(window.tronWeb)
        setAddress(window.tronWeb.defaultAddress.base58)
      }
    }

    checkTronLink()
    window.addEventListener('message', (e: MessageEvent) => {
      if (e.data.message && e.data.message.action === 'setAccount') {
        checkTronLink()
      }
    })
  }, [])

  const connectWallet = async () => {
    if (window.tronWeb) {
      try {
        await window.tronWeb.request({ method: 'tron_requestAccounts' })
        setTronWeb(window.tronWeb)
        setAddress(window.tronWeb.defaultAddress.base58)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install TronLink extension')
    }
  }

  const sendTransaction = useCallback(async (/* ... params ... */) => {
    console.log('sendTransaction called');
    // ... existing transaction logic ...
  }, [/* ... dependencies ... */]);

  return { tronWeb, address, connectWallet, sendTransaction }
}