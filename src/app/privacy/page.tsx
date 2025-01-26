'use client'

import Navbar from '@/components/Navbar'

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                            <p className="text-gray-700">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc ml-6 mt-2 text-gray-700">
                                <li>Your name and email address when you create an account</li>
                                <li>Chat messages and support requests you submit</li>
                                <li>Technical information about your device and how you use our service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-700">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc ml-6 mt-2 text-gray-700">
                                <li>Provide and improve our support services</li>
                                <li>Respond to your requests and questions</li>
                                <li>Send you important updates about our service</li>
                                <li>Protect against misuse of our platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
                            <p className="text-gray-700">
                                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
                            <p className="text-gray-700">
                                You have the right to:
                            </p>
                            <ul className="list-disc ml-6 mt-2 text-gray-700">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to data processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                            <p className="text-gray-700">
                                If you have any questions about this Privacy Policy, please contact us at support@helpychatty.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
} 