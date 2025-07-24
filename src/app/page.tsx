'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
  
type QuickAction = {
  short: string;
  long: string;
}

export default function Home() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea up to 3 lines, then scroll
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const computed = window.getComputedStyle(textarea)
      let lineHeight = parseFloat(computed.lineHeight)
      if (isNaN(lineHeight)) lineHeight = 28 // fallback for text-lg + leading-[28px]
      const paddingTop = parseFloat(computed.paddingTop)
      const paddingBottom = parseFloat(computed.paddingBottom)
      const borderTop = parseFloat(computed.borderTopWidth)
      const borderBottom = parseFloat(computed.borderBottomWidth)
      const maxLines = 2
      const maxHeight = lineHeight * maxLines + paddingTop + paddingBottom + borderTop + borderBottom
      const minHeight = lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
      const calculatedHeight = Math.max(Math.min(textarea.scrollHeight, maxHeight), minHeight)
      textarea.style.height = calculatedHeight + 'px'
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
  }, [message])

  const quickActions: QuickAction[] = [
    { short: "Computer won't start", long: "My computer won't start. Can you help?" },
    { short: "Printer not working", long: "My printer is not working. How can I fix this?" },
    { short: "Sending an email", long: "I am having problems with sending an email. Can you help?" },
    { short: "Software installation help", long: "How can I download software?" },
    { short: "Computer running slow", long: "My computer is running slow and lagging. Can you help?" },
    { short: "Forgot my password", long: "I forgot my password. How can I reset it?" },
    { short: "Texting on phone", long: "I am having problems with texting on my phone. Can you help?" },
    { short: "Taking photos with a phone", long: "I am having problems with taking photos with my phone. Can you help?" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const chatId = uuidv4()
    const encodedMessage = encodeURIComponent(message)
    router.push(`/chat/${chatId}?message=${encodedMessage}`)
  }

  const handleQuickAction = (action: QuickAction) => {
    const chatId = uuidv4()
    const encodedMessage = encodeURIComponent(action.long)
    router.push(`/chat/${chatId}?message=${encodedMessage}`)
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg mb-4 flex flex-col lg:flex-row items-center justify-center overflow-hidden">
                         <div className="text-center flex-1 min-h-[300px] md:min-h-[500px] bg-cover bg-center bg-no-repeat relative flex items-center" style={{ backgroundImage: 'url(/Electronics.jpeg)' }}>
              <motion.div 
                className="absolute inset-0 bg-black/70 md:bg-black/0 md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              ></motion.div>
              <motion.div 
                className="relative z-10 p-6 md:max-w-[50%] flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2 md:text-4xl mb-8 md:mb-16">Quick, Easy, & Free Tech Support.</h2>
                <h2 className="text-2xl font-bold text-white mb-2 md:text-4xl">Online assistance for ANY of your devices.</h2>
              </motion.div>
            </div>
          <div className="flex flex-col gap-4 items-center min-w-[40%] p-6">
            <h1 className="text-lg italic  md:text-2xl text-gray-800 mb-2 text-center">Describe your problem to get started:</h1>
            <div className="flex-1 w-full flex">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your problem here..."
                className="w-full md:min-h-[250px] p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-lg resize-none leading-[28px]"
                required
                rows={1}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition-colors text-sm md:text-lg font-semibold whitespace-nowrap h-full md:mt-12"
              aria-label="Send message"
            >
              Chat Now
            </button>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            
            
            <div className="mt-4">
              <h1 className="text-lg italic  md:text-2xl text-gray-800 mb-2 text-center">Or choose from a common problem below:</h1>
              <div className="flex flex-wrap gap-2 border-2 border-gray-300 rounded-lg p-4 justify-center">
                {quickActions.map((action) => (
                  <button
                    key={action.short}
                    type="button"
                    onClick={() => handleQuickAction(action)}
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
      <Footer />
    </>
  )
}
