import axios from "axios";
const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const paymentRequest = async (
    body,
    accessToken
  ) => {
    if (!body) {
      throw Error("No body provided");
    }
    try {
      const Body = {
        ...body,
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": apiHeader,
        Authorization: "Bearer " + accessToken,
      };
  
      const url = apiUrl + "/payment/request";
  
      const response = await axios.post(url, Body, { headers });
  
      if (response.status === 200) {
        console.log("payment request sent");
        return response?.data?.data;
      }
  
      return null;
  
    } catch (err) {
      console.error(err);
    }
  };



export const getPaymentByOrderId = async(orderId,accessToken)=>{
    try{
      if(!orderId){
        throw Error("No orderId");
      }
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": apiHeader,
        Authorization: "Bearer " + accessToken,
      };
  
      const response = await axios.get(apiUrl+`/payment/verify/${orderId}`,{headers});
      console.log(response);

      if (response.status === 200) {
        console.log("recieved");
        return response?.data
      }
  
      return null;
    }catch(err){
      console.log(err);
    }
  }