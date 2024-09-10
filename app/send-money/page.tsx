import SendMoneyForm from '../components/SendMoneyForm'
import TokenBalance from '../components/TokenBalance'
import TronLinkConnector from '../components/TronLinkConnector'

export default function SendMoney() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Send Token</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 bg-blue-600">
            <TronLinkConnector />
          </div>
          <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Tokens</h2>
              <SendMoneyForm />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Balances</h2>
              <TokenBalance />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}