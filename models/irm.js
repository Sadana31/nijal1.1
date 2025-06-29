import mongoose from 'mongoose';

const IRMSchema = new mongoose.Schema({}, { collection: 'irm', strict: false });

export default mongoose.models.IRM || mongoose.model('IRM', IRMSchema);
