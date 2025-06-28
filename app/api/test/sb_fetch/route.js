import { dbConnect } from '@/lib/dbConnect';
import ShippingBill from '@/models/ShippingBill';

export async function GET() {
  try {
    await dbConnect();
    const data = await ShippingBill.find({}).limit(50); // adjust limit if needed
    return Response.json(data);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return Response.json({ error: 'Error fetching shipping bills' }, { status: 500 });
  }
}
