import { useCallback, useEffect, useState } from 'react';


const useFormValidation = (stateSchema, validationSchema = {}, disableSchema, user) => {
    const [state, setState] = useState(stateSchema);
    const [disable, setDisable] = useState(disableSchema);
    const [isDirty, setIsDirty] = useState(false);

    //Actualiza el state dependiendo de la entrada del user.
    useEffect(() => {
        if(user.id) {
            setState(() => ({
                ...stateSchema,
                firstname: {value: user.firstname, errorfield: false},
                lastname: {value: user.lastname, errorfield: false},
                email: {value: user.email, errorfield: false}
            }));
        } else if (typeof(user) === 'string') {
            setState(() => ({
                ...stateSchema,
                email: {value: user, errorfield: false}
            }));
        } else {
            setState(() => ({
                ...stateSchema,
            }))
        }
    }, [stateSchema, user]);

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
        let error = ''

        if (validationSchema[name].required) {
            if(!value) {
                errorfield = true;
                error = 'Campo obligatorio'
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, error, errorfield}
        }));
    });

    return [state, handleOnChange, disable]

}

export default useFormValidation;