import { removeCookies } from "@/Utils/logout";
import { useRouter } from "next/router"

export const useLogout = ()=>{
    const router = useRouter();
    const logOut = ()=>{
        removeCookies();
        router.push("/");
    }
    return logOut;
}