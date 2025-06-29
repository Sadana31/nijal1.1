'use client';

import React from 'react';

export default function ExportCSVButton({ data, filename = 'shipping_bills.csv' }) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = [
      'Shipping Bill',
      'Form No',
      'Shipping Bill Date',
      'Port Code',
      'Bank Name',
      'Invoice Count',
      'FOB Currency',
      'Export Bill Value',
      'Bill Outstanding Value',
      'Buyer Name',
      'Buyer Country Code',
      'IE Code',
      'Invoice Date',
      'Realized Value',
      'Buyer Address',
      'Consignee Country Code',
      'Port of Destination',
      'Shipping Company',
      'Vessel Name',
      'BL Date',
      'Commercial Invoice',
      'Trade Terms',
      'Commodity'
    ];

    const rows = data.map(row => [
      row.shippingBillNo || '',
      row.formNo || '',
      row.shippingBillDate || '',
      row.portCode || '',
      row.bankName || '',
      row.invoiceCount || '',
      row.fobCurrency || '',
      row.exportBillValue || '',
      row.billOutstandingValue || '',
      row.buyerName || '',
      row.buyerCountryCode || '',
      row.ieCode || '',
      row.invoiceDate || '',
      row.realizedValue || '',
      row.buyerAddress || '',
      row.consigneeCountryCode || '',
      row.portOfDestination || '',
      row.shippingCompany || '',
      row.vesselName || '',
      row.blDate || '',
      row.commercialInvoice || '',
      row.tradeTerms || '',
      row.commodity || ''
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
      Export File
    </button>
  );
}
