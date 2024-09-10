import { TronWeb } from '../tronweb'

let tronWeb: TronWeb | undefined

if (typeof window !== 'undefined') {
  tronWeb = (window as Window & { tronWeb?: TronWeb }).tronWeb
}

console.log('TronWeb initialized')

export const createNewWallet = async (): Promise<{ address: string; privateKey: string }> => {
  if (!tronWeb) {
    throw new Error('TronWeb not initialized')
  }
  console.log('Creating new wallet...')
  const account = await tronWeb.createAccount()
  console.log('New wallet created:', account.address.base58)
  return {
    address: account.address.base58,
    privateKey: account.privateKey,
  }
}

export const initiateTronTransaction = async (token: string, amount: string, toAddress: string): Promise<string> => {
  if (!tronWeb) {
    throw new Error('TronWeb not initialized')
  }
  console.log('Initiating transaction...')
  console.log('Token:', token, 'Amount:', amount, 'Receiver:', toAddress)
  
  let transaction: { txid: string }

  if (token === 'TRX') {
    transaction = await tronWeb.trx.sendTransaction(toAddress, tronWeb.toSun(amount))
  } else {
    const contract = await tronWeb.contract().at(token)
    transaction = await contract.transfer(toAddress, amount).send()
  }

  console.log('Transaction initiated:', transaction.txid)
  return transaction.txid
}