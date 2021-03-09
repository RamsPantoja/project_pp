import mercadopago from 'mercadopago';
import Courses from '../../models/Courses';
import dbConnect from '../../lib/dbConnect';
import Users from '../../models/Users';

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
})

const webHooks = async (req, res) => {
    if (req.method === 'POST') {
        const notification = req.body;
        switch (notification.type) {
            case 'payment':
                const payment = await mercadopago.payment.findById(notification.id);
                if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                    await dbConnect();

                    const course = await Courses.findOne({title: payment.description});

                    if (!course) {
                        return res.status(401).send('Course no found');
                    }

                    const user = await Users.findOne({email: payment.payer.email});

                    if(!user) {
                        return res.status(401).send('User no found')
                    }

                    try {
                        course.enrollmentUsers.push(user);
                        course.save();
                        return res.status(200).send('Ok');
                    } catch (error) {
                        return res.status(401).send(error);
                    }
                }
                break;
            case 'subscription':
                const subscription = mercadopago.payment.findById(notification.data.id);
                return res.status(200).send('ok');
            default:
                await Users.findOneAndUpdate({email: 'worddraco1@gmail.com'}, {isConfirmated: false});
                return res.status(200).send('todo nice');
        }
    }
}

export default webHooks;