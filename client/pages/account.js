import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

const Account = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    

    useEffect(() => {
        setUserEmail(router.query.profile)
    }, [router])
    return (
        <Layout>
            <h1>hola</h1>
        </Layout>
    )
}

export default Account;