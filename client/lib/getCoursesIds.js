import {initializeApollo} from '../components/hooks/apolloClient';
import { GET_COURSES } from '../apollo/querys'; 

export const getAllCourseIds = async () => {
    const apolloClient = initializeApollo();
    const {data} = await apolloClient.query({ query: GET_COURSES})
    return data.getCourses.map((item) => {
        return {
            params: {
                course_id: item.id
            }
            
        }
    });
}