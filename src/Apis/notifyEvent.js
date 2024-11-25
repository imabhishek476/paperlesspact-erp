import axios from 'axios';
import Cookies from 'js-cookie';
const apiURL = 'https://api.lawinzo.com/api/v1/notifyEvents';
// const apiURL = 'http://localhost:4000/api/v1/notifyEvents';


export const getNotifyEvents = async (pageNumber, pageSize,search) => {
  const accessToken = Cookies.get('accessToken');
  console.log(accessToken)
  try {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      "Content-Type": "application/json"
    }
    const url = `${apiURL}/`;
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber)
    params.append('pageSize', pageSize)
    if (search) {
      params.append("searchQuery", search)
    }
    const urlWithParams = `${url}?${params.toString()}`
    const response = await axios.get(urlWithParams, { headers });
    console.log(response)
    if (response?.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateNotifyEvent = async(body) =>{
  const accessToken = Cookies.get('accessToken');
  
  try {
    const headers = {
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      Authorization: `Bearer ${accessToken}`,
    };
    console.log(body)
    const response = await axios.post(`${apiURL}/update`, body, {
      headers,
    });
    const data = response?.data;
    console.log(data);
    if (response?.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}