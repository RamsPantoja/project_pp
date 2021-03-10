import mercadopago from 'mercadopago';
import Courses from '../../models/Courses';
import dbConnect from '../../lib/dbConnect';
import Users from '../../models/Users';

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
})

const webHooks = async (req, res) => {
    if (req.method === 'POST') {
        const notification  = req.body;
        switch (notification.type) {
            case 'payment':
                const payment = await fetch(`https://api.mercadopago.com/v1/payments/${notification.data.id}?access_token=${process.env.ACCESS_TOKEN_MP}`).then((apiResult) => {
                    if(apiResult.ok) return apiResult.json();
                });
                //Si el status del pago buscado desde la Api de mercado pago es exactamente igual 'approved' agrega el user al curso.
                if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                    await dbConnect();

                    const course = await Courses.findOne({title: payment.description});

                    if (!course) {
                        return res.status(401).send('Course no found');
                    }

                    const user = await Users.findOne({email: payment.payer.email}, 'firstname lastname email');

                    if(!user) {
                        return res.status(401).send('User no found')
                    }

                    let userAlreadyExistInCourse;

                    //Busca en el array enrollmentUsers el email con el que se hizo la compra, si email existe, retorna true.
                    for (let index = 0; index < course.enrollmentUsers.length; index++) {
                        if (payment.payer.email === course.enrollmentUsers[index].email) {
                            userAlreadyExistInCourse = true;
                        } else {
                            userAlreadyExistInCourse = false;
                        }
                    }

                    //Crea un nuevo objeto con los datos de user y agrega una nueva key payment.
                    const userWithPayment = {
                        ...user._doc,
                        payment: payment.amount
                    }

                    try {
                        //Si el usuario ya existe en enrollmentUsers del curso comprado y el pago del usuario es la mitad del precio del curso, entonces, actualiza la key payment del objecto user en enrollmentUsers.
                        if (userAlreadyExistInCourse) {
                            if(payment.amount === course.price/2) {
                                await Courses.findOneAndUpdate(
                                    {title: payment.description, 'enrollmentUsers.email': payment.payer.email},
                                    {$set: { 'enrollmentUsers.$.payment': course.price}}
                                )
                            }
                        } else if (userAlreadyExistInCourse === false || !userAlreadyExistInCourse) {
                            course.enrollmentUsers.push(userWithPayment);
                            course.save();
                        }
                        return res.status(200).send('Ok');
                    } catch (error) {
                        return res.status(401).send(element);
                    }
                }
            case 'subscription':
                const subscription = mercadopago.payment.findById(notification.data.id);
                return res.status(200).send('ok');
            default:
                return res.status(200).send('todo nice');
        }
    }
}

export default webHooks;