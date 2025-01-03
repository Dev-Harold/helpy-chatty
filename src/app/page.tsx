import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Our Platform
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">
              Content goes here
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
