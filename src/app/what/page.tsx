import Navbar from '@/components/Navbar'

export default function WhatPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[80vh]">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">What is Helpy Chatty?</h1>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Helpy Chatty is a dedicated platform designed to bridge the technology gap for seniors in our society. 
                We understand that navigating today's digital world can be challenging, which is why we're here to help.
              </p>

              <p>
                Our unique approach connects tech-savvy students directly with seniors for one-on-one support sessions. 
                Whether it's troubleshooting a computer issue, learning to use a new smartphone, or understanding social media, 
                our student volunteers are here to provide patient, personalized assistance.
              </p>

              <p>
                Through these direct connections, we ensure that every senior receives the attention they need 
                to overcome their technical challenges and gain confidence in using modern technology.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
