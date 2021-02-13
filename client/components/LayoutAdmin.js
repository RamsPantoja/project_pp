import React from 'react';
import styles from './styles/LayoutAdmin.module.css';
import Sidebar from './Sidebar';
import ControlPanel from './ControlPanel';
import HeaderAdmin from './HeaderAdmin';

const LayoutAdmin = ({children}) => {
    return (
        <div className={styles.adminLayout}>
            <Sidebar/>
            <ControlPanel>
                <HeaderAdmin/>
                {children}
            </ControlPanel>
        </div>
    )
}

export default LayoutAdmin;