// https://api.easedraft.com/api/v1/acts?size=10

export const getBareActsList = async (
    pageNumber,
    pageSize,
  ) => {
    const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
    try {
      const params = new URLSearchParams();
      // params.append("appointmentType", appointmentType);
      params.append("page", pageNumber);
      params.append("size", pageSize);
      let headers = new Headers(); // headers.append("Content-Type", "application/json");
      headers.append("x-api-key", apiHeader);
      const url = ` https://api.easedraft.com/api/v1/acts`;
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
  export const getBareActById = async (
id
  ) => {
    const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
    // console.log(id)
    try {
      let headers = new Headers(); // headers.append("Content-Type", "application/json");
      headers.append("x-api-key", apiHeader);
      const url = ` https://api.easedraft.com/api/v1/acts/${id}`;
     console.log("checking Get URL", url);
      const response = await fetch(url, {
        method: "GET",
        headers, // body: JSON.stringify(obj),
      });
      if (response.status === 200) {
        const data = await response.json();
        // console.log("Bare Acts fetched", data);
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  };