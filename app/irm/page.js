'use client';

import React, { useState, useEffect } from 'react';
import { Home, Gauge } from 'lucide-react';
import Link from 'next/link';
import ExportCSVButton from '@/components/IRMExportCSV';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function HomePage() {
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const searchData = () => {
    const baseUrl = '/api/irmFetch';

    const url = searchField && searchValue
      ? `${baseUrl}?field=${encodeURIComponent(searchField)}&value=${encodeURIComponent(searchValue)}`
      : baseUrl;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Fetched data:', json);
        console.log('Calling URL:', url);
        setData(json);
      })
      .catch(err => console.error('Search failed:', err));
  };


  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

const filteredData = Array.isArray(data)
  ? data.filter((row) => {
      if (!searchField || !searchValue) return true;
      const val = row[searchField];
      if (!val) return false;
      return val.toString().toLowerCase().includes(searchValue.toLowerCase());
    })
  : [];


  useEffect(() => {
    searchData(); // load all by default
  }, []);

  const router = useRouter();

  // Your CSS styles (converted from your CSS snippet to JS style objects)
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      color: '#34495e',
    },
    th: {
      padding: '14px 16px',
      textAlign: 'left',
      borderBottom: '1px solid #e1e8f0',
      fontWeight: '700',
      backgroundColor: '#01878a82',
      color: 'rgb(0,0,0)',
      position: 'relative',
      userSelect: 'none',
    },
    td: {
      padding: '14px 16px',
      textAlign: 'left',
      borderBottom: '1px solid #e1e8f0',
      verticalAlign: 'middle',
      color: '#34495e',
      position: 'relative',
    },
    trEven: {
      backgroundColor: '#f7fafc',
    },
    trHover: {
      backgroundColor: '#d1e7f0',
      transition: 'background-color 0.3s ease',
    },
    expanderRow: {
      backgroundColor: '#f1f6f9',
      fontSize: '13px',
      color: '#495057',
    },
    expandBtn: {
      cursor: 'pointer',
      color: '#264653',
      fontWeight: '700',
      userSelect: 'none',
      width: '120px',
      textAlign: 'center',
      fontSize: '16px',
      transition: 'color 0.3s ease',
      background: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    expandBtnHover: {
      color: '#2a9d8f',
    },
    nestedTable: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#f1f6f9',
    },
    nestedTd: {
      border: 'none',
      padding: '6px 12px',
      verticalAlign: 'top',
      color: '#264653',
      fontWeight: '600',
    },
  };

  return (
    <div className="flex min-h-screen text-gray-900">
      {/* Sidebar */}

      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#254852] mb-6">IRM Details Dashboard</h1>

        {/* Search + Buttons Row */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
  {/* Search Section */}
  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
  {/* Left side: Search Section */}
  <div className="flex items-center gap-2 flex-wrap">
    <label htmlFor="irm-search-field" className="text-[#254852] font-medium">
      Search by:
    </label>

    <select
        id="irm-search-field"
        className="border border-gray-300 rounded-lg px-2 py-1 text-black"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        >
        <option value="">Select field</option>
        <option value="RemittanceRefNumber">Remittance Ref No</option>
        <option value="IECode">IE Code</option>
        <option value="ADCode">AD Code</option>
        <option value="BankName">Bank Name</option>
        <option value="RemittanceDate">Remittance Date</option>
        <option value="Status">Status</option>
    </select>


    <input
      type="text"
      id="irm-search-value"
      placeholder="Enter search value"
      className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring focus:ring-cyan-300 placeholder-gray-400 text-black"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />

    <button
      onClick={searchData}
      className="bg-[#5495ab] text-white px-3 py-1.5 rounded-lg hover:bg-[#457d92] transition text-sm me-5"
    >
      Search
    </button>
  </div>

  <br/>

  {/* Right side: Button group */}
  <div className="flex items-center gap-2">
    <button
      className="bg-[#5495ab] text-white px-3 py-1.5 rounded-lg shadow hover:bg-[#457d92] transition text-sm ms-5 "
      onClick={() => router.push('/add_irm')}
    >
      Add IRM
    </button>

    <button
      className="bg-[#5495ab] text-white px-3 py-1.5 rounded-lg shadow hover:bg-[#457d92] transition text-sm"
      onClick={() => router.push('/bulk_irm')}
    >
      Bulk Upload
    </button>

    <ExportCSVButton
      data={filteredData}
      className="bg-[#5495ab] text-white px-3 py-1.5 rounded-lg shadow hover:bg-[#457d92] transition text-sm"
    />
  </div>
</div>
</div>

{/* Entries per page */}
<div className="mb-4 text-sm text-gray-600">
  Show{' '}
  <select className="border border-gray-300 rounded-lg px-2 py-1 text-black">
    <option value="10">10</option>
    <option value="25">25</option>
    <option value="50">50</option>
  </select>{' '}
  entries
</div>


        {/* Table */}
        <div
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
          }}
>

          <table style={styles.table}>
            <thead>
  <tr>
    <th style={styles.th}></th>
    <th style={styles.th}>Bank Name</th>
    <th style={styles.th}>Remittance Reference Number</th>
    <th style={styles.th}>Remittance Date</th>
    <th style={styles.th}>Purpose Code</th>
    <th style={styles.th}>Remittance Currency</th>
    <th style={styles.th}>Remittance Amount</th>
    <th style={styles.th}>Outstanding Amount</th>
    <th style={styles.th}>Remitter Name</th>
  </tr>
</thead>
<tbody>
  {filteredData.map((row, idx) => {
    const uniqueKey = `${row.RemittanceRefNumber}-${idx}`;
    const isExpanded = !!expandedRows[uniqueKey];

    return (
      <React.Fragment key={uniqueKey}>
        <tr
          style={{
            ...styles.td,
            backgroundColor: idx % 2 === 0 ? '#f7fafc' : '#fff',
            cursor: 'default',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1e7f0')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#f7fafc' : '#fff')
          }
        >
          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
              }}
            >
              <input type="checkbox" />
              <button
                onClick={() => toggleRow(uniqueKey)}
                style={styles.expandBtn}
                aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
          </td>

          <td style={styles.td}>{row.BankName}</td>
          <td style={styles.td}>{row.RemittanceRefNumber}</td>
          <td style={styles.td}>{row.RemittanceDate}</td>
          <td style={styles.td}>{row.PurposeCode}</td>
          <td style={styles.td}>{row.RemittanceCurrency}</td>
          <td style={styles.td}>{row.RemittanceAmount}</td>
          <td style={styles.td}>{row.OutstandingAmount}</td>
          <td style={styles.td}>{row.RemitterName}</td>
        </tr>

        {isExpanded && (
          <>
            {/* Header Row */}
            <tr style={{ backgroundColor: '#f0f5fa', fontWeight: 'bold', textAlign: 'center', height: '48px' }}>
              <td style={{ padding: '12px 16px' }}>AD Code</td>
              <td style={{ padding: '12px 16px' }}>IE Code</td>
              <td style={{ padding: '12px 16px' }}>Remitter Country Code</td>
              <td style={{ padding: '12px 16px' }}>Remitter Bank</td>
              <td style={{ padding: '12px 16px' }}>Other Bank Ref No</td>
              <td style={{ padding: '12px 16px' }}>Status</td>
              <td style={{ padding: '12px 16px' }}>Remittance Type</td>
              <td style={{ padding: '12px 16px' }}>Utilized Amount</td>
              <td style={{ padding: '12px 16px' }}>Remitter Address</td>
            </tr>

            {/* Data Row */}
            <tr style={{ backgroundColor: '#f9fbfd', textAlign: 'center', height: '48px' }}>
              <td style={{ padding: '12px 16px' }}>{row.ADCode}</td>
              <td style={{ padding: '12px 16px' }}>{row.IECode}</td>
              <td style={{ padding: '12px 16px' }}>{row.RemitterCountryCode}</td>
              <td style={{ padding: '12px 16px' }}>{row.RemitterBank}</td>
              <td style={{ padding: '12px 16px' }}>{row.OtherBankRefNumber}</td>
              <td style={{ padding: '12px 16px' }}>{row.Status}</td>
              <td style={{ padding: '12px 16px' }}>{row.RemittanceType}</td>
              <td style={{ padding: '12px 16px' }}>{row.UtilizedAmount}</td>
              <td style={{ padding: '12px 16px' }}>{row.RemitterAddress}</td>
            </tr>
          </>
        )}
      </React.Fragment>
    );
  })}
</tbody>




          </table>
        </div>
      </div>
    </div>
  );
}
