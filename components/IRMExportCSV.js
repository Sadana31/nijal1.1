'use client';

import React from 'react';

export default function ExportIRMButton({ data, filename = 'irm_data.csv' }) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No IRM data to export!');
      return;
    }

    const headers = [
      'Sr. No.',
      'AD Code',
      'Bank Name',
      'IE Code',
      'Remittance Ref Number',
      'Remittance Date',
      'Purpose Code',
      'Remittance Currency',
      'Remittance Amount',
      'Utilized Amount',
      'Outstanding Amount',
      'Remitter Name',
      'Remitter Address',
      'Remitter Country Code',
      'Remitter Bank',
      'Other Bank Ref No',
      'Status',
      'Remittance Type'
    ];

    const rows = data.map((row, index) => [
      index + 1,
      row.ADCode || '',
      row.BankName || '',
      row.IECode || '',
      row.RemittanceRefNumber || '',
      row.RemittanceDate || '',
      row.PurposeCode || '',
      row.RemittanceCurrency || '',
      row.RemittanceAmount || '',
      row.UtilizedAmount || '',
      row.OutstandingAmount || '',
      row.RemitterName || '',
      row.RemitterAddress || '',
      row.RemitterCountryCode || '',
      row.RemitterBank || '',
      row.OtherBankRefNumber || '',
      row.Status || '',
      row.RemittanceType || ''
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(val => `"${val}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-[#5495ab] text-white px-5 py-2 rounded-md shadow hover:bg-[#457d92] transition"
    >
      Export IRM File
    </button>
  );
}
