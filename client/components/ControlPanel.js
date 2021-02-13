import React from 'react';
import styles from './styles/ControlPanel.module.css';

const ControlPanel = ({children}) => {
    return (
        <div className={styles.controlPanelContainer}>
            {children}
        </div>
    )
}

export default ControlPanel;