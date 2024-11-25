import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const generateOtp = async (mobile) => {
  try {
    const obj = {
      username: mobile,
      alternate: "true",
    };
    // console.log(obj);
    // console.log(apiHeader);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append('Authorization', 'Bearer ' + 'application/json');
    headers.append("x-api-key", apiHeader);
    // console.log(apiUrl);
    const response = await fetch(apiUrl + "/api/auth/signinByMobile", {
      method: "POST",
      headers,
      body: JSON.stringify(obj),
    });
    // console.log(response);

    if (response.status === 200) {
      const data = await response.json();
      console.log("OTP sent");
      return { data: data };
    }
  } catch (e) {
    console.log(e);
  }
};

export const validateOtp = async (mobile, otp) => {
  try {
    const obj = {
      username: mobile,
      password: otp,
      alternate: "true",
    };
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiHeader);
    const response = await fetch(apiUrl + "/api/auth/verify", {
      method: "POST",
      headers,
      body: JSON.stringify(obj),
    });
    if (response.status === 200) {
      const data = await response.json();
      //   console.log(data);
      return { data: data };
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUserProfile = async (accessToken) => {
  console.log(accessToken)
  try {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiHeader);
    headers.append("Authorization", "Bearer " + accessToken);
    const response = await fetch(apiUrl + "/user/me", {
      method: "GET",
      headers,
      // body: JSON.stringify(obj),
    });

    // console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      // console.log("get user profile", data);
      return { data: data?.data,status:response.status };
    }
  } catch (e) {
    console.log(e);
  }
};

export const sendEmailOTP = async (email,fullname)=>{
  try{
    const accessToken = Cookies.get("accessToken");
    if(!email||!fullname||!accessToken){
      throw Error("email/fullname missing");
    }
    const headers = {
			"x-api-key": apiHeader,
			Authorization: `Bearer ${accessToken}`,
		};
    const res = await axios.post("https://api.easedraft.com/api/auth/docSignByEmail",{
      username:email,
      password:fullname
    },
    {headers});
    if(res.status === 200 || res.status===201||res.status===202){
      return true;
    }
    return null;
  }catch(err){
    console.log(err);
    return null;
  }
}
export const verifyEmailOTP = async (email,otp)=>{
  try{
    const accessToken = Cookies.get("accessToken");
    if(!email||!otp||!accessToken){
      throw Error("email/otp missing");
    }
    const headers = {
			"x-api-key": apiHeader,
			Authorization: `Bearer ${accessToken}`,
		};
    const res = await axios.post("https://api.easedraft.com/api/auth/verifyDocSign",{
      username:email,
      password:otp
    },
    {headers});
    if(res.status === 200 || res.status===201||res.status===202){
      return true;
    }
    return null;
  }catch(err){
    console.log(err);
    return null;
  }
}


