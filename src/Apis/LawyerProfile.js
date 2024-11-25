import Cookies from "js-cookie";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875" // remove from here in test after merging


export const LawyerProfileUpdate = async ( obj) => {
    try {
        const accessToken = Cookies.get("accessToken");
      console.log(obj);
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      // headers.append('Authorization', 'Bearer ' + 'application/json');
      console.log(accessToken);
      headers.append("x-api-key", apiHeader);
      headers.append("Authorization", "Bearer " + accessToken);
      const response = await fetch("https://api.easedraft.com/lawyer/profile", {
        method: "POST",
        headers,
        body: JSON.stringify(obj),
      })
      // console.log(response);
  
      if (response.status === 200) {
        const data = await response.json();
        // console.log(data);
        return { data: data };
      }
    } catch (e) {
      console.log(e);
    }
  };