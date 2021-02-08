import mongoose from 'mongoose';
import bcrypt, { hash }from 'bcrypt';

const mongoURI = 'mongodb+srv://RamsPantoja:Left4Dead2@devclosterrams.nodjj.mongodb.net/profepacoDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    img: String
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    })
});

export const Users = mongoose.model('Users', userSchema);

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

export const Courses = mongoose.model('Courses', courseSchema);


const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
});

export const Admins = mongoose.model('Admins', adminSchema);