import {useQuery} from '@apollo/client';
import { CURRENT_USER } from '../../apollo/querys';

export const useAuth = () => {
    const {data, error, loading} = useQuery(CURRENT_USER);
    return {
        isUser: data && data.getUserAuth
    }
}
