import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://RamsPantoja:Left4Dead2@devclosterrams.nodjj.mongodb.net/profepacoDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
});

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    img: String
})

export const Users = mongoose.model('Users', userSchema);