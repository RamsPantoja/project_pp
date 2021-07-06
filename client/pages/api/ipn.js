import mercadopago from 'mercadopago';
import Courses from '../../models/Courses';
import dbConnect from '../../lib/dbConnect';
import Users from '../../models/Users';

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
});
/*
Atencion!! Este codigo se encarga de las notificaciones webhook que mercado pago enviara despues de que se acredite cualquier regular_payment. excluyendo los pagos relacionados con
las suscripciones.
*/
const webHooks = async (req, res) => {
    if (req.method === 'POST') {
        //Accede al cuerpo de la peticion post y la guarda en BodyNotification.
        const bodyNotification = req.body;
        const { type, data } = bodyNotification;

        switch (type) {
            case 'payment':
                //Convierte el id de tipo string a number, para poder obtener el pago con el id a traves del SDK de mercado pago.
                const idPaymentNumber = parseInt(data.id);

                //Se obtiene el pago desde la api con el sdk de mercado pago.
                const responseMercadoPagoPayment = await mercadopago.payment.get(idPaymentNumber);
                const payment = responseMercadoPagoPayment.body;

                if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                    await dbConnect();

                    const course = await Courses.findOne({_id: payment.additional_info.items[0].id});

                    if (!course) {
                        return res.status(401).send('Course no found');
                    }

                    const user = await Users.findOne({email: payment.payer.email}, 'firstname lastname email');

                    if (!user) {
                        return res.status(401).send('User no found');
                    }

                    let userAlreadyExistInCourse = false;

                    //Busca en el array enrollmentUsers el email con el que se hizo la compra, si email existe, retorna true.
                    //Para verificar si el usuario ya se ha inscrito anteriormente en el curso.
                    for (let index = 0; index < course.enrollmentUsers.length; index++) {
                        if (payment.payer.email === course.enrollmentUsers[index].email) {
                            userAlreadyExistInCourse = true;
                        }
                    }

                    //Solo si el pago que se ha hecho es de tipo regular_payment, se agregara el usuario al curso.
                    try {
                        if (payment.operation_type === 'regular_payment') {
                            //Crea un nuevo objeto con los datos de user y agrega una nueva key payment.
                            const userWithRegularPayment = {
                                ...user._doc,
                                payment: payment.transaction_amount
                            }

                            //Si el usuario ya existe en enrollmentUsers del curso comprado y el pago del usuario es la mitad del precio del curso, entonces, actualiza la key payment del objecto user en enrollmentUsers.
                            if (userAlreadyExistInCourse) {
                                if(payment.transaction_amount === course.price/2) {
                                    await Courses.findOneAndUpdate(
                                        {title: payment.description, 'enrollmentUsers.email': payment.payer.email},
                                        {$set: { 'enrollmentUsers.$.payment': course.price}}
                                    )
                                }
                            } else if (userAlreadyExistInCourse === false) {
                                course.enrollmentUsers.unshift(userWithRegularPayment);
                                course.save();
                            }
                        }
                        return res.status(200).send('OK');
                    } catch (error) {
                        return res.status(401).send(error);
                    }
                }
                break;
            default:
                return res.status(200).send('Ok');
        }
        
    }
}

export default webHooks;