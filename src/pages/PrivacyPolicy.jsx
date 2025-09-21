
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ShieldCheck className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 mt-2">Last updated: 27/08/2025</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6 text-gray-700 leading-relaxed">
            <p>
              Welcome to CalcMyMoney.co.uk. We are committed to protecting and respecting your privacy. This policy explains what personal data we collect from you, or that you provide to us, and how it will be processed by us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">1. Information We Collect</h2>
            <p>
              We may collect and process the following data about you:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Data You Provide:</strong> Information that you provide by filling in forms on our site. This includes data entered into our calculators and information provided when you contact us.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous information about your computer, including your IP address, operating system, and browser type, for system administration and to report aggregate information. This is statistical data about our users' browsing actions and patterns, and does not identify any individual.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 pt-4">2. Use of Calculator Data</h2>
            <p>
              All data entered into our financial calculators is processed in your browser. We do not store, save, or view any of the personal or financial data you enter into the calculators on our servers. Your financial information is yours alone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">3. Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use and the purposes for which we use them see our Cookie Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">4. Your Rights</h2>
            <p>
              You have the right to ask us not to process your personal data for marketing purposes. You can exercise your right to prevent such processing by checking certain boxes on the forms we use to collect your data.
            </p>
            
             <h2 className="text-2xl font-semibold text-gray-800 pt-4">5. Changes to Our Privacy Policy</h2>
            <p>
              Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by e-mail.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">6. Contact</h2>
            <p>
              Questions, comments and requests regarding this privacy policy are welcomed and should be addressed through our contact form.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
