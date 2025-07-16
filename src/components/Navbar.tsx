'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navigation-bar h-[50px] w-full bg-gradient-to-r from-blue-600 to-blue-800 z-50 max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-full px-4">
        <Link href="/" className="logo-icon flex items-center">
          <div style={{ width: '50px', height: '50px', margin: '5px 0px' }}>
            <img src="/smartphone-support-logo.svg" alt="TechHelp Logo" />
          </div>
          <div className="text-black font-black text-2xl font-bold">TechHelp</div>
        </Link>

        {/* Navigation Links */}
        <div className="navigation-links flex items-center">
          <Link href="/" className="text-black text-xl hover:text-gray-700 font-semibold">
            Home
          </Link>
          <Link href="/chat" className="text-black text-xl hover:text-gray-700 font-semibold ml-16">
            Chat
          </Link>
        </div>
      </div>
    </nav>
  )
} 