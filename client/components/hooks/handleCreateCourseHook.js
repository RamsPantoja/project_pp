import { useCallback, useEffect, useState } from "react"

export const stateSchemaInfCourse = {
    title: {value: '', errorfield: false},
    description: { value: '', errorfield: false},
    teacher: { value: '', errorfield: false},
    objectives: []
}

export const validationSchemaCourse = {
    title: { required: true },
    description: { required: true},
    teacher: { required: true},
    objective: { required: true }
}

export const disableSchemaCourse = {
    status: true,
    error: ''
}

const useHandleFormCourse = (stateSchema, validationSchemaCourse = {}, disableSchemaCourse) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchemaCourse);
    const [isDirty, setIsDirty] = useState(false);
    const [count, setCount] = useState(0)

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchemaCourse).some((key) => {
            const isInputRequired = validationSchemaCourse[key].required;
            const stateValue = state[key].value

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
        e.preventDefault();
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
        e.preventDefault();
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
        setState((prevState) => ({
            ...prevState,
            objectives: prevState.objectives.concat(count)
        }))
        setCount(count+1);
    }

    return [state, disable, handleOnChange, handleOnChangeObjetiveInput, handleAddObjetive]
}

export default useHandleFormCourse;