'use client'

import Navbar from '@/components/Navbar'
import Review from '@/components/Review'
import Link from 'next/link'
import { useState } from 'react'

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

export default function Home() {
  const [showReviews, setShowReviews] = useState(true)

  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                Something not working? Need help with a tech problem? Get Live Help Now! ➡
              </div>
              <Link href="/chat">
                <button className="chat-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors h-[140px] text-2xl border-[3px] border-black">
                  Chat Now
                </button>
              </Link>
            </div>
          </div>
          
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
