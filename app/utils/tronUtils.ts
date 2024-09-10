import nodemailer from 'nodemailer'

let tronWeb: any

if (typeof window !== 'undefined') {
  tronWeb = (window as any).tronWeb
}

console.log('TronWeb initialized')

export async function createNewWallet() {
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

export async function initiateTronTransaction(tokenAddress: string, amount: string, receiverAddress: string) {
  if (!tronWeb) {
    throw new Error('TronWeb not initialized')
  }
  console.log('Initiating transaction...')
  console.log('Token:', tokenAddress, 'Amount:', amount, 'Receiver:', receiverAddress)
  
  const fromAddress = tronWeb.defaultAddress.base58
  let transaction

  if (tokenAddress === 'TRX') {
    transaction = await tronWeb.trx.sendTransaction(receiverAddress, tronWeb.toSun(amount))
  } else {
    const contract = await tronWeb.contract().at(tokenAddress)
    transaction = await contract.transfer(receiverAddress, amount).send()
  }

  console.log('Transaction initiated:', transaction.txid)
  return transaction.txid
}