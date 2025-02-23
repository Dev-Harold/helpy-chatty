'use client'

import Navbar from '@/components/Navbar'
import Review from '@/components/Review'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
const reviews = [
  {
    image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    message: "Good Site",
    author: "Harold Richards"
  },
  {
    image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    message: "Awesome Site",
    author: "Phillipe"
  },
  {
    image: "https://mysterymtg.com/cdn/shop/files/f15c8803-f33a-4530-9882-bff1bf810c19_800x.jpg?v=1724909693",
    message: "Doggo :D",
    author: "Yoshimaru"
  }
  
]
type QuickAction = {
  short: string;
  long: string;
}

export default function Home() {
  const router = useRouter()
  const [showReviews, setShowReviews] = useState(true)
  const [message, setMessage] = useState('')

  const quickActions: QuickAction[] = [
    { short: "Computer won't start.", long: "My computer won't start. Can you help?" },
    { short: "Printer not working.", long: "My Printer is not working. How can I fix this?" },
    { short: "Email problems.", long: "I am having problems with my Email. Can you help?" },
    { short: "Software installation help.", long: "How can I download Software?" },
    { short: "Computer running slow.", long: "My Computer running slow and lagging. Can you help?" },
    { short: "Forgot my password.", long: "I forgot my password. How can I reset it?" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message submitted:', message)
    router.push(`/chat/${uuidv4()}`)
  }

  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="text-2xl font-bold text-gray-900 text-center">
              Something not working? Need help with a tech problem? Get Live Help Now! ⬇
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your problem..."
                className="w-full p-3 pr-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-lg"
                required
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                aria-label="Send message"
              >
                Chat Now
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Click a prompt below to help you get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.short}
                    type="button"
                    onClick={() => setMessage(action.long)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {action.short}
                  </button>
                ))}
              </div>
            </div>
          </form>
          
          <button 
            onClick={() => setShowReviews(!showReviews)}
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showReviews ? 'Hide Reviews' : 'Show Reviews'}
          </button>

          {showReviews && (
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {reviews.map((review) => (
                <div key={review.author} className="flex-1 min-w-[300px] max-w-[500px]">
                  <Review {...review} />
                </div>
              ))}
            </div>
          )}
          <p>Will this line move?</p>
        </div>
      </main>
    </>
  )
}
