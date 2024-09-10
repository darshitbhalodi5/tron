'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import SendingTimeline from '../components/SendingTimeline'
import { TronUtilsWrapperType } from '../components/TronUtilsWrapper'

const DynamicTronUtils = dynamic<React.ComponentType<{}>>(
  () => import('../components/TronUtilsWrapper'),
  { ssr: false }
)

export default function SendingPage() {
  const searchParams = useSearchParams()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [newWalletPrivateKey, setNewWalletPrivateKey] = useState('')

  const email = searchParams?.get('email') ?? ''
  const amount = searchParams?.get('amount') ?? ''
  const token = searchParams?.get('token') ?? ''

  console.log('SendingPage initialized with params:', { email, amount, token })

  useEffect(() => {
    const processSending = async () => {
      if (!email || !amount || !token) {
        console.error('Missing required parameters')
        return
      }

      try {
        console.log('Starting sending process...')

        const utils = await import('../components/TronUtilsWrapper').then(mod => mod.default) as TronUtilsWrapperType

        // Phase 1: Create new wallet
        setCurrentPhase(1)
        console.log('Phase 1: Creating new wallet')
        const { address, privateKey } = await utils.createNewWallet()
        setNewWalletAddress(address)
        setNewWalletPrivateKey(privateKey)
        console.log('New wallet created:', address)

        // Phase 2: Initiate transaction
        setCurrentPhase(2)
        console.log('Phase 2: Initiating transaction')
        const txId = await utils.initiateTronTransaction(token, amount, address)
        console.log('Transaction initiated:', txId)

        // Phase 3: TronLink confirmation (handled by TronLink)
        setCurrentPhase(3)
        console.log('Phase 3: Waiting for TronLink confirmation')
        // Wait for transaction confirmation (you may need to implement a polling mechanism here)

        // Phase 4: Send confirmation email
        setCurrentPhase(4)
        console.log('Phase 4: Sending confirmation email')
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            address,
            privateKey,
            amount,
            token,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to send email: ${errorData.message}`)
        }
        console.log('Confirmation email sent')

        // Complete
        setCurrentPhase(5)
        console.log('Sending process completed successfully')
      } catch (error) {
        console.error('Error during sending process:', error)
        // Handle error state
      }
    }

    processSending()
  }, [email, amount, token])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Sending Tokens</h1>
        <SendingTimeline currentPhase={currentPhase} />
        {currentPhase === 5 && (
          <div className="mt-8 text-center">
            <p className="text-green-600 font-semibold">Transaction complete!</p>
            <p className="mt-2">An email has been sent to {email} with the transaction details.</p>
          </div>
        )}
      </div>
    </div>
  )
}