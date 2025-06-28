'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Papa from 'papaparse';

const headerMap = {
  'Sr. No.': 'srNo',
  'Shipping Bill*': 'shippingBillNo',
  'Form No*': 'formNo',
  'Shipping Bill Date*': 'shippingBillDate',
  'Port Code*': 'portCode',
  'Export Agency*': 'exportAgency',
  'AD Code*': 'adCode',
  'Bank Name*': 'bankName',
  'IE Code*': 'ieCode',
  'Invoice No*': 'invoiceNo',
  'Invoice Date*': 'invoiceDate',
  'FOB Currency*': 'fobCurrency',
  'Export Bill Value*': 'exportBillValue',
  'Buyer Name': 'buyerName',
  'Buyer Address': 'buyerAddress',
  'Buyer Contry Code': 'buyerCountryCode',
  'Consignee Name': 'consigneeName',
  'Consignee Contry Code': 'consigneeCountryCode',
  'Origin of goods': 'portOfDestination',
  'Port of destination': 'finalDestination',
  'tenor as per Invoice': 'transitDays',
  'Commodity Description': 'commodity',
  'Shipping company Name': 'shippingCompany',
  'BL/AWB No': 'blNumber',
  'Vessel Name': 'vesselName',
  'BL Date': 'blDate',
  'Commercial invoice': 'commercialInvoice',
  'Trade Terms': 'tradeTerms'
};

const BulkUpload = () => {
  const [file, setFile] = useState(null);

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sampleSB.csv';
    link.download = 'sampleSB.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!file) return alert('Please choose a file');
    if (file.type !== 'text/csv') return alert('Only CSV files are allowed');
    if (file.size > 2 * 1024 * 1024) return alert('File size must be ≤ 2MB');

    Papa.parse(file, {
      skipEmptyLines: true,
      header: false,
      complete: async (results) => {
        const allRows = results.data;

        if (allRows.length < 3) {
          alert('File must include headers, a sample row, and at least one data row.');
          return;
        }

        const rawHeaders = allRows[0]; // Display headers
        const headers = rawHeaders.map(h => headerMap[h.trim()] || h.trim());
        const userRows = allRows.slice(2); // Skip line 2 (sample row)

        const parsedData = userRows.map((row, idx) => {
          const obj = {};
          headers.forEach((key, i) => {
            obj[key] = (row[i] || '').trim();
          });
          return obj;
        });

        for (let i = 0; i < parsedData.length; i++) {
          if (!parsedData[i].shippingBillNo) {
            alert(`Row ${i + 3} is missing "shippingBillNo"`);
            return;
          }
        }

        try {
          const response = await fetch('/api/bulkUploadSB', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rows: parsedData }),
          });

          const result = await response.json();
          if (response.ok) {
            alert('Shipping bills uploaded successfully!');
          } else {
            alert(result.message || 'Failed to upload');
          }
        } catch (err) {
          alert('Upload failed: ' + err.message);
        }
      },
      error: (err) => {
        console.error('❌ Parse error:', err);
        alert('Error parsing file');
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container p-4">
        <h1 className="text-3xl font-bold mb-4">Bulk Upload Shipping Bills</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Choose CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <strong>Instructions:</strong>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Download the sample file below.</li>
            <li>Add your data starting from line 3.</li>
            <li>Ensure the file is in <b>comma-separated</b> CSV format.</li>
            <li>Max file size: 2MB.</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button onClick={handleUpload} className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800">
            Upload
          </button>
          <button onClick={handleDownloadSample} className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800">
            Download Sample File
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
