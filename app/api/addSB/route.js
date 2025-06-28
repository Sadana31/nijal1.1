import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const data = await req.json();

    const requiredFields = [
      'shippingBill', 'formNo', 'sbDate', 'portCode', 'exportAgency',
      'adCode', 'bankName', 'ieCode', 'invoiceNo', 'invoiceDate',
      'fobCurrency', 'exportBillValue', 'billRealizedValue',
      'billOutstandingValue', 'blDate'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    const db = await dbConnect();
    const collection = db.collection('shippingBills');

    await collection.insertOne({
      ...data,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Shipping bill added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error adding shipping bill', error: err.message },
      { status: 500 }
    );
  }
}
