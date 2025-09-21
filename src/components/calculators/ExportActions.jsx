
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

export default function ExportActions({ csvData, fileName, title }) {
  const handlePrint = () => {
    // Set a title for the print page
    const originalTitle = document.title;
    document.title = title || 'Calculation Results';

    // Track GA4 event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('event', 'result_print', {
        page_name: document.title,
        file_name: title || 'Calculation Results'
      });
    }
    
    window.print();
    document.title = originalTitle;
  };

  const handleCSVExport = () => {
    if (!csvData) return;

    // Track GA4 event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('event', 'result_download', {
        page_name: document.title,
        file_name: `${fileName}.csv`,
        format: 'csv'
      });
    }

    // Convert array of arrays to CSV string
    const csvString = csvData.map(rowArray => 
      rowArray.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    // Create blob with proper UTF-8 encoding and BOM
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvString], { 
      type: 'text/csv;charset=utf-8;' 
    });

    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={handlePrint}
        className="flex-1 md:flex-none"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print / Save PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleCSVExport}
        className="flex-1 md:flex-none"
        disabled={!csvData}
      >
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </Button>
    </div>
  );
}
