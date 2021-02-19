import { getSession } from 'next-auth/client';
import React from 'react';
import LayoutAdmin from '../../../components/LayoutAdmin';
import styles from './styles/users.module.css';
import UserCard from '../../../components/UserCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useQuery } from '@apollo/client'
import { GET_ALL_USERS } from '../../../apollo/querys';
import { Button } from '@material-ui/core';

const Users = () => {
    const {data, error, loading, fetchMore} = useQuery(GET_ALL_USERS, {
        variables: {
            limit: 2,
        }
    })

    if (loading) {
        return (
            <LayoutAdmin>
                <div className={styles.usersContainerLoader}>
                    <CircularProgress/>
                </div>
            </LayoutAdmin>
        )
    }


    return (
        <LayoutAdmin>
            <div className={styles.usersContainerScroll}>
                <div className={styles.usersContainerContent}>
                    { data.getUsers.map((item) => {
                        return(
                            <UserCard key={item.id}
                            firstname={item.firstname}
                            lastname={item.lastname}
                            email={item.email}/>
                        )
                    })}
                    <Button onClick={ async () => {
                        await fetchMore({
                            variables: {
                                after: data.getUsers[data.getUsers.length - 1].id
                            }
                        })
                    }}>More</Button>
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
                destination: 'http://localhost:3000/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}
export default Users;