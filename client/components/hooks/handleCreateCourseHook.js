import { useCallback, useEffect, useState } from "react"

export const stateSchemaInfCourse = {
    title: {value: '', errorfield: false},
    description: { value: '', errorfield: false},
    teacher: { value: '', errorfield: false},
    objectives: [{value: '', errorfield: false}],
    conceptList: [{
        concept: { value: '', errorfield: false},
        subConceptList: [{value: '', errorfield: false}]
    }],
    price: {value: '', errorfield: false},
    enrollmentLimit: {value: '', errorfield: false},
    img: {filename: '', errorfield: false, file: ''},
    modeSuscription: { value: false, errorfield: false},
    amountMonths: { value: '', errorfield: false},
    onePay: { value: false, errorfield: false}
}

export const validationSchemaCourseAdd = {
    title: { required: true },
    description: { required: true},
    teacher: { required: true},
    objective: { required: true },
    concept: { required: true},
    subConcept: { required: true},
    objectives: { required: true},
    conceptList: { required: true},
    price: { required: true},
    enrollmentLimit: { required: true},
    img: { required: true},
    modeSuscription: { required: false},
    amountMonths: { required: false},
    onePay: { required: false}
}


export const validationSchemaCourseEdit = {
    title: { required: true },
    description: { required: true},
    teacher: { required: true},
    objective: { required: true },
    concept: { required: true},
    subConcept: { required: true},
    objectives: { required: true},
    conceptList: { required: true},
    price: { required: true},
    enrollmentLimit: { required: true},
    img: { required: false},
    modeSuscription: { required: false},
    amountMonths: { required: false},
    onePay: { required: false}
}




export const disableSchemaCourse = {
    status: true,
    error: ''
}

const useHandleFormCourse = (stateSchemaInfCourse, validationSchemaCourse = {}, disableSchemaCourse, courseData) => {
    const [state, setState] = useState(stateSchemaInfCourse);
    const [disable, setDisable] = useState(disableSchemaCourse);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if(courseData) {
            setState(() => ({
                ...stateSchemaInfCourse,
                title: {value: courseData.title, errorfield: false},
                description: {value: courseData.description, errorfield: false},
                teacher: {value: courseData.teacher, errorfield: false},
                price: {value: courseData.price, errorfield: false},
                enrollmentLimit: {value: courseData.enrollmentLimit, errorfield: false},
                objectives: courseData.objectives.map((item) => {
                    return item = {value: item, errorfield: false}
                }),
                conceptList: courseData.conceptList.map((concept) => {
                    return concept = {
                        concept: {value: concept.concept, errorfield: false},
                        subConceptList: concept.subConceptList.map((subConcept) => {
                            return subConcept = {value: subConcept, errorfield: false}
                        })
                    }
                }),
                onePay: { value: courseData.onePay, errorfield: false}
            }))
        }
    }, [courseData, stateSchemaInfCourse]);

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchemaCourse).some((key) => {
            const isInputRequired = validationSchemaCourse[key].required;
            const titleValue = state.title.value;
            const descriptionValue = state.description.value;
            const teacherValue = state.teacher.value;
            const priceValue = state.price.value;
            const imgValue = state.img.filename;
            const isInputRequiredImg = validationSchemaCourse.img.required;
            const enrollmentLimitValue = state.enrollmentLimit.value;
            const modeSuscriptionValue = state.modeSuscription.value;
            const isInputRequiredModeSuscription = validationSchemaCourse.modeSuscription.required;
            const amountMonthsValue = state.amountMonths.value;
            const isInputRequiredAmountMonths = validationSchemaCourse.amountMonths.required;
            const onePayValue = state.onePay.value;
            const isOnePayRequired = validationSchemaCourse.onePay.required;

            //Retorna un True si no hay valor en alguno de los campos objective
            const hasErrorInObjectives = Object.keys(state.objectives).some((key) => {
                const objectiveValue = state.objectives[key].value;

                return !objectiveValue;
            });
            const hasErrorInConceptList = Object.keys(state.conceptList).some((key) => {
                const lengthSubConceptList = state.conceptList[key].subConceptList.length;
                const conceptValue = state.conceptList[key].concept.value;
                const hasErrorInSubConceptList = Object.keys(state.conceptList[key].subConceptList).some((keySubConcept) => {
                    const subConceptValue = state.conceptList[key].subConceptList[keySubConcept].value;
                    return !subConceptValue;
                })

                return (!conceptValue || hasErrorInSubConceptList || lengthSubConceptList === 0);
            })
            const lengthObjetives = state.objectives.length;
            const lengthConceptList = state.conceptList.length;
            return (isInputRequired &&  !titleValue || !descriptionValue || !teacherValue || !priceValue || !enrollmentLimitValue) 
                || (isInputRequired && hasErrorInObjectives || lengthObjetives === 0 ) 
                || (isInputRequired && hasErrorInConceptList || lengthConceptList === 0) 
                || (isInputRequiredImg && !imgValue) 
                || (isInputRequiredModeSuscription && !modeSuscriptionValue) 
                || (isInputRequiredAmountMonths && !amountMonthsValue)
                || (isOnePayRequired && !onePayValue)
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
        } else if (validateState() === false ) {
            setDisable(() => ({
                ...disableSchemaCourse,
                status: validateState(),
                error: ''
            }))
        }
    }, [validateState, isDirty, disableSchemaCourse]);

    //Lee los campos sobrantes que no se repiten y los actualiza con el valor leido.
    const handleOnChange = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        let value = e.target.value
        let errorfield = false;

        if (validationSchemaCourse[name].required) {
            if (!value) {
                errorfield = true
            }
        }

        if (name === 'modeSuscription') {
            value = e.target.checked;
        }

        if (name === 'onePay') {
            value = e.target.checked
        }

        setState((prevState) => ({
            ...prevState,
            [name]: { value, errorfield}
        }));
    }, [validationSchemaCourse]);

    //Lee el campo img y extrae el nombre de la imagen seleccionada con la expresion regular /[\/\\]([\w\d\s\.\-\(\)]+)$/
    const handleOnChangeImg = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        const file = e.target.files[0];
        const value = e.target.value;
        let errorfield = false;
        let filename = ''

        if (validationSchemaCourse[name].required) {
            if(!value) {
                errorfield= true
            }
        }

        if(value) {
            filename = value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {filename, errorfield, file}
        }))

    }, [validationSchemaCourse]);

    //Lee los campos Objetive del formualrio de crear cursos y actualiza el campo objetive por el valor leido.
    const handleOnChangeObjetiveInput = useCallback((e, index) => {
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

    },[validationSchemaCourse, state]);

    //Agrega campos objetivo en el campo objectives
    const handleAddObjetive = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            objectives: prevState.objectives.concat({value: '', errorfield: false})
        }))
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
            conceptList: prevState.conceptList.concat({concept: {value: '', errorfield: false}, subConceptList:[{value: '', errorfield: false}]})
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
    const handleOnChangeConceptInput = useCallback((e, index) => {
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

    },[validationSchemaCourse, state]);

    //Agrega campos dentro el campo subConcepList;
    const handleAddSubConcept = useCallback((e, index) => {
        e.preventDefault();

        const subConcept = state.conceptList.map((item, i) => {
            if (index !== i) return item;
            
            return {
                ...item,
                subConceptList: state.conceptList[index].subConceptList.concat({value: '', errorfield: false})
            }
        })

        setState((prevState) => ({
            ...prevState,
            conceptList: subConcept
        }))
    }, [state])

    //Elimina el campo dentro de subConceptList
    const handleDeleteSubConcept = useCallback((e, i, indexConcept) => {
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
    },[state])
    
    //Lee el campo Subtema y actualiza el state en base a que campo subtema se esta modificando y en el campo Tema que se esta modificando.
    //Haciendo uso del index de cada campo que ha sido renderizado en los camponentes CourseForm y FormAddConcept con la funcion map.
    const handleOnChangeSubConceptInput = useCallback((e, i, indexConcept) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if(validationSchemaCourse[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        //Mapea los items dentro de subConceptList y solo edita el campo donde escribimos es exactamente igual al index mapeado.
        const subConceptValue = state.conceptList[indexConcept].subConceptList.map((item, index) => {
            if (i !== index) return item;
            return item = {value: value, errorfield: errorfield}
        });

        //Mapea conceptList y remplazada el campo subConceptList con el nuevo subConceptValue.
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
    }, [validationSchemaCourse, state]);

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
        handleDeleteSubConcept,
        handleOnChangeImg
    ]
}

export default useHandleFormCourse;