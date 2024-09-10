import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { useCallback } from 'react'

const phases = [
  { id: 1, name: 'Create New Wallet' },
  { id: 2, name: 'Initiate Transaction' },
  { id: 3, name: 'TronLink Confirmation' },
  { id: 4, name: 'Send Confirmation Email' },
]

export default function SendingTimeline({ currentPhase }: { currentPhase: number }) {
  const handleSendClick = useCallback(() => {
    // Add logging to check if this is called multiple times
    console.log('handleSendClick called');

    // ... existing send logic ...
  }, [/* ... dependencies ... */]);

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {phases.map((phase, phaseIdx) => (
          <li key={phase.id}>
            <div className="relative pb-8">
              {phaseIdx !== phases.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      currentPhase >= phase.id ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {currentPhase > phase.id ? (
                      <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : currentPhase === phase.id ? (
                      <ClockIcon className="h-5 w-5 text-white animate-spin" aria-hidden="true" />
                    ) : (
                      <span className="text-white">{phase.id}</span>
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className={`text-sm font-medium ${currentPhase >= phase.id ? 'text-gray-900' : 'text-gray-500'}`}>
                      {phase.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}