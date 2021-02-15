import { Button, IconButton, InputAdornment, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styles from './styles/FormAddConcept.module.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import cn from 'classnames';
import AddIcon from '@material-ui/icons/Add'

const FormAddConcept = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const dropDownInputs = (e) => {
        e.preventDefault();
        if(isExpanded) {
            setIsExpanded(false)
        } else {
            setIsExpanded(true)
        }
    }

    const iconArrow = isExpanded ? <IconButton size='small' onClick={(e) => {dropDownInputs(e)}}><ExpandLessIcon/></IconButton> : <IconButton size='small' onClick={(e) => {dropDownInputs(e)}}><ExpandMoreIcon/></IconButton>

    return (
        <div className={styles.formAddConcept}>
            <div className={styles.formInputConcept}>
                <TextField label='Tema' variant='outlined' fullWidth={true}/>
                {iconArrow}
            </div>
            <div className={
                cn({
                    [styles.expandMore]: isExpanded === true,
                    [styles.expandLess]: isExpanded === false
                })
            }>
                <TextField label='Subtema' size='small' variant='outlined'/>
                <Button size='small' startIcon={<AddIcon/>} variant='outlined' color='default'>Agregar subtema</Button>
            </div>
        </div>
    )
}

export default FormAddConcept;