import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const { rows } = await req.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 400 });
    }

    const requiredFields = [
      'shippingBill', 'formNo', 'sbDate', 'portCode', 'exportAgency',
      'adCode', 'bankName', 'ieCode', 'invoiceNo', 'invoiceDate',
      'fobCurrency', 'exportBillValue', 'billRealizedValue',
      'billOutstandingValue', 'blDate'
    ];

    for (let i = 0; i < rows.length; i++) {
      for (const field of requiredFields) {
        if (!rows[i][field]) {
          return NextResponse.json({ message: `Row ${i + 2} is missing required field: ${field}` }, { status: 400 });
        }
      }
    }

    const db = await dbConnect();
    await db.collection('shippingBills').insertMany(rows.map(row => ({
      ...row,
      createdAt: new Date()
    })));

    return NextResponse.json({ message: 'Bulk upload successful' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
