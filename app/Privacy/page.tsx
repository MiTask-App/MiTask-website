"use client";

import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER CAPSULE */}
        <header className="bg-white rounded-full shadow-sm border border-gray-600 fixed top-0 inset-x-0 z-50 p-3 px-6 flex justify-between items-center m-4 md:m-8">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo (2).svg" 
              alt="MiTask Logo" 
              width={30} 
              height={30} 
              className="w-8 h-auto"
            />
            <span className="text-[#4F75FF] font-bold text-xl tracking-tight">MiTask</span>
          </div>
          
          <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
            >
              Kembali
            </Link>
        </header>

        {/* CONTENT CARD */}
        <main className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8 md:p-12 text-slate-800 mt-24">
          <div className="max-w-none prose prose-slate prose-sm">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy - Mi-Task</h1>
            <p className="text-sm leading-relaxed mb-8">
              This Privacy Policy applies to the <span className="font-bold">Mi-Task</span> mobile application ("Application") developed by the <span className="font-bold">Mi-Task</span> Team ("Service Provider"). The Application is provided as a free service and is intended for use as is.
            </p>

            {/* Information Collection */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Information Collection and Use</h2>
              <p className="text-sm mb-2">The Application collects the following types of user data:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                <li>Email address</li>
                <li>User ID (such as username or system-generated ID)</li>
                <li>User-generated content (such as tasks or notes)</li>
              </ul>

              <p className="text-sm mb-2">This data is collected and used for the following purposes:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                <li>User authentication (login and account access via Google)</li>
                <li>Providing core application features (task management)</li>
                <li>Managing and maintaining user accounts</li>
              </ul>

              <p className="text-sm font-bold mb-2 uppercase text-xs">The Application does NOT collect:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Precise location data</li>
                <li>Device tracking data</li>
                <li>Analytics data</li>
                <li>Advertising data</li>
              </ul>
            </section>

            {/* Third-Party */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Third-Party Services</h2>
              <p className="text-sm mb-2">The Application uses the following third-party services:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4 font-medium">
                <li>Google <span className="font-normal">(for authentication/login)</span></li>
                <li>Supabase <span className="font-normal">(for database and data storage)</span></li>
              </ul>
              <p className="text-sm">These services may process user data only as necessary to provide their functionality.</p>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Data Sharing</h2>
              <p className="text-sm mb-2">The Service Provider does not sell, trade, or rent users' personal information to third parties.</p>
              <p className="text-sm mb-2">User data may only be disclosed:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>If required by law</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Data Retention</h2>
              <p className="text-sm mb-4">User data is retained for as long as the user continues to use the Application.</p>
              <p className="text-sm">After account deletion, user data may be retained for a limited period (up to 30 days) for security and legal purposes before permanent deletion.</p>
            </section>

            {/* Account Deletion */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Account Deletion</h2>
              <p className="text-sm mb-4">Users can request deletion of their account and associated data through the following link:</p>
              <a href="#" className="text-blue-500 hover:underline text-sm block mb-4">Request Account Deletion</a>
              <p className="text-sm italic">Deletion requests will be processed within 1–3 business days.</p>
            </section>

            {/* Security */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Security</h2>
              <p className="text-sm mb-2">The Service Provider takes appropriate measures to protect user data, including:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Secure data transmission using HTTPS</li>
                <li>Restricted access to stored data</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Children's Privacy</h2>
              <p className="text-sm mb-4">The Application is not intended for use by children under the age of 13.</p>
              <p className="text-sm">The Service Provider does not knowingly collect personal information from children. If such data is discovered, it will be deleted immediately.</p>
            </section>

            {/* Changes */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-sm">This Privacy Policy may be updated from time to time. Any changes will be reflected on this page with an updated effective date.</p>
            </section>

            {/* Effective Date */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Effective Date</h2>
              <p className="text-sm">This policy is effective as of <span className="font-bold">April 06, 2026.</span></p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Contact Us</h2>
              <p className="text-sm mb-2">If you have any questions regarding this Privacy Policy, you can contact:</p>
              <a href="mailto:mitaskpdbla1@gmail.com" className="text-blue-500 hover:underline text-sm">mitaskpdbla1@gmail.com</a>
            </section>

            <p className="text-sm font-medium mt-10 text-slate-500">By using the Application, you agree to this Privacy Policy.</p>
          </div>
        </main>
        <footer className="text-center text-gray-400 text-xs py-4">
          © 2026 MiTask Team. All rights reserved.
        </footer>
      </div>
    </div>
  );
}