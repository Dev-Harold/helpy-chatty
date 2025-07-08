'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
  
type QuickAction = {
  short: string;
  long: string;
}

export default function Home() {
  const router = useRouter()
  const [message, setMessage] = useState('')

  const quickActions: QuickAction[] = [
    { short: "Computer won't start.", long: "My computer won't start. Can you help?" },
    { short: "Printer not working.", long: "My printer is not working. How can I fix this?" },
    { short: "Sending an email.", long: "I am having problems with sending an email. Can you help?" },
    { short: "Software installation help.", long: "How can I download software?" },
    { short: "Computer running slow.", long: "My computer is running slow and lagging. Can you help?" },
    { short: "Forgot my password.", long: "I forgot my password. How can I reset it?" },
    { short: "Texting on phone.", long: "I am having problems with texting on my phone. Can you help?" },
    { short: "Taking photos with a phone.", long: "I am having problems with taking photos with my phone. Can you help?" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message submitted:', message)
    const chatId = uuidv4()
    const encodedMessage = encodeURIComponent(message)
    router.push(`/chat/${chatId}?message=${encodedMessage}`)
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[500px]">
              <div className="text-center flex-1 mb-6 lg:mb-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Quick, Easy, & Free Tech Support.</h2>
                <br />
                <br />
                <br />
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Online assistance for ANY of your electronics.</h2>
              </div>
              <div className="image-container block flex-shrink-0 lg:ml-6 m-1">
                <Image 
                  src="/Electronics.jpeg" 
                  alt="Tech Support" 
                  width={750}
                  height={750}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl text-gray-800 mb-2 text-center underline" style={{ fontSize: '2.5rem' }}>Get Started</h2>
            <br />
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
              <h1 className="text-2xl text-gray-800 mb-2 text-center underline"  style={{ fontSize: '1.5rem' }}>Or choose from a common problem:</h1>
              <div className="flex flex-wrap gap-2 border-2 border-gray-300 rounded-lg p-4">
                {quickActions.map((action) => (
                  <button
                    key={action.short}
                    type="button"
                    onClick={() => setMessage(action.long)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-base transition-colors"
                  >
                    {action.short}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </main>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </>
  )
}
