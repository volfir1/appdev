import React from 'react';
import { Button, Group } from '@mantine/core';
import { FileText, FileDown } from 'lucide-react';

// Helper to trigger file download from blob
function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Reusable report download component
 * @param {string} csvUrl - Backend endpoint for CSV
 * @param {string} pdfUrl - Backend endpoint for PDF
 * @param {string} [csvLabel] - Button label for CSV
 * @param {string} [pdfLabel] - Button label for PDF
 * @param {object} [buttonProps] - Extra props for buttons
 */
export default function ReportDownload({
  csvUrl = 'http://localhost:5000/api/reports/poverty/csv',
  pdfUrl = 'http://localhost:5000/api/reports/poverty/pdf',
  csvLabel = 'Download CSV',
  pdfLabel = 'Download PDF',
  buttonProps = {},
}) {
  const handleDownload = async (url, filename) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to download report');
      const blob = await res.blob();
      triggerDownload(blob, filename);
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  };

  return (
    <Group gap="md">
      <Button
        leftSection={<FileText size={16} />}
        color="teal"
        variant="light"
        onClick={() => handleDownload(csvUrl, 'poverty_report.csv')}
        {...buttonProps}
      >
        {csvLabel}
      </Button>
      <Button
        leftSection={<FileDown size={16} />}
        color="red"
        variant="light"
        onClick={() => handleDownload(pdfUrl, 'poverty_report.pdf')}
        {...buttonProps}
      >
        {pdfLabel}
      </Button>
    </Group>
  );
}
