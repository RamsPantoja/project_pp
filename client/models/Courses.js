import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    img: String,
    payment: Number
})

const courseSchema = new mongoose.Schema({
    title: String,
    teacher: String,
    description: String,
    objectives: Array,
    conceptList: Array,
    enrollmentLimit: Number,
    enrollmentUsers: [userSchema],
    price: Number,
    coverImg: {
        filename: String,
        mimetype: String,
        url: String
    },
    modeSuscription: {
        isActivated: Boolean,
        amountMonths : Number,
        paymentUrl: String,
        preapproval_plan_id: String
    }
});

export default mongoose.models.Courses || mongoose.model('Courses', courseSchema);
