import axios from "axios";
const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const getState = async () => {
  const response = await fetch(apiUrl + "/state", {
    method: "GET",
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch((response) => {
      return response;
    });
  return response;
};

export const getCity = async (stateId) => {
  let headers = new Headers();

  headers.append("x-api-key", apiHeader);
  const response = await fetch(apiUrl + `/state/districts/${stateId}`, {
    method: "GET",
    headers,
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch((response) => {
      return response;
    });
  return response;
};
export const getCourt = async () => {
  // console.log("in lawyer court");
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-api-key", apiHeader);
  const response = await fetch(apiUrl + "/api/v1/courts", {
    method: "GET",
    headers,
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch((response) => {
      return response;
    });
  return response;
};
