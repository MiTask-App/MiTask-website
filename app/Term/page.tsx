"use client";

import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#CEDEFF] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER CAPSULE */}
        <header className="bg-white rounded-full shadow-sm border border-gray-100 fixed top-0 inset-x-0 z-50 p-3 px-6 flex justify-between items-center m-4 md:m-8">
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
              className="text-blue-600 px-6 py-2 text-sm font-semibold"
            >
              Kembali
            </Link>
        </header>

        {/* CONTENT CARD */}
        <main className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8 md:p-12 text-slate-800 mt-24">
          <div className="max-w-none prose prose-slate prose-sm">
            <h1 className="text-2xl font-bold mb-4">Terms and Conditions – Mi-Task</h1>
            <p className="text-sm leading-relaxed mb-8">
              These Terms and Conditions apply to the <span className="font-bold">Mi-Task</span> mobile application ("Application") developed by the <span className="font-bold">Mi-Task</span> Team ("Service Provider"). By downloading, accessing, or using the Application, you agree to comply with these Terms.
            </p>

            {/* 1. Use of Application */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">1. Use of the Application</h2>
              <p className="text-sm mb-4">
                Mi-Task is provided as a task management application intended to help users organize and manage personal tasks and notes.
              </p>
              <p className="text-sm mb-2">Users agree to use the Application only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Use the Application for illegal or harmful activities</li>
                <li>Attempt to gain unauthorized access to the system or other users' accounts</li>
                <li>Distribute malware, spam, or harmful content through the Application</li>
                <li>Copy, modify, or reverse engineer any part of the Application without permission</li>
              </ul>
            </section>

            {/* 2. User Accounts */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">2. User Accounts</h2>
              <p className="text-sm mb-2">Some features require users to sign in using Google authentication.</p>
              <p className="text-sm mb-2">Users are responsible for:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                <li>Maintaining the confidentiality of their account</li>
                <li>Ensuring that information provided is accurate</li>
                <li>All activities performed under their account</li>
              </ul>
              <p className="text-sm italic">The Service Provider reserves the right to suspend or terminate accounts that violate these Terms.</p>
            </section>

            {/* 3. User Content */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">3. User Content</h2>
              <p className="text-sm mb-4 font-medium">Users may create and store content such as tasks or notes within the Application.</p>
              <p className="text-sm mb-4">
                Users retain ownership of their content. However, by using the Application, users grant the Service Provider permission to store and process such content solely for the purpose of providing the Application's services.
              </p>
              <p className="text-sm">Users are solely responsible for the content they create and share.</p>
            </section>

            {/* 4. Privacy */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">4. Privacy</h2>
              <p className="text-sm mb-2">
                The collection and use of personal data are governed by the Privacy Policy of Mi-Task.
              </p>
              <p className="text-sm">By using the Application, you also agree to the Privacy Policy.</p>
            </section>

            {/* 5. Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">5. Third-Party Services</h2>
              <p className="text-sm mb-2">The Application may use third-party services, including:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4 font-medium">
                <li>Google Authentication</li>
                <li>Supabase</li>
              </ul>
              <p className="text-sm">
                These services operate under their own terms and privacy policies. The Service Provider is not responsible for the practices of third-party services.
              </p>
            </section>

            {/* 6. Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-sm">
                All rights, title, and interest in the Application, including its design, logo, features, and source code, are owned by the Mi-Task Team unless otherwise stated. Unauthorized reproduction or redistribution is prohibited.
              </p>
            </section>

            {/* 7. Service Availability */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">7. Service Availability</h2>
              <p className="text-sm mb-4">
                The Service Provider strives to keep the Application available and functioning properly but does not guarantee uninterrupted or error-free operation.
              </p>
              <p className="text-sm italic text-slate-500 underline decoration-slate-200">
                The Service Provider may modify, suspend, or discontinue parts of the Application at any time without prior notice.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-sm mb-2">The Application is provided "as is" without warranties of any kind.</p>
              <p className="text-sm mb-2">The Service Provider shall not be liable for:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4 font-medium">
                <li>Data loss</li>
                <li>Service interruptions</li>
                <li>Indirect or incidental damages arising from the use of the Application</li>
              </ul>
              <p className="text-sm font-bold">Users use the Application at their own risk.</p>
            </section>

            {/* 9. Account Deletion */}
            <section className="mb-8 border-t border-gray-50 pt-8">
              <h2 className="text-lg font-bold mb-4">9. Account Deletion</h2>
              <p className="text-sm mb-4">Users may request account deletion through the provided deletion request method.</p>
              <p className="text-sm">After deletion requests are processed, related user data will be removed according to the Privacy Policy.</p>
            </section>

            {/* 10. Changes */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">10. Changes to These Terms</h2>
              <p className="text-sm mb-4">The Service Provider may update these Terms and Conditions from time to time.</p>
              <p className="text-sm italic">Continued use of the Application after changes become effective constitutes acceptance of the updated Terms.</p>
            </section>

            {/* 11. Effective Date */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">11. Effective Date</h2>
              <p className="text-sm">These Terms and Conditions are effective as of <span className="font-bold">April 06, 2026.</span></p>
            </section>

            {/* 12. Contact */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">12. Contact Us</h2>
              <p className="text-sm mb-2">If you have questions regarding these Terms and Conditions, please contact:</p>
              <a href="mailto:mitaskpdbla1@gmail.com" className="text-blue-500 hover:underline text-sm font-medium">mitaskpdbla1@gmail.com</a>
            </section>

            <p className="text-xs font-semibold mt-10 text-slate-500 border-t border-gray-50 pt-6">
              By using the Application, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
          </div>
        </main>
        <footer className="text-center text-gray-400 text-xs py-4">
          © 2026 MiTask Team. All rights reserved.
        </footer>
      </div>
    </div>
  );
}