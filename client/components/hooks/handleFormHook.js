import { useCallback, useEffect, useState } from 'react';


const useFormValidation = (stateSchema, validationSchema = {}, disableSchema, user) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);


    useEffect(() => {
        setState(() => ({
            ...stateSchema,
            firstname: {value: user.firstname, errorfield: false},
            lastname: {value: user.lastname, errorfield: false},
            email: {value: user.email, errorfield: false}
        }))
    }, [stateSchema]);

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchema).some((key) => {
            const isInputRequired = validationSchema[key].required;
            const stateValue = state[key].value;

            return (isInputRequired && !stateValue);
        });

        return hasErrorInState;
    }, [validationSchema, state]);

    console.log(validateState())

    useEffect(() => {
        setDisable(() => ({
            ...disableSchema,
            status: true
        }))
    }, [disableSchema]);

    useEffect(() => {
        if(isDirty) {
            setDisable(() => ({
                ...disableSchema,
                status: validateState()
            }));
        }

        if (validateState()) {
            setDisable(() => ({
                ...disableSchema,
                error: 'Todos los campos son obligatorios'
            }))
        } else if (validateState() === false) {
            setDisable(() => ({
                ...disableSchema,
                status: false,
                error: ''
            }))
        }
    }, [isDirty, disableSchema, validateState]);

    const handleOnChange = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if (validationSchema[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, errorfield}
        }));
    });

    return [state, handleOnChange, disable]

}

export default useFormValidation;