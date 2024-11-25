import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = "https://api.lawinzo.com/node";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";
const accessToken = Cookies.get("accessToken");

export async function CreateNewVariable(name, id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: name,
      groupId: id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/create`,
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

export async function updateVariable(name, id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      _id: id,
      name: name
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/update`,
      requestOptions
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
export async function updateVariableValue(value, id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      _id: id,
      value: value
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/update`,
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

export async function deleteVariable(id) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: id,
      isActive: 0
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/delete`,
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

export async function getVariableWithTemplateId(id){
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
    
      const response = await fetch(
        `${apiUrl}/api/v1/easedraft/variable/get?id=${id}`,
        // `http://localhost:4000/api/v1/easedraft/variable/get?id=${id}`,
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
      // console.log(data);
      return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function createVariableWithTemplate(body) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: body.name,
      templateId: body.templateId,
      value: body.value || null,
      type : body.type || null
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/creates`,
      requestOptions
    );
    if (response.status === 401) {
      throw new Error("Unauthorized access");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function updateVariableWithTemplate(body) { 
  // body = id, templateId, name, value
  console.log(body)
  try { 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    let raw
    if(body.name){
      raw = JSON.stringify({
        _id: body.id,
        templateId: body.templateId,
        name: body.name,
        value:body.value,
        type:body.type
      });
    }else{
      raw = JSON.stringify({
        _id: body.id,
        templateId: body.templateId,
        value: body.value,
        type:body.type
      });
    }
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/variable/updates`,
      requestOptions
    );
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}