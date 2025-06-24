'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navigation-bar h-[30px] w-full bg-gradient-to-r from-blue-600 to-blue-800 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <Link href="/" className="logo-icon flex items-center">
          <span className="text-2xl">💻</span>
          <div className="text-black font-black text-2xl ml-3 font-bold">Helpy Chatty</div>
        </Link>

        {/* Regular Navigation Links */}
        <div className="navigation-links">
          <Link href="/what" className="text-black text-2xl hover:text-gray-700">
            What?
          </Link>
          <span className="text-black/50 text-2xl mx-3">|</span>
          <Link href="/who" className="text-black text-2xl hover:text-gray-700">
            Who?
          </Link>
          <span className="text-black/50 text-2xl mx-3">|</span>
          <Link href="/how" className="text-black text-2xl hover:text-gray-700">
            How?
          </Link>
          <Link href="/authentication" className="text-black text-2xl hover:text-gray-700">
            Login
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button 
          className="hamburger-menu text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[30px] left-0 w-full bg-blue-700 py-2">
            <div className="flex flex-col items-center space-y-2">
              <Link 
                href="/what" 
                className="text-black hover:text-gray-700 text-xl w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                What?
              </Link>
              <Link 
                href="/who" 
                className="text-black hover:text-gray-700 text-xl w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Who?
              </Link>
              <Link 
                href="/how" 
                className="text-black hover:text-gray-700 text-xl w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How?
              </Link>
              <Link 
                href="/authentication" 
                className="text-black hover:text-gray-700 text-xl w-full text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 