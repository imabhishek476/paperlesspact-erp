import axios from "axios";
import Cookies from "js-cookie";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";
const apiURL = "https://api.lawinzo.com/node";

export const createSubscription = async () => {
  const accessToken = Cookies.get("accessToken");
  try {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${apiURL}/createSubscription`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSubscription = async (accessToken) => {
  //   const accessToken = Cookies.get("accessToken");
  try {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(`${apiURL}/getSubscription`, requestOptions);
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createCustomRequest = async (accessToken, data) => {
  try {
    if (!data || !accessToken) {
      throw Error("Missing required parameters in request aadhar OTP");
    }
    console.log(data);
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const response = await axios.post(`${apiURL}/createRequest`, data, {
      headers,
    });
    console.log(response);
    if (response.status === 200) {
      // const { data } = response.data;
      console.log("OTP REQUESTED", response.data);
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
