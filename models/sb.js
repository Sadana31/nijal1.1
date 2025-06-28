import mongoose from 'mongoose';

const ShippingBillSchema = new mongoose.Schema({}, { collection: 'shipping_bill', strict: false });

export default mongoose.models.ShippingBill || mongoose.model('ShippingBill', ShippingBillSchema);
