import { dbConnect } from '@/lib/dbConnect';
import IRM from '@/models/irm';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    const field = searchParams.get('field');
    const value = searchParams.get('value');

    let query = {};
    if (field && value) {
      query[field] = { $regex: value, $options: 'i' };
    }

    const data = await IRM.find(query).limit(50);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
