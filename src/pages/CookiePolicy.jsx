
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Cookie className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600 mt-2">Last updated: 27/08/2025</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-800">What are cookies?</h2>
            <p>
              A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">How we use cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience and improve our site. We use the following cookies:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Strictly necessary cookies:</strong> These are required for the operation of our website.</li>
              <li><strong>Analytical/performance cookies:</strong> They allow us to recognise and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works.</li>
              <li><strong>Functionality cookies:</strong> These are used to recognise you when you return to our website.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">Managing Cookies</h2>
            <p>
              You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
