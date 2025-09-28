import React from 'react';

// Optimized SVG representation of the Pound icon to replace the 194 KiB PNG.
// This is embedded directly in the HTML snippet, eliminating the network request.
const POUND_ICON_SVG_HTML = `
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle; margin-right:8px; display:inline-block;">
    <rect width="32" height="32" rx="8" fill="#000080"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.986 7.64183C12.986 7.64183 17.828 7.37383 17.828 7.37383C18.423 7.37383 18.911 7.84883 18.911 8.43583C18.911 9.02283 18.423 9.49783 17.828 9.49783C16.892 9.49783 15.008 9.49783 13.923 9.49783C13.328 9.49783 12.986 9.80583 12.986 10.3928V12.9168H18.665C19.261 12.9168 19.748 13.3918 19.748 13.9788C19.748 14.5658 19.261 15.0408 18.665 15.0408H12.986V19.4968C12.986 21.0378 13.923 21.3458 16.587 21.3458C17.182 21.3458 17.67 21.8208 17.67 22.4078C17.67 22.9948 17.182 23.4698 16.587 23.4698C13.782 23.4698 11.23 23.0238 11.23 19.4968V10.3928C11.23 8.35683 12.986 7.64183 12.986 7.64183ZM16.03 19.8398C15.688 20.1478 15.093 20.3018 14.329 20.3018C13.565 20.3018 12.97 20.1478 12.628 19.8398C12.285 19.5318 12.285 19.0858 12.628 18.7778C12.97 18.4698 13.565 18.3158 14.329 18.3158C15.093 18.3158 15.688 18.4698 16.03 18.7778C16.372 19.0858 16.372 19.5318 16.03 19.8398Z" fill="url(#pound-gradient)"/>
    <circle cx="20" cy="18" r="3" fill="#3DFF99"/>
    <defs>
      <linearGradient id="pound-gradient" x1="11.23" y1="7.37383" x2="19.748" y2="23.4698" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3DFF99"/>
        <stop offset="1" stop-color="#00E673"/>
      </linearGradient>
    </defs>
  </svg>
`;

export default function LinkToUs() {
  // The badge HTML now uses the inline SVG instead of the large PNG URL.
  const badgeHtml = `<a href="https://www.calcmymoney.co.uk/SalaryCalculatorUK" target="_blank" rel="noopener">
  ${POUND_ICON_SVG_HTML}
  <span>Powered by Calculate My Money — Free UK Salary Calculator</span>
</a>`;

  return (
    <div className="bg-white">
           {' '}
      <div className="bg-gray-50 border-b border-gray-200">
               {' '}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Link to Us</h1>   
               {' '}
          <p className="text-lg text-gray-600 mt-2">
                        Support our free UK calculators by adding a badge to your site.        
             {' '}
          </p>
                 {' '}
        </div>
             {' '}
      </div>
           {' '}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
               {' '}
        <p className="text-gray-700">
                    Use the snippet below to link back to us. It helps your users and supports the
          continued           development of free, ad‑light tools.        {' '}
        </p>
               {' '}
        <div className="p-4 bg-gray-50 border rounded font-mono text-sm overflow-auto">
                    <pre>{badgeHtml}</pre>       {' '}
        </div>
               {' '}
        <div className="pt-4">
                    <p className="text-sm text-gray-500">Preview:</p>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: badgeHtml }} />     
           {' '}
        </div>
             {' '}
      </div>
         {' '}
    </div>
  );
}
