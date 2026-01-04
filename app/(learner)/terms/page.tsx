import DownloadButton from "@/components/downloadButton";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4 py-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-4">Effective Date: 1st July, 2025</p>
        </div>
        <div>
          <DownloadButton
            fileUrl="/files/terms-of-service.pdf"
            fileName="C3Initiative-Terms.pdf"
            label="Download Terms"
          />
        </div>
      </div>

      <section className="space-y-6">
        <p>
          These Terms of Service (“Terms”) govern your use of the C3 Initiative platform. By using
          the platform, you agree to these terms. If you disagree, please do not use the platform.
        </p>

        <div>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2">
            Your use constitutes agreement to these Terms and our Privacy Policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. User Accounts</h2>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>You must be at least 13 years old.</li>
            <li>You are responsible for your account and password.</li>
            <li>Provide accurate and complete registration information.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. Use of Content</h2>
          <p className="mt-2">
            All content is owned by C3 Initiative or partners. Reuse without written consent is
            prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. User Conduct</h2>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Don’t interfere with the platform or access other users' accounts.</li>
            <li>Don’t upload harmful or illegal content.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. Termination</h2>
          <p className="mt-2">
            We may suspend or terminate your account if these Terms are violated.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Disclaimers</h2>
          <p className="mt-2">
            We provide the platform “as is” and do not guarantee specific learning outcomes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p className="mt-2">
            We are not liable for indirect or incidental damages resulting from platform use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p className="mt-2">These Terms are governed by the laws of Ghana.</p>
        </div>
      </section>
    </div>
  );
}
