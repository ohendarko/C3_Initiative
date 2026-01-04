import DownloadButton from "@/components/downloadButton";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mt-20 mx-auto px-4 py-12">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-4">Effective Date: 1st July, 2025</p>
        </div>
        <div>
          <DownloadButton
            fileUrl="/files/privacy-policy.pdf"
            fileName="C3Initiative-Privacy Policy.pdf"
            label="Download"
          />
        </div>
      </div>
      

      <section className="space-y-6">
        <p>
          At <strong>C3 Initiative</strong> (“we,” “us,” or “our”), your privacy is our priority.
          This Privacy Policy outlines how we collect, use, and protect your personal information
          when you interact with our e-learning platform.
        </p>

        <div>
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li><strong>Personal Information:</strong> Name, email, phone, credentials.</li>
            <li><strong>Learning Data:</strong> Progress, quiz scores, course status.</li>
            <li><strong>Technical Data:</strong> Device info, IP address, cookies.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>To manage accounts and progress.</li>
            <li>To communicate updates and support.</li>
            <li>To improve platform functionality.</li>
            <li>To comply with legal requirements.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. How We Share Your Information</h2>
          <p className="mt-2">
            We do <strong>not</strong> sell your data. We only share it with:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Service providers (e.g., hosting, analytics)</li>
            <li>Government/legal authorities when required</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Your Rights</h2>
          <p className="mt-2">
            You may access, update, or delete your data by contacting us at{" "}
            <span className="text-blue-600 underline">ohendarko@gmail.com</span>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p className="mt-2">
            We use encryption and access controls to safeguard your information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Third-Party Services</h2>
          <p className="mt-2">
            We may link to other platforms (e.g., YouTube). Their privacy practices apply separately.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
          <p className="mt-2">
            Updates will be posted here. Major changes will be communicated to you.
          </p>
        </div>
      </section>
    </div>
  );
}
