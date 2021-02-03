import { useCallback, useEffect, useState } from 'react';

export const authUserSchema = {
    email: { value: '', errorfield: 'loginForm_input'},
    password: { value: '', errorfield: 'loginForm_input'}
}

export const disableSchema = {
    status: true,
    error: ''
}

export const validationSchema = {
    email: { required: true },
    password: { required: true }
}


const useAuthFormValidation = (stateSchema, validationSchema = {}, disableSchema) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchema).some((key) => {
            const isInputRequired = validationSchema[key].required;
            const stateValue = state[key].value;
            const stateError = state[key].error;

            return (isInputRequired && !stateValue) || stateError;
        });

        return hasErrorInState;
    }, [validationSchema, state]);

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
        }
    }, [isDirty, disableSchema, validateState]);

    const handleOnChange = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = 'loginForm_input';

        if (validationSchema[name].required) {
            if(!value) {
                errorfield = 'loginForm_inputError';
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, errorfield}
        }));
    });

    return [state, handleOnChange, disable]

}

export default useAuthFormValidation;



