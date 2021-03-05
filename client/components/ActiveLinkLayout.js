import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from './styles/Layout.module.css';

const ActiveLinkLayout = React.forwardRef(({name, href}, ref) => {
    const router = useRouter();

    const handleOnClickLink = (e) => {
        e.preventDefault();
        router.push(href)
    }

    return (
        <a ref={ref} href={href} onClick={(e) => {handleOnClickLink(e)}} className={
            cn({
                [styles.header_linkInf]: router.pathname !== href,
                [styles.header_linkInfActived]: router.pathname === href
            })
        }>
            {name}
        </a>
    )
})

export default ActiveLinkLayout;