import { Button, IconButton, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styles from './styles/FormAddConcept.module.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import cn from 'classnames';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

const FormAddConcept = ({handleOnChangeConceptInput, index, handleAddSubConcept, state, handleOnChangeSubConceptInput, handleDeleteConcept, handleDeleteSubConcept, item}) => {
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
                <TextField label='Tema' variant='outlined' name='concept' fullWidth={true} error={item.errorfield} value={item.value} onChange={(e) => {handleOnChangeConceptInput(e, index)}}/>
                {iconArrow}
                <Button onClick={(e) => {handleDeleteConcept(e, index)}} size='small' style={{color:'#ff5555'}}><DeleteIcon/></Button>
            </div>
            <div className={
                cn({
                    [styles.expandMore]: isExpanded === true,
                    [styles.expandLess]: isExpanded === false
                })
            }>
                { state.conceptList[index].subConceptList.map((item, i) => {
                    return (
                        <div key={i} className={styles.subConceptContainer}>
                            <TextField label='Subtema' size='small' fullWidth={true} name='subConcept' error={item.errorfield} value={item.value} variant='outlined' onChange={(e) => {handleOnChangeSubConceptInput(e, i, index)}}/>
                            <Button onClick={(e) => {handleDeleteSubConcept(e, i, index)}} size='small' style={{color:'#ff5555'}}><DeleteIcon/></Button>
                        </div> 
                    )
                })}
                <Button size='small' startIcon={<AddCircleIcon/>} variant='outlined' color='primary' onClick={(e) => {handleAddSubConcept(e, index)}}>Agregar subtema</Button>
            </div>
        </div>
    )
}

export default FormAddConcept;