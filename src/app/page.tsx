import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
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
        </div>
      </main>
    </>
  );
}
