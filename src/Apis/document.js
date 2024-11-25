import axios from "axios";
const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const getDocument = async (accessToken, documentId) => {
  try {
    if (!accessToken || !documentId) {
      throw Error("No accessToken or Document Id Provided");
    }
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", apiHeader);
    headers.append("Authorization", "Bearer " + accessToken);
    const response = await fetch(apiUrl + `/api/v1/document/${documentId}`, {
      method: "GET",
      headers,
      // body: JSON.stringify(obj),
    });

    // console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log("document details fetched", data);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const createDocument = async (accessToken, documentData, type) => {
  console.log(type)
  try {
    if (!accessToken || !documentData) {
      throw Error('Missing required parameters in create document');
    }

    const {
      documentFile,
      documentExtention,
      documentName,
      documentDescription,
      isVisibleToClient,
      documentType
    } = documentData;


    console.log(documentFile);
    const headers = {
      'x-api-key': apiHeader,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('documentType', documentType);
    formData.append('documentExtension', documentExtention);
    formData.append('documentName', documentName);
    formData.append('documentDescription', documentDescription);
    formData.append('isVisibleToClient', isVisibleToClient.toString());

    const response = await axios.post(`${apiUrl}/api/v1/document/${type}`, formData, {
      headers,
    });

    if (response.status === 200) {
      const {data} = response.data;
      console.log('Document created:', data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }

};


