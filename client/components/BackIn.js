import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';

const BackIn = () => {
    const [timer, setTimer] = useState(5);
    const [progress, setProgress] = useState(0)
    const router = useRouter();

    useEffect(() => {
        if (timer > 0) {
            var timeOut = setTimeout(() => {
                let time = timer - 1;
                setTimer(time)
                setProgress((prevProgress) => ( prevProgress >= 100 ? 0 : prevProgress + 20));
            }, 1000);
        }

        return () => {
            clearTimeout(timeOut);
        }
    }, [setTimer, timer]);

    if (timer === 0) {
        router.push('/app/signin');
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '1em'}}>
            <CircularProgress variant='determinate' size={30} value={progress}/>
            <p>Redirección a Iniciar sesión en {timer} segundos.</p>
        </div>
    )
}

export default BackIn;