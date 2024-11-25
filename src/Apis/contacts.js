import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = "https://api.lawinzo.com/node/api/v1";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";
const accessToken = Cookies.get("accessToken");

export const createContact = async (body) => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    var raw = JSON.stringify({ ...body });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    try {
        const response = await fetch(
            // "http://localhost:4000/api/v1/contrakt/signers/method", 
            "https://api.lawinzo.com/node/api/v1/contrakt/signers/method", 
            requestOptions)
        const data = await response.json();
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }
}
export const getContacts = async (pageNumber, pageSize, isActive, isDeleted,searchQuery ) => {

    try {
        const accessToken = Cookies.get("accessToken");
        const headers = {
            "x-api-key": apiHeader,
            Authorization: `Bearer ${accessToken}`,
        };
        const params = new URLSearchParams();
        if(!searchQuery){
            params.append("page", pageNumber);
        }
        params.append("limit", pageSize);
        if (isActive) {
            params.append("isActive", isActive);
        }
        if(isDeleted){
            params.append("isDeleted", isDeleted);
        }
        if(searchQuery){
            params.append("searchQuery",searchQuery)
        }
        const response = await axios.get(
            // 'http://localhost:4000/api/v1/contrakt/signers/method', 
            'https://api.lawinzo.com/node/api/v1/contrakt/signers/method', 
            { params, headers });
        console.log("mylist", response);
        if (response.status === 200) {
            return response?.data;
        }
        return null;

    } catch (err) {
        console.log(err);
    }
};

export const deleteContact = async (obj) => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    console.log(obj)
    var raw = JSON.stringify({
    "signerIds":obj
    });
    
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
        const response = await fetch(
            // "http://localhost:4000/api/v1/contrakt/signers/method", 
            "https://api.lawinzo.com/node/api/v1/contrakt/signers/method", 
            requestOptions)
        const data = await response.json();
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }

};
export const updateContact = async (body, id) => {
    try {
        const accessToken = Cookies.get("accessToken");
        const headers = {
            "x-api-key": apiHeader,
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.put(
            `http://localhost:4000/api/v1/contrakt/signers/method/${id}`, 
            `https://api.lawinzo.com/node/api/v1/contrakt/signers/method/${id}`, 
            body, { headers });
        console.log("Updateded ", response);
        if (response.status === 200) {
            console.log(response?.data, "=========================================================body==============================================")

            return true
        }
        return "Ashish";

    } catch (err) {
        console.log(err);
    }
}

