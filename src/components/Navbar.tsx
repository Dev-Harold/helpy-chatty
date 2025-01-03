import Link from 'next/link'
import { FaCode } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="navigation-bar h-[30px] w-full bg-gradient-to-r from-blue-600 to-blue-800 fixed top-0 left-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center h-full">
        <Link href="/" className="logo-icon flex items-center">
          <FaCode className="h-5 w-5 text-black" />
          <div className="text-black font-black text-lg ml-2 font-bold">Helpy Chatty</div>
        </Link>
      </div>
    
      {/* Navigation Links */}
      <div className="navigation-links">
        <Link href="/who" className="text-black text-sm hover:text-gray-700">
          Who
        </Link>
        <span className="text-black/50">|</span>
        <Link href="/what" className="text-black text-sm hover:text-gray-700">
          What
        </Link>
        <span className="text-black/50">|</span>
        <Link href="/how" className="text-black text-sm hover:text-gray-700">
          How
        </Link>
      </div>
    </nav>
  )
} 