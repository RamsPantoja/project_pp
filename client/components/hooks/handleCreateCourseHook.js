import { useCallback, useEffect, useState } from "react"

export const stateSchemaInfCourse = {
    title: {value: '', errorfield: false},
    description: { value: '', errorfield: false},
    teacher: { value: '', errorfield: false},
    objectives: [{value: '', errorfield: false}],
    conceptList: [{
        concept: { value: '', errorfield: false},
        subConceptList: [{value: '', errorfield: false}]
    }]
}

export const validationSchemaCourse = {
    title: { required: true },
    description: { required: true},
    teacher: { required: true},
    objective: { required: true },
    concept: { required: true},
    subConcept: { required: true},
    objectives: { required: true},
    conceptList: { required: true}
}



export const disableSchemaCourse = {
    status: true,
    error: ''
}

const useHandleFormCourse = (stateSchemaInfCourse, validationSchemaCourse = {}, disableSchemaCourse) => {
    const [state, setState] = useState(stateSchemaInfCourse);
    const [disable, setDisable] = useState(disableSchemaCourse);
    const [isDirty, setIsDirty] = useState(false);
    const [count, setCount] = useState(0);
    const [subConceptCount, setSubConceptCount] = useState(0);

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchemaCourse).some((key) => {
            const isInputRequired = validationSchemaCourse[key].required;
            const titleValue = state.title.value;
            const descriptionValue = state.description.value;
            const teacherValue = state.teacher.value;
            const objectivesValue = Object.keys(state.objectives).some((key) => {
                const objectiveValue = state.objectives[key].value;

                return objectiveValue;
            });
            const conceptListValue = Object.keys(state.conceptList).some((key) => {
                const conceptValue = state.conceptList[key].concept.value;
                const subConceptsValue = Object.keys(state.conceptList[key].subConceptList).some((keySubConcept) => {
                    const subConceptValue = state.conceptList[key].subConceptList[keySubConcept].value;
                    return subConceptValue;
                })

                return (concep)
            })
            return (isInputRequired && (!titleValue || !descriptionValue || !teacherValue || !objectivesValue)) 
        })

        return hasErrorInState;
    },[validationSchemaCourse, state])

    useEffect(() => {
        setDisable(() => ({
            ...disableSchemaCourse,
            status: true
        }))
    }, [disableSchemaCourse]);

    useEffect(() => {
        if (isDirty) {
            setDisable(() => ({
                ...disableSchemaCourse,
                status: validateState()
            }))
        }

        if (validateState()) {
            setDisable(() => ({
                ...disableSchemaCourse,
                error: 'Todos los campos son obligatorios'
            }))
        }
    }, [validateState, isDirty, disableSchemaCourse]);

    //Lee los campos sobrantes que no se repiten y los actualiza con el valor leido.
    const handleOnChange = (e) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value
        let errorfield = false;

        if (validationSchemaCourse[name].required) {
            if (!value) {
                errorfield = true
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: { value, errorfield}
        }))
    }

    //Lee los campos Objetive del formualrio de crear cursos y actualiza el campo objetive por el valor leido.
    const handleOnChangeObjetiveInput = (e, index) => {
        setIsDirty(true)
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if (validationSchemaCourse[name].required) {
            if (!value) {
                errorfield = true
            }
        }

        const objective = state.objectives.map((item, i) => {
            if (index !== i) return item;
            return item = { value: value, errorfield: errorfield}
        })

        setState((prevState) => ({
            ...prevState,
            objectives: objective
        }))

    }

    //Agrega campos objetivo en el campo objectives
    const handleAddObjetive = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            objectives: prevState.objectives.concat(count)
        }))
        setCount(count+1);
    }

    //Elimina el campo objetivo del campo objectives
    const handleDeleteObjetive = (e, index) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            objectives: state.objectives.filter((objetive, i) => index !== i)
        }))

    }

    //Agrega Campos dentro del campo conceptList
    const handleAddConcept = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            conceptList: prevState.conceptList.concat({concept:'', subConceptList:[]})
        }));
    }

    //elimina el campo Concept del campo conceptList
    const handleDeleteConcept = (e, index) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            conceptList: prevState.conceptList.filter((concept, i) => index != i)
        }))
    }

    //Lee los campos Tema del formulario de crear Cursos y actualiza los campos concept y subconcept
    const handleOnChangeConceptInput = (e, index) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false

        if(validationSchemaCourse[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        const concept = state.conceptList.map((item, i) => {
            if (index !== i) return item;
            return {
                ...item,
                concept: {value: value, errorfield: errorfield}
            }
        })

       setState((prevState) => ({
           ...prevState,
           conceptList: concept
       }))

    }

    //Agrega campos dentro el campo subConcepList;
    const handleAddSubConcept = (e, index) => {
        e.preventDefault();

        const subConcept = state.conceptList.map((item, i) => {
            if (index !== i) return item;
            
            return {
                ...item,
                subConceptList: state.conceptList[index].subConceptList.concat(subConceptCount)
            }
        })

        setState((prevState) => ({
            ...prevState,
            conceptList: subConcept
        }))
        setSubConceptCount(subConceptCount+1)
    }

    //Elimina el campo dentro de subConceptList
    const handleDeleteSubConcept = (e, i, indexConcept) => {
        console.log(indexConcept)
        e.preventDefault();

        const subConceptList = state.conceptList.map((item, index) => {
            if(indexConcept !== index) return item;
            return {
                ...item,
                subConceptList: state.conceptList[indexConcept].subConceptList.filter((subConcept, index) => i !== index)
            }
        })

        setState((prevState) => ({
            ...prevState,
            conceptList: subConceptList
        }))
    }
    
    //Lee el campo Subtema y actualiza el state en base a que campo subtema se esta modificando y en el campo Tema que se esta modificando.
    //Haciendo uso del index de cada campo que ha sido renderizado en los camponentes CourseForm y FormAddConcept con la funcion map.
    const handleOnChangeSubConceptInput = (e, i, indexConcept) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if(validationSchemaCourse[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        const subConceptValue = state.conceptList[indexConcept].subConceptList.map((item, index) => {
            if (i !== index) return item;
            return item = {value: value, errorfield: errorfield}
        });

        const concept = state.conceptList.map((item, index) => {
            if(indexConcept !== index) return item;
            return {
                ...item,
                subConceptList: subConceptValue
            }
        })

        setState((prevState) => ({
            ...prevState,
            conceptList: concept
        }))
    }

    //Retornamos todos los metodos.
    return [
        state, 
        disable, 
        handleOnChange, 
        handleOnChangeObjetiveInput, 
        handleAddObjetive, 
        handleAddConcept, 
        handleOnChangeConceptInput, 
        handleAddSubConcept, 
        handleOnChangeSubConceptInput, 
        handleDeleteObjetive,
        handleDeleteConcept,
        handleDeleteSubConcept
    ]
}

export default useHandleFormCourse;