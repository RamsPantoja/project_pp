import { useCallback, useEffect, useState } from "react"

export const stateSchemaInfCourse = {
    title: {value: '', errorfield: false},
    description: { value: '', errorfield: false},
    teacher: { value: '', errorfield: false},
    objectives: [],
    conceptList: []
}

export const validationSchemaCourse = {
    title: { required: true },
    description: { required: true},
    teacher: { required: true},
    objective: { required: true },
    concept: { required: true},
    subConcept: { required: true}
}



export const disableSchemaCourse = {
    status: true,
    error: ''
}

const useHandleFormCourse = (stateSchema, validationSchemaCourse = {}, disableSchemaCourse) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchemaCourse);
    const [isDirty, setIsDirty] = useState(false);
    const [count, setCount] = useState(0);
    const [subConceptCount, setSubConceptCount] = useState(0);

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchemaCourse).some((key) => {
            const isInputRequired = validationSchemaCourse[key].required;
            const stateValue = state[key].value;

            return (isInputRequired && !stateValue)
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

    const handleAddObjetive = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            objectives: prevState.objectives.concat(count)
        }))
        setCount(count+1);
    }

    const handleAddConcept = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState,
            conceptList: prevState.conceptList.concat({subConceptList:[]})
        }));
    }

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


    }

    const handleAddSubConcept = (e, index) => {
        e.preventDefault();

        const subConcept = state.conceptList.map((item, i) => {
            if (index !== i) return item;
            
            return item.subConceptList.push(subConceptCount)
        })
        setState((prevState) => ({
            ...prevState,
            conceptList: [{
                subConceptList: subConcept
            }]
        }))
        setSubConceptCount(subConceptCount+1)
    }


    return [state, disable, handleOnChange, handleOnChangeObjetiveInput, handleAddObjetive, handleAddConcept, handleOnChangeConceptInput, handleAddSubConcept]
}

export default useHandleFormCourse;