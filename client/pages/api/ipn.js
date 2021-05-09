import mercadopago from 'mercadopago';
import Courses from '../../models/Courses';
import dbConnect from '../../lib/dbConnect';
import Users from '../../models/Users';

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
})

const ipnNotifications = async (req, res) => {
    if (req.method === 'POST') {
        const {query: {id, topic}} = req;
        switch (topic) {
            case 'payment':
                //Obtiene el pago por id desde la api de mercado pago.
                const responseMercadoPagoPayment = await mercadopago.payment.get(id);
                const payment = responseMercadoPagoPayment.body;
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

                    let userAlreadyExistInCourse = false;

                    //Busca en el array enrollmentUsers el email con el que se hizo la compra, si email existe, retorna true.
                    for (let index = 0; index < course.enrollmentUsers.length; index++) {
                        if (payment.payer.email === course.enrollmentUsers[index].email) {
                            userAlreadyExistInCourse = true;
                        }
                    }

                    try {
                        if (payment.operation_type === 'recurring_payment') {
                            //Obtiene la suscripcion creado por el usuario con toda la informacion relevante.
                            const responseMercadoPagoPreapproval = await mercadopago.preapproval.get(payment.metadata.preapproval_id);
                            const preapproval = responseMercadoPagoPreapproval.body;

                            //Crea un objeto con los datos de la suscripcion y el usuario que se suscribio.
                            const userWithRecurringPayment = {
                                ...user._doc,
                                preapproval_id: preapproval.id,
                                status: preapproval.status,
                            }

                            if (userAlreadyExistInCourse) {
                                await Courses.findOneAndUpdate(
                                    {title: payment.description, 'enrollmentUsers.email': payment.payer.email},
                                    {$set: {
                                        'enrollmentUsers.$.status': userWithRecurringPayment.status,
                                        'enrollmentUsers.$.preapproval_id': userWithRecurringPayment.preapproval_id
                                    }}
                                )
                            } else if (userAlreadyExistInCourse === false) {
                                course.enrollmentUsers.unshift(userWithRecurringPayment);
                                course.save();
                            }
                        }
                        return res.status(200).send('Ok');
                    } catch (error) {
                        return res.status(401).send(error);
                    }
                }
            default:
                return res.status(200).send('todo nice');
        }
    }
}

export default ipnNotifications;