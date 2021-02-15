import { Button, IconButton, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styles from './styles/FormAddConcept.module.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import cn from 'classnames';
import AddIcon from '@material-ui/icons/Add'

const FormAddConcept = ({handleOnChangeConceptInput, index, handleAddSubConcept, state, handleOnChangeSubConceptInput}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    console.log(state)

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
                <TextField label='Tema' variant='outlined' name='concept' fullWidth={true} onChange={(e) => {handleOnChangeConceptInput(e, index)}}/>
                {iconArrow}
            </div>
            <div className={
                cn({
                    [styles.expandMore]: isExpanded === true,
                    [styles.expandLess]: isExpanded === false
                })
            }>
                { state.conceptList[index].subConceptList.map((item, i) => {
                    return ( 
                        <TextField key={i} label='Subtema' size='small' name='subConcept' variant='outlined' onChange={(e) =>{handleOnChangeSubConceptInput(e, i, index)}}/>
                    )
                })}
                <Button size='small' startIcon={<AddIcon/>} variant='outlined' color='default' onClick={(e) => {handleAddSubConcept(e, index)}}>Agregar subtema</Button>
            </div>
        </div>
    )
}

export default FormAddConcept;