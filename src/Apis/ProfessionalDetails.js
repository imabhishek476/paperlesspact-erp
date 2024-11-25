import { erpApiUrl, xKey } from "@/Utils/Constants/API"
import axios from "axios";


export const getPractiseStateList = async ()=>{
    const response = await axios.get(`${erpApiUrl}/state`);
    console.log(response);
    if(response.status===200){
        return response.data;
    }
    return [];
}
export const getPractiseDistrictList = async (stateId)=>{
    const headers = {
        "x-api-key":xKey
    }
    const response = await axios.get(`${erpApiUrl}/state/districts/${stateId}`,{headers});
    console.log(response);
    if(response.status===200){
        return response.data;
    }
    return [];
}
export const getPractiseCourtList = async ()=>{
    const headers = {
        "x-api-key":xKey
    }
    const response = await axios.get(`${erpApiUrl}/api/v1/courts`,{headers});
    console.log(response);
    if(response.status===200){
        return response.data;
    }
    return [];
}
export const getPractiseEducationList = async ()=>{
    const headers = {
        "x-api-key":xKey
    }
    const response = await axios.get(`${erpApiUrl}/api/v1/educations`,{headers});
    console.log(response);
    if(response.status===200){
        return response.data;
    }
    return [];
}
export const getPractiseLanguageList = async ()=>{
    const response = await axios.get(`${erpApiUrl}/language`);
    console.log(response);
    if(response.status===200){
        return response.data;
    }
    return [];
}
export const getSpecialisationList = async ()=>{
    try{
        const headers = {
            "x-api-key":xKey
        }
        const response = await axios.get(`${erpApiUrl}/api/v1/speciality`,{headers});
        console.log(response);
        if(response.status===200){
            return response.data;
        }
        return [];
    }catch(err){
        console.log(err);
    }
    
}