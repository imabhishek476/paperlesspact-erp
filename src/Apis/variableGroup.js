import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = "https://api.lawinzo.com/node";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";
const accessToken = Cookies.get("accessToken");

export async function getAllVariableGroup(id,searchQuery) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable_group/all?id=${id}&searchQuery=${searchQuery}`,
            requestOptions
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function createVariableGroup(name, id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: name,
      templateId: id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable_group/create`,
      requestOptions
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getVariableGroup(id, searchQuery) {
  //id = particular variableGroup _id

  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable_group/?id=${id}`,
      requestOptions
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function updateVarGroup(name, id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: id,
      name: name
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable_group/update`,
      requestOptions
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function deleteVarGroup(id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable_group/delete`,
      requestOptions
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
