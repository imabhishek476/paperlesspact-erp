import axios from "axios";
import Cookies from "js-cookie";
const apiURL = 'https://api.lawinzo.com/api/v1/easedraft';
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875"; //use env
const accessToken = Cookies.get("accessToken");

export const createRentalAgreement = async (accessToken, data, pageNo) => {
  try {
    if (!accessToken || !data || !pageNo) {
      throw Error("Missing required parameters in create rental agreement");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };

    const body = {
      ...data,
    };
    console.log(body);
    const response = await axios.post(
      `https://api.lawinzo.com/legalAgreement/rental?pageNo=${pageNo}`,
      body,
      {
        headers,
      }
    );

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Rental Agreement created:", data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getRentalAgreementById = async (accessToken, id, index) => {
  try {
    if (!accessToken || !id) {
      throw Error("Missing required parameters in  rental agreement by id");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    const url = "https://api.lawinzo.com/node/legalAgreement/getDoc";
    const params = new URLSearchParams();
    params.append("id", id);
    if (index) {
      params.append("index", index);
    }
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers,
    });
    // console.log(response);

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Rental Agreement fetched:", data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const signAgreement = async (id, userType, index, documentId) => {
  try {
    const accessToken = Cookies.get("accessToken");
    console.log(id, userType, index, accessToken);
    if (!accessToken || !id || !userType || !index) {
      throw Error("Missing required parameters in  rental agreement signing");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    let url = "https://api.lawinzo.com/node/legalAgreement/rental/sign";
    let body = {
      rentalId: id,
      userType,
      index: parseInt(index),
    };
    if (userType === "party1" || userType === "party2") {
      url = "https://api.lawinzo.com/node/legalAgreement/sign";
      body = {
        agreementId: id,
        userType,
        index: parseInt(index),
        documentId: documentId,
      };
    }
    const response = await axios.post(url, body, {
      headers,
    });

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Rental Agreement signed", data);
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const removeSignee = async (documentId, signee) => {
  try {
    const accessToken = Cookies.get("accessToken");
    // console.log(id, userType, index, accessToken);
    if (!documentId || !signee) {
      throw Error("Missing required parameters in  rental agreement signing");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    let url = "https://api.lawinzo.com/node/legalAgreement/removeSignee";
    let body = {
      documentId: documentId,
      signee: signee,
    };
    const response = await axios.post(url, body, {
      headers,
    });

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Rental Agreement signed", data);
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const notifyUnsigned = async (id, accessToken, agreementType) => {
  try {
    console.log(id, agreementType);
    if (!id || !agreementType) {
      throw Error("Missing required parameters in   agreement signing");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    let url =
      "https://api.lawinzo.com/node/legalAgreement/rental/notifyUnsigned";
    let body = {
      rentalId: id,
    };
    if (agreementType !== "rental") {
      url = "https://api.lawinzo.com/node/legalAgreement/notifyUnsigned";
      body = {
        agreementId: id,
      };
    }
    const response = await axios.post(url, body, {
      headers,
    });

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Notification sent", data);
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const createGeneralAgreement = async (data, pageNo) => {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken || !data || !pageNo) {
      throw Error("Missing required parameters in create  agreement");
    }
    let headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    let body = {
      ...data,
    };
    // if (pageNo === "1") {
    //   headers = {
    //     ...headers,
    //     'Content-Type': 'multipart/form-data',
    //   }

    //   const {documents,agreementId,stampAmount,title,agreementType} = data;
    //   const formData = new FormData();
    //   formData.append("agreementId", agreementId);
    //   formData.append("title", title);
    //   console.log(documents);
    //   if(documents&&documents.length>0){
    //     // documents.map((document)=>{
    //     //   formData.append("agreementUrls",document);
    //     // });
    //     formData.append("agreementUrls",document);
    //   }
    //   if(agreementType){
    //     formData.append("agreementType",agreementType);
    //   }

    //   body=formData;
    // }

    console.log(body);
    const response = await axios.post(
      `https://api.lawinzo.com/legalAgreement?pageNo=${pageNo}`,
      body,
      {
        headers,
      }
    );

    if (response.status === 200) {
      const { data } = response.data;
      console.log("Agreement created:", data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createAgreementDocument = async (documentObject) => {
  const accessToken = Cookies.get("accessToken");
  console.log(documentObject);
  try {
    if (!accessToken || !documentObject) {
      throw Error("Required Params missing");
    }
    const blobUrl = documentObject?.document[0];
    let stampUrl = "";
    if (documentObject?.stampFile) {
      stampUrl = documentObject?.stampFile[0];
    }
    const formData = new FormData();
    if (documentObject?.document) {
      // formData.append("pdf",documentObject.document);
      formData.append("pdf", blobUrl);
    }
    if (documentObject?.name) {
      formData.append("name", documentObject?.name);
    }
    if (documentObject?.stampAmount) {
      formData.append("stampAmount", documentObject?.stampAmount);
    }
    if (stampUrl) {
      formData.append("stampFile", stampUrl);
    }
    console.log(formData.keys());
    let headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const response = await axios.post(
      "https://api.lawinzo.com/legalAgreement/addDocument",
      formData,
      {
        headers,
      }
    );
    if (response.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const prepareDocument = async (
  documentId,
  items,
  agreementId,
  accessToken,
  signees,
  signingMethod,
  emailTemplate,
  settings
) => {
  // console.log("in",documentId)
  try {
    if (!accessToken || !documentId) {
      throw Error("Required Params missing");
    }
    const formData = new FormData();
    formData.append("documentId", documentId);
    formData.append("signingMethod", signingMethod);
    formData.append("emailTemplate", emailTemplate);
    formData.append("settings", settings);
    console.log(documentId);
    console.log(agreementId)
    console.log(signees)
    console.log(signingMethod)
    console.log(emailTemplate)
    console.log(settings)
    for (const item of items) {
      console.log(item);
      console.log(typeof item?.image === "string");
      formData.append("items[]", JSON.stringify(item));
      if (item && item?.image && !(typeof item?.image === "string")) {
        formData.append(item?.id, item?.image);
      }
      if(item && item?.file){
        formData.append(item?.id,item?.file);
      }
    }
    if (signees) {
      formData.append("signees", signees);

    }
    formData.append("agreementId", agreementId);
    console.log(formData.keys());
    let headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const response = await axios.post(
      "https://api.lawinzo.com/legalAgreement/prepare",
      // "http://localhost:4000/legalAgreement/prepare",
      formData,
      {
        headers,
      }
    );
    if (response.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};
export const signDocument = async (
  documentId,
  items,
  signee,
  agreementId,
  accessToken
) => {
  try {
    if (!accessToken || !documentId) {
      throw Error("Required Params missing");
    }
    const formData = new FormData();
    formData.append("documentId", documentId);
    console.log(items);
    for (const item of items) {
      console.log(item);
      console.log(typeof item?.image === "string");
      formData.append("items[]", JSON.stringify(item));
      if (item && item?.image && !(typeof item?.image === "string")) {
        formData.append(item?.id, item?.image);
      }
      if (item && item?.file && !(typeof item?.file === "string")) {
        formData.append(item?.id, item?.file);
      }
    }
    if (signee) {
      formData.append("signee", JSON.stringify(signee));
    }
    if (agreementId) {
      formData.append("agreementId", agreementId);
    }
    console.log(formData.keys());
    let headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const response = await axios.post(
      "https://api.lawinzo.com/legalAgreement/signDoc",
      // "http://localhost:4000/legalAgreement/signDoc",
      formData,
      {
        headers,
      }
    );
    if (response.status === 200) {
      console.log(response?.data?.data)
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const getDocumentDrafts = async (pageNumber, size) => {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw Error("no accessToken");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    params.append("pageSize", size);
    const url = "https://api.lawinzo.com/node/legalAgreement/getDocuments";
    const urlWithParams = `${url}?${params.toString()}`;
    const response = await axios.get(urlWithParams, { headers });
    if (response.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const sendReminder = async (body) => {
  try {
    if (!body || !accessToken) {
      throw Error("All params missing");
    }
    const headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(
      // "http://localhost:4000/legalAgreement/notifySignee",
      "https://api.lawinzo.com/node/legalAgreement/notifySignee",
      body,
      { headers }
    );
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const getDashboardCount = async (accessToken) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      "https://api.lawinzo.com/node/legalAgreement/dashboardCount",
      requestOptions
    );
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getcompletedDocList = async (filter, pageNumber, size,timeFilter) => {
  console.log(filter)
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    // console.log(pageNumber)
    // console.log(size)
    // console.log(filter)
    const params = new URLSearchParams();
    if(timeFilter){
      params.append("timeFilter", timeFilter);
    }
    if (filter?.completed === "true" || filter === 'completed') {
      console.log("hey",filter.completed);
      params.append("isCompleted",  "true");
    }
    if(filter?.completed=== "false" || filter === "sent"){
      params.append("isCompleted",  "false");
    }
    if (filter?.isDraft) {
      params.append("isDraft", "1");
    }
    if (filter?.isActive === 0) {
      params.append("isActive", "0");
    }
    if (filter?.isExpired === 1 || filter === 'expired') {
      params.append("isExpired", "1");
    }
    if (filter?.isViewed === 1 || filter === 'viewed') {
      params.append("isViewed", "1");
    }
    if (filter?.isPartiallySigned === 1 || filter === 'p-signed') {
      params.append("isPartiallySigned", "1");
    }
    // console.log(filter?.isActive);
    params.append("pageNumber", pageNumber);
    params.append("pageSize", size);
    const url = "https://api.lawinzo.com/node/legalAgreement/getDocuments";
    const urlWithParams = `${url}?${params.toString()}`;

    const res = await fetch(urlWithParams, requestOptions);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const getcompletedDocListSearch = async (
  searchQuery,
  pageNumber,
  size,
  isTrash,
  isDraft,
  completed
) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const params = new URLSearchParams();
    if (searchQuery) {
      // console.log("hey");
      params.append("searchQuery", searchQuery);
    }
    if(isDraft){
      params.append("isDraft", isDraft);
    }
    if(completed === "true"){
      params.append("isCompleted", true);
    }
    if(completed === "false"){
      params.append("isCompleted", false);
    }

    if (isTrash) {
      params.append("isActive", 0);
    }
    params.append("pageNumber", pageNumber);
    params.append("pageSize", size);
    const url = "https://api.lawinzo.com/node/legalAgreement/getDocuments";
    const urlWithParams = `${url}?${params.toString()}`;

    const res = await fetch(urlWithParams, requestOptions);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getcontactCount = async () => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api.lawinzo.com/node/api/v1/contrakt/signers/method",
      requestOptions
    );
    const contacts = await response.json();

    if (contacts.status) {
      return contacts.totalCount;
    } else {
      console.log("failed", contacts);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const createUserSignature = async (signature, initials) => {
  const accessToken = Cookies.get("accessToken");
  try {
    if (!accessToken) {
      throw Error("Required Params missing");
    }
    const formData = new FormData();
    if (signature) {
      // formData.append("pdf",documentObject.document);
      formData.append("signature", signature);
    }
    if (initials) {
      formData.append("initials", initials);
    }
    let headers = {
      "x-api-key": apiHeader,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const response = await axios.post(
      "https://api.lawinzo.com/legalAgreement/saveSignature",
      formData,
      {
        headers,
      }
    );
    if (response.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

export const getUserSignature = async () => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api.lawinzo.com/node/legalagreement/getSignature",
      requestOptions
    );
    const contacts = await response.json();

    if (contacts.success) {
      return contacts.data;
    } else {
      console.log("failed", contacts);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export async function deletedDocument(id) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Cache-Control", "");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `https://api.lawinzo.com/node/legalAgreement/deleteAgreement/${id}`,
      requestOptions
    );
    const contacts = await response.json();
    console.log(contacts);
    if (contacts.success) {
      return contacts.data;
    } else {
      console.log("failed", contacts);
    }
  } catch (error) {
    console.log(error);
  }
}
export const getcompletedTemplateList = async (filter, pageNumber, size,timeFilter) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    console.log(filter)
    const params = new URLSearchParams();
    if (filter?.isApproval===1 || filter==="sfApproval") {
      console.log("hey",filter.isApproval);
      params.append("isApproval", '1');
    }
    if (filter?.isPublished===1) {
      console.log("hey",filter.isGlobal);
      params.append("isPublished", '1');
    }
    if (filter?.isGlobal===1) {
      console.log("hey",filter.isGlobal);
      params.append("isGlobal", '1');
    }
    if (filter?.categoryId) {
      console.log("hey",filter.categoryId);
      params.append("categoryId", filter?.categoryId);
    }
    if (filter?.pageOrientation) {
      console.log("hey",filter.pageOrientation);
      params.append("pageOrientation", filter?.pageOrientation);
    }
    if (filter?.type) {
      console.log("hey",filter?.type);
      params.append("type", filter?.type);
    }
    if (timeFilter) {
      console.log("hey",timeFilter);
      params.append("timeFilter", timeFilter);
    }
    
    if (filter?.isApprovalneeded===1 || filter==="nmApproval") {
      params.append("isApprovalneeded", "1");
    }
    if (filter?.isApproved === 1 || filter === 'approved') {
      params.append("isApproved", "1");
    }
    if (filter?.isSuggested === 1 || filter === 'suggest-changes') {
      params.append("isSuggested", "1");
    }
    if (filter?.isViewed === 1) {
      params.append("isViewed", "1");
    }
    if (filter?.isRejected === 1 || filter === 'rejected') {
      params.append("isRejected", "1");
    }
    if (filter?.timeFilter === 1) {
      params.append("timeFilter", "1");
    }
    // console.log(filter?.isActive);
    if(filter?.search){
      params.append("searchQuery", filter?.search);
    }
    params.append("pageNumber", pageNumber);
    params.append("pageSize", size);
    const url = `${apiURL}/folders/templatesDashboard`;
    const urlWithParams = `${url}?${params.toString()}`;

    const res = await fetch(urlWithParams, requestOptions);
    const data = await res.json();
    if (data.success) {
      console.log(data)
      return data.data;
    }
  } catch (error) {
    console.log(error.message);
  }
};
