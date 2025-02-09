'use client'

import Navbar from '@/components/Navbar'

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            <main className="pt-[30px] px-4 min-h-screen bg-gray-100">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                    
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                            <p className="text-gray-700">
                                By accessing or using Helpy Chatty, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
                            <p className="text-gray-700">
                                You agree to use the service only for lawful purposes and in accordance with these Terms. You agree not to:
                            </p>
                            <ul className="list-disc ml-6 mt-2 text-gray-700">
                                <li>Use the service for any illegal purpose</li>
                                <li>Harass, abuse, or harm others</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with the proper functioning of the service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                            <p className="text-gray-700">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
                            <p className="text-gray-700">
                                All content and materials available through our service are protected by intellectual property rights. You may not use, reproduce, or distribute any content without authorization.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
                            <p className="text-gray-700">
                                We provide the service &quot;as is&quot; without any warranty. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
                            <p className="text-gray-700">
                                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
                            <p className="text-gray-700">
                                For questions about these Terms, please contact us at support@helpychatty.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
} 