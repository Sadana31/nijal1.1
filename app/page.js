'use client';

import React, { useState, useEffect } from 'react';
import { Home, Gauge } from 'lucide-react';
import Link from 'next/link';
import ExportCSVButton from '@/components/ExportCSVButton';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function HomePage() {
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const searchData = () => {
    const baseUrl = '/api/sbFetch';

    const url = searchField && searchValue
      ? `${baseUrl}?field=${encodeURIComponent(searchField)}&value=${encodeURIComponent(searchValue)}`
      : baseUrl;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('Fetched data:', json);
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

  const filteredData = data.filter((row) => {
    if (!searchField || !searchValue) return true;
    const val = row[searchField];
    if (!val) return false;
    return val.toString().toLowerCase().includes(searchValue.toLowerCase());
  });

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
        <h1 className="text-3xl font-bold text-[#254852] mb-6">SB Details Dashboard</h1>

        {/* Search + Buttons Row */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
  {/* Search Section */}
  <div className="flex flex-wrap items-center gap-2">
    <label htmlFor="sb-search-field" className="text-[#254852] font-medium">
      Search by:
    </label>
    <select
      id="sb-search-field"
      className="border border-gray-300 rounded-lg px-2 py-1 text-black"
      value={searchField}
      onChange={(e) => setSearchField(e.target.value)}
    >
      <option value="">Select field</option>
      <option value="shippingBillNo">Shipping Bill</option>
      <option value="formNo">Form No</option>
      <option value="shippingBillDate">Shipping Bill Date</option>
      <option value="portCode">Port Code</option>
    </select>

    <input
      type="text"
      id="sb-search-value"
      placeholder="Enter search value"
      className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring focus:ring-cyan-300 placeholder-gray-400 text-black"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />

    <button
      onClick={searchData}
      className="bg-[#5495ab] text-white px-4 py-2 rounded-xl hover:bg-[#457d92] transition"
    >
      Search
    </button>
  </div>

  {/* Button Group */}
  <div className="flex flex-wrap items-center gap-3">
    <button
      className="bg-[#5495ab] text-white px-5 py-2 rounded-xl shadow hover:bg-[#457d92] transition"
      onClick={() => router.push('/add_sb')}
    >
      Add Shipping Bill
    </button>
    <button
      className="bg-[#5495ab] text-white px-5 py-2 rounded-xl shadow hover:bg-[#457d92] transition"
      onClick={() => router.push('/bulk_sb')}
    >
      Bulk Shipping Bill Upload
    </button>
    <ExportCSVButton data={filteredData} />
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
      <th style={{ ...styles.th }}></th>
      <th style={{ ...styles.th, minWidth: '10px'}}>Shipping Bill</th>
      <th style={{ ...styles.th, minWidth: '70px' }}>Form No</th>
      <th style={{ ...styles.th, minWidth: '100px' }}>Shipping Bill Date</th>
      <th style={{ ...styles.th, minWidth: '90px' }}>Port Code</th>
      <th style={{ ...styles.th, minWidth: '100px' }}>Bank Name</th>
      <th style={{ ...styles.th, minWidth: '70px' }}>Invoice Count</th>
      <th style={{ ...styles.th, minWidth: '80px' }}>FOB Currency</th>
      <th style={{ ...styles.th, minWidth: '100px' }}>Export Bill Value</th>
      <th style={{ ...styles.th, minWidth: '110px' }}>Bill Outstanding Value</th>
      <th style={{ ...styles.th, minWidth: '100px' }}>Buyer Name</th>
      <th style={{ ...styles.th, minWidth: '90px' }}>Buyer Country Code</th>
    </tr>
  </thead>
            <tbody>
              {filteredData.map((row, idx) => {
                const uniqueKey = `${row.shippingBill}-${row.formNo}-${idx}`;
const isExpanded = !!expandedRows[uniqueKey];
                return (
                  <React.Fragment key={`${row.shippingBillNo || row.formNo || idx}`}>
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
      width: '80px'
    }}
  >
    <input type="checkbox" />
    <button
      onClick={() => toggleRow(`${row.shippingBill}-${row.formNo}-${idx}`)}

      style={styles.expandBtn}
      aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
    >
      {isExpanded ? '▲' : '▼'}
    </button>
  </div>
</td>

                      <td style={{ ...styles.td, marginLeft: '0px' }}>{row.shippingBillNo}</td>
                      <td style={styles.td}>{row.formNo || 'NA'}</td>
                      <td style={styles.td}>{row.shippingBillDate}</td>
                      <td style={styles.td}>{row.portCode}</td>
                      <td style={styles.td}>{row.bankName}</td>
                      <td style={styles.td}>{row.invoiceCount}</td>
                      <td style={styles.td}>{row.fobCurrency}</td>
                      <td style={styles.td}>{row.exportBillValue}</td>
                      <td style={styles.td}>{row.billOutstandingValue}</td>
                      <td style={styles.td}>{row.buyerName}</td>
                      <td style={styles.td}>{row.buyerCountryCode}</td>
                    </tr>

                    {isExpanded && (
  <>
  {/* Header row */}
  <tr style={{ backgroundColor: '#f0f5fa', fontWeight: 'bold', textAlign: 'center', height: '48px' }}>
    <td style={{ padding: '12px 16px' }}>IE Code</td>
    <td style={{ padding: '12px 16px' }}>Invoice Date</td>
    <td style={{ padding: '12px 16px' }}>Realized Value</td>
    <td style={{ padding: '12px 16px' }}>Buyer Address</td>
    <td style={{ padding: '12px 16px' }}>Consignee Country Code</td>
    <td style={{ padding: '12px 16px' }}>Port of Destination</td>
    <td style={{ padding: '12px 16px' }}>Shipping Company</td>
    <td style={{ padding: '12px 16px' }}>Vessel Name</td>
    <td style={{ padding: '12px 16px' }}>BL Date</td>
    <td style={{ padding: '12px 16px' }}>Commercial Invoice</td>
    <td style={{ padding: '12px 16px' }}>Trade Terms</td>
    <td style={{ padding: '12px 16px' }}>Commodity</td>
  </tr>

  {/* Data row */}
  <tr style={{ backgroundColor: '#f9fbfd', textAlign: 'center', height: '48px' }}>
    <td style={{ padding: '12px 16px' }}>{row.ieCode}</td>
    <td style={{ padding: '12px 16px' }}>{row.invoiceDate}</td>
    <td style={{ padding: '12px 16px' }}>{row.realizedValue}</td>
    <td style={{ padding: '12px 16px' }}>{row.buyerAddress}</td>
    <td style={{ padding: '12px 16px' }}>{row.consigneeCountryCode}</td>
    <td style={{ padding: '12px 16px' }}>{row.portOfDestination}</td>
    <td style={{ padding: '12px 16px' }}>{row.shippingCompany}</td>
    <td style={{ padding: '12px 16px' }}>{row.vesselName}</td>
    <td style={{ padding: '12px 16px' }}>{row.blDate}</td>
    <td style={{ padding: '12px 16px' }}>{row.commercialInvoice}</td>
    <td style={{ padding: '12px 16px' }}>{row.tradeTerms || '-'}</td>
    <td style={{ padding: '12px 16px' }}>{row.commodity}</td>
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
