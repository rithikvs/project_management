import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
}, { timestamps: true, collection: 'user' });

export default mongoose.models.User || mongoose.model('User', userSchema);
