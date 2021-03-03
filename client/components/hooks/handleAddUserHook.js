import { useCallback, useEffect, useState } from 'react';


export const stateSchemaInfUser = {
    firstname: { value: '', errorfield: 'SignUpForm_input'},
    lastname: { value: '', errorfield: 'SignUpForm_input'},
    email: { value: '', errorfield: 'SignUpForm_input'},
    password: { value: '', error: '', errorfield: 'SignUpForm_input'},
    confirmpassword: { value: '', error: '', errorfield: 'SignUpForm_input'}
}

export const validationSchema = {
    firstname: { required: true},
    lastname: { required: true},
    email: { required: true},
    password: { 
        required: true,
        validator: {
            regEx: /^[\w.@-\s]{6,}$/,
            error: 'Minimo 6 digitos, sin caracteres especiales.'
        }
    },
    confirmpassword: { required: true}
}

export const disableSchema = {
    status: true,
    error: ''
}

const useFormValidation = (stateSchema, validationSchema = {}, disableSchema) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);
    const [passwordNoMatch, setPasswordNoMatch] = useState(false)

    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchema).some( key => {
            const isInputRequired = validationSchema[key].required;
            const stateValue = state[key].value;
            const stateError = state[key].error;
            const password = state.password.value;
            const confirmpassword = state.confirmpassword.value;

            return (isInputRequired && !stateValue) || (confirmpassword !== password) || stateError;
        })

        return hasErrorInState;
    }, [validationSchema, state]);

    useEffect(() => {
        setDisable(() => ({
            ...disableSchema,
            status: true
        }));
    },[disableSchema]);

    useEffect(() => {
        if (isDirty) {
            setDisable(() => ({
                ...disableSchema,
                status: validateState(),
            }))
        }

        if (validateState()) {
            setDisable(() => ({
                ...disableSchema,
                error: 'Todos los campos son obligatorios'
            }))
        }
    }, [isDirty, disableSchema, validateState])

    //Confirma que las password sean iguales.
    useEffect(() => {
        if (state.confirmpassword.value !== state.password.value) {
            setPasswordNoMatch(true);
        } else {
            setPasswordNoMatch(false);
        }
    }, [state]);

    const handleOnChange = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let error = '';
        let errorfield = 'SignUpForm_input'

        if (validationSchema[name].required) {
            if (!value) {
                errorfield = 'SignUpForm_inputError'
            }
        }

        //Valida la expresion regular de la propiedad password en el objeto de validacion.
        if (validationSchema.password.validator !== null && typeof(validationSchema.password.validator) === 'object') {
            if ( name === 'password' && value && !validationSchema.password.validator.regEx.test(value)) {
                error = validationSchema.password.validator.error;
                errorfield = 'SignUpForm_inputError';
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: { value, error, errorfield}
        }))

    }, [validationSchema, passwordNoMatch])

    return [state, disable, handleOnChange, passwordNoMatch];
}

export default useFormValidation;