import axios from "axios";

export const getServices = async () => {
    try {
      const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
      const headers = {
        'x-api-key': apiHeader,
      };
      const urlWithParams = "https://api.easedraft.com/api/v1/serviceType";
      const response = await axios.get(urlWithParams, { headers });
  
      // console.log(response);
      if (response.status === 200) {
        // console.log("case report fetched", response);
        return response?.data
      }
    } catch (e) {
      console.log(e);
    }
  };