import Link from 'next/link'
import { FaCode } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="navigation-bar h-[30px] w-full bg-gradient-to-r from-blue-600 to-blue-800 fixed top-0 left-0 z-50">
{/* Logo */}
        <Link href="/" className="logo-icon">
          <FaCode className="h-5 w-5 text-white" />
        </Link>

        {/* Navigation Links */}
        <div className="navigation-links">
          <Link href="/who" className="text-white text-sm hover:text-blue-200">
            Who
          </Link>
          <span className="text-white/50">|</span>
          <Link href="/what" className="text-white text-sm hover:text-blue-200">
            What
          </Link>
          <span className="text-white/50">|</span>
          <Link href="/how" className="text-white text-sm hover:text-blue-200">
            How
          </Link>
        </div>
    </nav>
  )
} 