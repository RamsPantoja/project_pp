import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: String,
    teacher: String,
    description: String,
    objectives: Array,
    conceptList: Array,
    enrollmentLimit: Number,
    enrollmentUsers: Array,
    price: Number,
    coverImg: {
        filename: String,
        mimetype: String,
        url: String
    }
});

export default mongoose.models.Courses || mongoose.model('Courses', courseSchema);
