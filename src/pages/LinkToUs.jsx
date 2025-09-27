import React from 'react';

export default function LinkToUs() {
  const badgeHtml = `<a href="https://calcmymoney.co.uk/SalaryCalculatorUK" target="_blank" rel="noopener">
  <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bda5a3f4d_image.png" alt="Powered by Calculate My Money — Free UK Salary Calculator" style="height:28px; vertical-align:middle; margin-right:8px;" />
  <span>Powered by Calculate My Money — Free UK Salary Calculator</span>
</a>`;

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Link to Us</h1>
          <p className="text-lg text-gray-600 mt-2">
            Support our free UK calculators by adding a badge to your site.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <p className="text-gray-700">
          Use the snippet below to link back to us. It helps your users and supports the continued
          development of free, ad‑light tools.
        </p>
        <div className="p-4 bg-gray-50 border rounded font-mono text-sm overflow-auto">
          <pre>{badgeHtml}</pre>
        </div>
        <div className="pt-4">
          <p className="text-sm text-gray-500">Preview:</p>
          <div className="mt-2" dangerouslySetInnerHTML={{ __html: badgeHtml }} />
        </div>
      </div>
    </div>
  );
}
