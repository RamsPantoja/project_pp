import dbConnect from '../../../lib/dbConnect';
import Users from '../../../models/Users';
import jtw from 'jsonwebtoken';

const confirmationEmail = async (req, res) => {
    await dbConnect();
    const {query: {token}} = req;

    try {
        const userId = await jtw.verify(token, process.env.SECRET_EMAIL_TOKEN);
        await Users.findOneAndUpdate({_id: userId._id}, {isConfirmated: true});
    } catch (error) {
        res.send(error);
    }
    
    return res.status(200).redirect('http://localhost:3000/app/signin?callbackUrl=http://localhost:3000/');
}

export default confirmationEmail;