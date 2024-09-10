'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import SendingTimeline from '../components/SendingTimeline'
import { TronUtilsWrapperType } from '../components/TronUtilsWrapper'

function SendingPageContent() {
  const searchParams = useSearchParams()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [newWalletPrivateKey, setNewWalletPrivateKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const email = searchParams?.get('email') ?? ''
  const amount = searchParams?.get('amount') ?? ''
  const token = searchParams?.get('token') ?? ''

  console.log('SendingPage initialized with params:', { email, amount, token })

  const processingRef = useRef(false);

  const processSending = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    if (!email || !amount || !token) {
      setError('Missing required parameters')
      processingRef.current = false;
      return
    }

    try {
      console.log('Starting sending process...')
      setCurrentPhase(1)

      const utils = await import('../components/TronUtilsWrapper').then(mod => mod.default) as TronUtilsWrapperType

      // Phase 1: Create new wallet
      console.log('Phase 1: Creating new wallet')
      const { address, privateKey } = await utils.createNewWallet()
      setNewWalletAddress(address)
      setNewWalletPrivateKey(privateKey)
      console.log('New wallet created:', { address, privateKey })

      // Phase 2: Initiate transaction
      setCurrentPhase(2)
      console.log('Phase 2: Initiating transaction')
      try {
        const txId = await utils.initiateTronTransaction(token, amount, address)
        console.log('Transaction initiated:', txId)
      } catch (txError) {
        console.error('Error initiating transaction:', txError)
        setError(`Failed to initiate transaction: ${txError instanceof Error ? txError.message : 'Unknown error'}`)
        setCurrentPhase(0)
        processingRef.current = false;
        return
      }

      // Phase 3: TronLink confirmation (handled by TronLink)
      setCurrentPhase(3)
      console.log('Phase 3: Waiting for TronLink confirmation')
      // Wait for transaction confirmation (you may need to implement a polling mechanism here)

      // Phase 4: Send confirmation email
      setCurrentPhase(4)
      console.log('Phase 4: Sending confirmation email')
      try {
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
          throw new Error(`Failed to send email: ${await response.text()}`)
        }
        console.log('Confirmation email sent')
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        setError(`Failed to send confirmation email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`)
        setCurrentPhase(0)
        processingRef.current = false;
        return
      }

      // Complete
      setCurrentPhase(5)
      console.log('Sending process completed successfully')
    } catch (error) {
      console.error('Error during sending process:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setCurrentPhase(0)
    } finally {
      processingRef.current = false;
    }
  }, [email, amount, token])

  useEffect(() => {
    processSending()
  }, [processSending])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Error</h1>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    )
  }

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

export default function SendingPage() {
  return <SendingPageContent />
}
