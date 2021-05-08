import mercadopago from 'mercadopago';
import Courses from '../../models/Courses';
import dbConnect from '../../lib/dbConnect';
import Users from '../../models/Users';

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
});

const nofiticationsIpn = async (req, res) => {
    if (req.method === 'GET') {
        const bodyNotification = req.body;
        
    }
}