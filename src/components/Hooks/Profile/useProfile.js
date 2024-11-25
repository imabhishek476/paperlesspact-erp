import { getUserProfile } from '@/Apis/login';
import Cookies from 'js-cookie';

const useProfile = () => {
    const accessToken = Cookies.get("accessToken");
    const fetchProfile = async (setDetails)=>{
        try {
            const userProfile = await getUserProfile(accessToken);
            setDetails(userProfile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }
  return fetchProfile;
}

export default useProfile