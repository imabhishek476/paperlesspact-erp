
import axios from "axios";
import Cookies from "js-cookie";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const createHelp = async (body) => {
    const accessToken = Cookies.get("accessToken");
    try {
      const formData = new FormData();
      if(body){
        formData.append("enquiryMessage", body?.enquiryMessage);
        formData.append("enquiryFile", body?.enquiryFile);
      }
      const headers = {
        "x-api-key": "449772DE-2780-4412-B9F7-E49E48605875",
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.post(`https://api.lawinzo.com/node/api/v1/contrakt/help/enquiry`, formData,{headers});
      console.log(response)
      if(response.status===200){
        return response.data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };