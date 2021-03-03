import { useCallback, useEffect, useState } from 'react';

export const stateSchemaEmail = {
    email: {value: '', error: '' , errorfield: false}
}


export const validationSchemaEmail = {
    email: {required: true}
}


export const disableSchema = {
    status: true,
    error: ''
}

const useFormValidationAccountEmail = (stateSchema, validationSchema = {}, disableSchema, email) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);

    //Actualiza la prop email del stateSchema con la prop {email} pasada a la funcion useFormValidationAccountEmail y despues se actualiza el state.
    useEffect(() => {
        setState(() => ({
            ...stateSchema,
            email: {value: email, errorfield: false}
        }))
    }, [email, stateSchema])

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
                error: 'Campo obligatorio'
            }))
        } else if (validateState() === false) {
            setDisable(() => ({
                ...disableSchema,
                status: false,
                error: ''
            }))
        }
    }, [isDirty, disableSchema, validateState]);

    //Lee los cambios en los inputs y actualiza el state con los valores leidos de los inputs.
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

export default useFormValidationAccountEmail;