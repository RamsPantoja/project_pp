import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: String,
    teacher: String,
    description: String,
    objectives: Array,
    conceptList: Object,
    enrollmentLimit: Number,
    enrollmentUsers: Array,
    price: Number
});

export default mongoose.models.Courses || mongoose.model('Courses', courseSchema);
