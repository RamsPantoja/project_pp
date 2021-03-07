import { getSession } from 'next-auth/client';
import React, { useState } from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/users.module.css';
import UserCard from '../../../components/UserCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GET_ALL_USERS, GET_USER_BY_EMAIL } from '../../../apollo/querys';
import { Button, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { DELETE_USER_BY_EMAIL } from '../../../apollo/mutations';
import { useSnackbar } from 'notistack';
import Head from 'next/head';

const Users = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        email: {value: '', errorfield: false, required: true}
    });

    const [deleteUserByEmail, {data: dataDeleteUserByEmail, error: errorDeleteUserByEmail, loading: loadingDeleteUserByEmail}] = useMutation(DELETE_USER_BY_EMAIL, {
        onCompleted: async (dataDeleteUserByEmail) => {
            enqueueSnackbar(dataDeleteUserByEmail.deleteUserByEmail, {variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center'}});
        },
        onError: async (errorDeleteUserByEmail) => {
            enqueueSnackbar(errorDeleteUserByEmail.message, {variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center'}})
        }
    });

    const [ getUserByEmail, {data: dataUserByEmail, loading: loadingUserByEmail, error: errorUserByEmail}] = useLazyQuery(GET_USER_BY_EMAIL);

    const {data, error, loading, fetchMore} = useQuery(GET_ALL_USERS, {
        variables: {
            limit: 3
        }
    })

    if (loading || loadingUserByEmail) {
        return (
            <LayoutAdmin>
                <div className={styles.usersContainerLoader}>
                    <CircularProgress/>
                </div>
            </LayoutAdmin>
        )
    }

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let errorfield = false;

        if(state[name].required) {
            if(!value) {
                errorfield = true;
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: {value, errorfield, required:true}
        }))
    }

    const handleGetUserByEmail = (e) => {
        e.preventDefault();
        getUserByEmail({
            variables: {
                email: state.email.value
            }
        })
    }




    const userCardByEmail = dataUserByEmail && !loadingUserByEmail? <UserCard mutation={deleteUserByEmail} firstname={dataUserByEmail.getUserByEmail.firstname} lastname={dataUserByEmail.getUserByEmail.lastname} email={dataUserByEmail.getUserByEmail.email} userId={dataUserByEmail.getUserByEmail.id}/> : null
    const anyApolloError = error ? <span className={styles.disableErrorAlert}>{error.message}</span> : null
    const errorUserByEmailApollo = errorUserByEmail && !dataUserByEmail ? <span className={styles.disableErrorAlert}>{errorUserByEmail.message}</span> : null
    const buttonToLoadMore = data.getUsers.users.length >= 1 ? <Button variant='contained' style={{backgroundColor: '#15639d', color: '#ffffff'}} onClick={ async () => {await fetchMore({variables: {after: data.getUsers.users[data.getUsers.users.length - 1].id}})}}>Cargar mas...</Button> : null;
    
    return (
        <LayoutAdmin>
            <Head>
                <title>Alumnos | Profe Paco</title>
            </Head>
            <div className={styles.usersContainerScroll}>
                <div className={styles.usersContainerContent}>
                    <form className={styles.userSearchField} onSubmit={(e) => {handleGetUserByEmail(e)}}>
                        <TextField label='Buscar Alumno' value={state.email.value}  size='small' name='email' error={state.email.errorfield} variant='outlined' onChange={(e) => {handleOnChange(e)}}/>
                        <Button style={{color: '#15639d'}} type='submit'><SearchIcon/></Button>
                        <span>Alumnos: {data.getUsers.users.length}/{data.getUsers.totalUsers}</span>
                    </form>
                    {userCardByEmail || errorUserByEmailApollo}
                    <hr></hr>
                    {anyApolloError}
                    { data.getUsers.users.map((item) => {
                        return(
                            <UserCard key={item.id}
                            firstname={item.firstname}
                            lastname={item.lastname}
                            email={item.email}
                            mutation={deleteUserByEmail}
                            userId={item.id}/>
                        )
                    })}
                    {buttonToLoadMore}
                </div>
            </div>
        </LayoutAdmin>
    )
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    if ((!session || session.user.isAdmin !== true) && req) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}
export default Users;