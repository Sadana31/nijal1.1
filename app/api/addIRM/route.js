import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const data = await req.json();

    const requiredFields = [
      'SrNo',
      'ADCode',
      'BankName',
      'IECode',
      'RemittanceRefNumber',
      'RemittanceDate',
      'PurposeCode',
      'RemittanceCurrency',
      'RemittanceAmount',
      'UtilizedAmount',
      'OutstandingAmount',
      'RemitterName'
    ];

    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length) {
      return NextResponse.json(
        { message: `Missing fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const collection = db.collection('irm');

    // Optional: prevent duplicate entries for the same RemittanceRefNumber
    const exists = await collection.findOne({ RemittanceRefNumber: data.RemittanceRefNumber });
    if (exists) {
      return NextResponse.json({ message: 'IRM record already exists' }, { status: 409 });
    }

    const sanitizedData = {};
    for (const [key, value] of Object.entries(data)) {
      sanitizedData[key] = typeof value === 'string' ? value.trim() : value;
    }

    await collection.insertOne({
      ...sanitizedData,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'IRM record added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error adding IRM record', error: err.message },
      { status: 500 }
    );
  }
}
