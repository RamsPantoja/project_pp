import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
});

export default mongoose.models.Admins || mongoose.model('Admins', adminSchema);