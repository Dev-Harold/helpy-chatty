'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-3xl">💻</span>
              <div className="text-white font-black text-2xl ml-3 font-bold">Helpy Chatty</div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your AI-powered support assistant that helps you get answers quickly and efficiently. 
              Get instant help with your questions and technical issues.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:support@helpychatty.com" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Email Support"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/chat" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
