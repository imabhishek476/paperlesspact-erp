import axios from 'axios';
import Cookies from 'js-cookie';
const apiURL = 'https://api.lawinzo.com/api/v1/teams';
// const apiURL = 'http://localhost:4000/api/v1/teams';

export const createTeam = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);

    const formData = new FormData();

    if (body.file)
      formData.append("profileimage", body.file);

    formData.append("teamName", body.teamName);

    const headers = {
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(`${apiURL}/createTeam`, formData, {
      headers,
    });


    // const requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: JSON.stringify(body),
    // };
    // const response = await fetch(
    //   `${apiURL}/createTeam`,
    //   requestOptions
    // );
    const data = response?.data;
    console.log(data);
    if (response?.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const addMember = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/addTeamMember`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const acceptInvite = async (teamId,adminId) => {
  const accessToken = Cookies.get('accessToken');
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      // body: JSON.stringify(body),
      redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/acceptInvite?teamId=${teamId}&adminId=${adminId}`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const getTeamListById = async (teamId, accessToken) => {
  // const accessToken = Cookies.get('accessToken');
  console.log(accessToken)
  try {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      "Content-Type": "application/json"
    }
    const url = `${apiURL}/getTeamListById`;
    const params = new URLSearchParams();
    params.append('teamId', teamId)
    const urlWithParams = `${url}?${params.toString()}`
    const response = await axios.get(urlWithParams, { headers });
    console.log(response)
    if (response.status === 200) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
};
export const getAllMyTeam = async (pageNumber, pageSize, search) => {
  const accessToken = Cookies.get('accessToken');
  console.log(accessToken)
  try {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      "Content-Type": "application/json"
    }
    const url = `${apiURL}/getAllMyTeam`;
    const params = new URLSearchParams();
    if(!search){
      params.append('pageNumber', pageNumber)
    }
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
export const deleteMember = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const headers = {
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(`${apiURL}/deleteMember`, body, {
      headers,
    });
    console.log(response);
    const data = response?.data;

    if (response?.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const updateRole = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const headers = {
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(`${apiURL}/updateRole`, body, {
      headers,
    });
    console.log(response);
    const data = response?.data;
    console.log(data);
    if (response?.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const updateTeam = async (body, teamId) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const headers = {
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    if (body) {
      formData.append("profileimage", body.file);
      formData.append("teamName", body.teamName);
      formData.append("isActive", body.isActive);
    }
    const response = await axios.post(`${apiURL}/updateTeam/${teamId}`, formData, {
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
};