import { dbConnect } from '@/lib/dbConnect';
import ShippingBill from '@/models/sb';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const value = searchParams.get('value');

    let query = {};

    if (field && value) {
      // Build dynamic query
      query[field] = { $regex: value, $options: 'i' }; // Case-insensitive regex match
    }

    const data = await ShippingBill.find(query).limit(50);
    return Response.json(data);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return Response.json({ error: 'Error fetching shipping bills' }, { status: 500 });
  }
}
