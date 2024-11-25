import Cookies from "js-cookie";

export const getAvatars = async (
    pageNumber,
    pageSize,
  ) => {
    const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
    try {
const accessToken = Cookies.get("accessToken");

      const params = new URLSearchParams();
      // params.append("appointmentType", appointmentType);
      if(pageNumber && pageSize) {
        params.append("page", pageNumber);
        params.append("size", pageSize);
      }
      let headers = new Headers(); // headers.append("Content-Type", "application/json");
      headers.append("x-api-key", apiHeader);      
      headers.append("Authorization", `Bearer ${accessToken}`);

      const url = ` https://api.lawinzo.com/avatar/avatars`;
      const urlWithParams = `${url}?${params.toString()}`;
    //   console.log("checking Get URL", urlWithParams);
      const response = await fetch(urlWithParams, {
        method: "GET",
        headers, // body: JSON.stringify(obj),
      });
      if (response.status === 200) {
        const data = await response.json();
        // console.log("all Bare Acts fetched", data);
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  };