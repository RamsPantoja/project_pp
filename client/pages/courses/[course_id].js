import React from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import useSWR from 'swr';

const DescriptionCourse = ({id}) => {
    return (
        <Layout>
            <Head>
            </Head>
            <div>
                <h1>hello</h1>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = await getAllCourseIds();
    return {
        paths,
        fallback: false
    }
}

const getAllCourseIds = async () => {
    const res = await fetch('http://localhost:4200/courses');
    const data = await res.json();

    return data.map((item) => {
        return {
            params: {
                course_id: item.id
            }
        }
    });
}

export async function getStaticProps({params}) {
    return {
        props: {
            id: params.course_id
        }
    }
}

export default DescriptionCourse;