import { useCallback, useEffect, useState } from 'react';

export const validationSchemaPassword = {
    currentPassword: {required: true},
    newPassword: { 
        required: true,
        validator: {
            regEx: /^[\w.@-\s]{6,}$/,
            error: 'Minimo 6 digitos, sin caracteres especiales.'
        }
    },
    confirmNewPassword: {required: true}
}

export const stateSchemaPassword = {
    currentPassword: {value: '', errorfield: false},
    newPassword: {value: '', errorfield: false},
    confirmNewPassword: {value: '', errorfield: false}
}


export const disableSchema = {
    status: true,
    error: ''
}


const useFormValidationAccountPassword = (stateSchema, validationSchema = {}, disableSchema) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);

    //Valida el estate en base al objeto de validacion {validationSchema} pasado por props.
    const validateState = useCallback(() => {
        const hasErrorInState = Object.keys(validationSchema).some((key) => {
            const isInputRequired = validationSchema[key].required;
            const stateValue = state[key].value;
            return (isInputRequired && !stateValue);
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
        //Actualiza el status en disableSchema para validar el formulario.
        if (validateState()) {
            setDisable(() => ({
                ...disableSchema,
                error: 'Todos los campos son obligatorios.'
            }))
        } else if (state.confirmNewPassword.value !== state.newPassword.value) {
            setDisable(() => ({
                ...disableSchema,
                status: true,
                error: 'Las contraseñas no coinciden.'
            }))
        }
    }, [isDirty, disableSchema, validateState, state]);

    //Lee los cambios en los inputs y actualiza el state con los valores leidos de los inputs.
    const handleOnChange = useCallback((e) => {
        setIsDirty(true);
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;
        let error = ''

        if (validationSchema[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        if (validationSchema.newPassword.validator !== null && typeof(validationSchema.newPassword.validator) === 'object') {
            if ( name === 'newPassword' && value && !validationSchema.newPassword.validator.regEx.test(value)) {
                error = validationSchema.newPassword.validator.error;
                errorfield = true;
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, error, errorfield}
        }));
    });

    return [state, handleOnChange, disable]

}

export default useFormValidationAccountPassword;