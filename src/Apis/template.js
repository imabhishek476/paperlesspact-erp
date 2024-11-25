import axios from 'axios';
import Cookies from 'js-cookie';
// const apiURL = 'http://localhost:4000/api/v1/easedraft';
const apiURL = 'https://api.lawinzo.com/api/v1/easedraft';

export const createTemplate = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/create/folder`,
      // `http://localhost:4000/api/v1/easedraft/folders/create/folder`,
      requestOptions
    );
    const data = await response.json();
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createPDF = async (body) => {
  const accessToken = Cookies.get('accessToken');
  // console.log(body.name);
  try {
    let data;
    if (body.items.some((el) => (el?.type === 'file' || el?.type === 'video' || el?.type==="inEditorImage") && el.file)) {
      const formData = new FormData();
      console.log(body.content)
      formData.append('id', body.id);
   
      formData.append('content', body?.content);
      formData.append('editorState', JSON.stringify(body?.editorState));
      formData.append('items', JSON.stringify(body.items));
      formData.append('pageSetup',JSON.stringify(body.pageSetup));
      formData.append('settings',JSON.stringify(body.settings));
      formData.append("showPageNo",body?.showPageNo);
      if (body.name) {
        formData.append('name', body.name);
      }
      const fileItems = body.items.filter(el =>(el?.type === 'file' || el?.type === 'video' || el?.type==="inEditorImage") && el.file);
      for (const fileItem of fileItems) {
        console.log(fileItem)
        formData.append(fileItem.id, fileItem.file);
        if (fileItem.thumbnailFile) {
          formData.append(`thumbnail-${fileItem.id}`, fileItem.thumbnailFile);
        }
        if (body.items?.InImageEditor) {
          formData.append(`InImageEditor-${fileItem.id}`, fileItem.InImageEditor);
        }
      }
      let headers = {
        'x-api-key': "449772DE-2780-4412-B9F7-E49E48605875",
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };
   
      const response = await axios.post(
        `${apiURL}/folders/createTemplatePdf`,

          //  `http://localhost:4000/api/v1/easedraft/folders/createTemplatePdf`,
        formData,
        {
          headers,
        }
      );
      data = response.data
      console.log(response);
      return data?.data;
    }  else {
      const myHeaders = new Headers();
      myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${accessToken}`);
      let data = {
        id: body.id,
        content: body.content,
        editorState: body.editorState,
        items: JSON.stringify(body.items),
        pageSetup:body.pageSetup,
        settings:body.settings,
        showPageNo:body?.showPageNo
      }
      if (body.name) {
        data.name = body.name;
      }
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow',
      };
      const response = await fetch(
        `${apiURL}/folders/createTemplatePdf`,
        // `http://localhost:4000/api/v1/easedraft/folders/createTemplatePdf`,
        requestOptions
      );
      if(response.ok){
        data = await response.json();
        return data?.data;
      }
      return null;

    }
    console.log(data);
    // if (response.status === 200) {
    //   return data;
    // }
    return data
  } catch (error) {
    console.log(error);
  }
};

export const updateTemplate = async (accessToken, body, id) => {
  //   const accessToken = Cookies.get("accessToken");
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/file/actions?id=${id}`,
      // `http://localhost:4000/api/v1/easedraft/folders/file/actions?id=${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};


export const getTemplate = async (id, accessToken) => {
  const apiHeader = '449772DE-2780-4412-B9F7-E49E48605875';
  try {
    let headers = new Headers(); // headers.append("Content-Type", "application/json");
    headers.append('x-api-key', apiHeader);
    headers.append('Authorization', `Bearer ${accessToken}`);
    const url = `${apiURL}/folders/file?id=${id}`;
    // const url = `http://localhost:4000/api/v1/easedraft/folders/file?id=${id}`;
    console.log('checking Get URL', url);
    const response = await fetch(url, {
      method: 'GET',
      headers, // body: JSON.stringify(obj),
    });
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log('Bare Acts fetched', data);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};
export const sendColabInvite = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/sendColabInvite`,
      // `http://localhost:4000/api/v1/easedraft/folders/sendColabInvite`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addApprover = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      // redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/addApprover`,
      // `http://localhost:4000/api/v1/easedraft/folders/addApprover`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleApprover = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      // redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/handleApprover`,
      // `http://localhost:4000/api/v1/easedraft/folders/handleApprover`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveEnvelopeInTemplate = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      // redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/saveEnvelopeInTemplate`,
      // `http://localhost:4000/api/v1/easedraft/folders/handleApprover`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const templateDashboard = async (body) => {
  const accessToken = Cookies.get('accessToken');
  console.log(body);
  try {
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', '449772DE-2780-4412-B9F7-E49E48605875');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      // redirect: 'follow',
    };
    const response = await fetch(
      `${apiURL}/folders/saveEnvelopeInTemplate`,
      // `http://localhost:4000/api/v1/easedraft/folders/handleApprover`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export const getAllDashboardCount = async (timeFilter) => {
  const accessToken = Cookies.get('accessToken');
  console.log(accessToken)
  try {
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      "Content-Type": "application/json"
    }
    const url = `${apiURL}/folders/getAllDashboardCount?timeFilter=${timeFilter}`;
    const response = await axios.get(url, { headers });
    console.log(response)
    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export const sendTemplate = async (document, emailTemplate, settings, isSigningOrder,clientFile) => {
  try {
    const accessToken = Cookies.get('accessToken');
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "x-api-key": '449772DE-2780-4412-B9F7-E49E48605875',
      // "Content-Type": "application/json"
    }
    console.log(document.ccs)
    document?.ccs?.map((cc)=>document?.signees?.push(cc))
    const formdata = new FormData();
    formdata.append('documentId', document._id);
    formdata.append("participants", document.participants);
    formdata.append("signees", JSON.stringify(document.signees));
    formdata.append("signMethod", document.signMethod);
    formdata.append("settings", JSON.stringify(settings));
    formdata.append("isSigningOrder", isSigningOrder);
    formdata.append("emailTemplate", JSON.stringify(emailTemplate));
    if (clientFile) {
      formdata.append("userLogo", clientFile);
    }
    // const url = "http://localhost:4000/legalAgreement/send";
    const url = "https://api.lawinzo.com/legalAgreement/send";
    const response = await axios.post(url, formdata, { headers });
    if (response.status === 200) {
      return response.data;
    }
    // return null;
  } catch (error) {
    console.log(error);
  }
}
export const getAllCategory = async (pageNumber, pageSize, published) => {
  try {
    const accessToken = Cookies.get('accessToken');
    const apiHeader = '449772DE-2780-4412-B9F7-E49E48605875';
    const headers = {
      'x-api-key': apiHeader,
      Authorization:
        `Bearer ${accessToken}`,
    };
    const url = `${apiURL}/category/all`
    const params = new URLSearchParams();
    if (pageNumber > 0 && pageSize > 0) {
      params.append('pageNumber', pageNumber);
      params.append('pageSize', pageSize);
    }
    if (published) {
      params.append("published", 1)
    }
    const urlWithParams = `${url}?${params.toString()}`
    const response = await axios.get(
      urlWithParams,
      { headers }
    )
    if (response.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log(error)
  }
}
export const globalTemplate = async (body) => {
  try {
    const accessToken = Cookies.get('accessToken');
    const apiHeader = '449772DE-2780-4412-B9F7-E49E48605875';
    const headers = {
      'x-api-key': apiHeader,
      Authorization:
        `Bearer ${accessToken}`,
    };
    const url = `${apiURL}/folders/copyTemplate`;
    // const url = `http://localhost:4000/api/v1/easedraft/folders/copyTemplate`;
    const res = await axios.post(url, body, { headers })
    if (res) {
      return res?.data
      console.log(res)
    }
  } catch (error) {
    console.log(error)
  }
}
