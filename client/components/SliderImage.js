import React, { useEffect, useState } from 'react';
import styles from './styles/SliderImage.module.css';
import Image from 'next/image';

const SliderImage = () => {
    const sliderArray = [
        <Image src='/images/cazadores_letras.png' layout='fill' objectFit='contain' />,
        <Image src='/images/profepaco_escuela.png' layout='fill' objectFit='contain'/>,
        <Image src='/images/cazadores_numeros.png' layout='fill' objectFit='contain'/>
    ];

    const [x, setX] = useState(0);
    const [isFinalImg, setIsFinalImg] = useState(false);

    useEffect(() => {
        let timerToSlideImg = setTimeout(() => {
                                if ( x === 0 || x > -1 * 100 * (sliderArray.length - 1) && !isFinalImg) {
                                    setIsFinalImg(false)
                                    setX(x - 100);
                                } else if ( x === -1 * 100 * (sliderArray.length -1 ) || x > -1 * 100 * (sliderArray.length - 1)) {
                                    setIsFinalImg(true)
                                    setX(x + 100)
                                }
                            }, 5000);

        return () => {
            clearTimeout(timerToSlideImg);
        }
    },[x]);

    return (
        <div className={styles.sliderImage}>
            { sliderArray.map((item, index) => {
                return (
                    <div className={styles.slide} key={index} style={{transform: `translateX(${x}%)`}}>
                        {item}
                    </div>
                )
            })}
        </div>
    )
}

export default SliderImage;