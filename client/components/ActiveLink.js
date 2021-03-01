import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from './styles/ActiveLink.module.css';


const ActiveLink = React.forwardRef(({children, name, href}, ref) => {
    const router = useRouter();

    const handleOnClickLink = (e) => {
        e.preventDefault();
        router.push(href)
    }
    return (
        <a ref={ref} href={href} onClick={(e) => {handleOnClickLink(e)}} className={
            cn({
                [styles.sectionAccount]: router.pathname !== href,
                [styles.sectionAccountActived]: router.pathname === href
            })
        }>
            {children}
            {name}
        </a>
    )
})

export default ActiveLink;