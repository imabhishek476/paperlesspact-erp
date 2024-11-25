import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = "https://api.lawinzo.com/node/aadhar/otp";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const requestAadharOTP = async (aadharNumber, taskId) => {
  const accessToken = Cookies.get("accessToken")
  console.log(aadharNumber,accessToken, taskId)
  try {
    if (!aadharNumber || !taskId || !accessToken) {
      throw Error("Missing required parameters in request aadhar OTP");
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiHeader);
    headers.append("Authorization", "Bearer " + accessToken);
    const data = {
      aadharNumber:aadharNumber,
      taskId:taskId
    };
    const response = await axios.post(`${apiUrl}/request`, data, {
      headers,
    });
    console.log(response)
    if (response.status === 200) {
      const { data } = response.data;
      console.log("OTP REQUESTED", data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const verifyAadharOTP = async (requestId, taskId, otp) => {
  const accessToken = Cookies.get("accessToken")
  try {
    if (!requestId || !taskId || !otp|| !accessToken) {
      throw Error("Missing required parameters in verify aadhar OTP");
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiHeader);
    headers.append("Authorization", "Bearer " + accessToken);
    const data = {
      requestId: requestId,
      otp: otp,
      taskId: accessToken
  };
    const response = await axios.post(`${apiUrl}/verify`, data, {
      headers,
    });

    if (response.status === 200) {
      const { data } = response.data;
      console.log("OTP REQUESTED", data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
