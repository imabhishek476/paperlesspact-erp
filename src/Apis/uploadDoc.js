import Cookies from "js-cookie";
import axios from "axios";

const apiUrl = "https://api.easedraft.com";
const apiUrlNode = "https://api.lawinzo.com/node";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const uploadDocument = async (documentData) => {
    const accessToken = Cookies.get('accessToken');
    // console.log(type)
    try {
      if (!accessToken || !documentData) {
        throw Error('Missing required parameters in create document');
      }
      const {
        documentFile,
        documentExtention,
        documentName,
        documentDescription,
        documentType,
        isActive,
        documentId
      } = documentData;
      console.log(documentData.isActive);
      const headers = {
        'x-api-key': apiHeader,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };
      const formData = new FormData();
      if(documentFile){
        formData.append('document', documentFile);
      }
      formData.append('documentType', documentType);
      formData.append('documentExtension', documentExtention);
      formData.append('documentName', documentName);
      if(isActive=== 0 || isActive === 1){
        formData.append("isActive",isActive);
      }
      if(documentId){
        formData.append("documentId",documentId);
      }
      console.log(documentData)
      // const url  = `https://localhost/api/v2/document/${documentType}`;
      const url  = `${apiUrl}/api/v2/document/${documentType}`;
      const response = await axios.post(
        url,
       formData, {
        headers,
      });
  
      if (response.status === 200) {
        const {data} = response.data;
        console.log('Document created:', data);
        return data;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  
  };

  export const getDocumentsWithType=async(documentType,pageNo=0,size=5)=>{
    const accessToken = Cookies.get("accessToken");
    try{
      if(!accessToken||!documentType){
        throw Error('Missing required parameters in create document');
      }
      const headers = {
        'x-api-key': apiHeader,
        Authorization: `Bearer ${accessToken}`
      };
      const params = new URLSearchParams();
      params.append("page",pageNo);
      params.append("size",size);
      console.log(documentType)
      // const url  = `https://localhost/api/v2/document/${documentType}`;
      const url  = `${apiUrl}/api/v2/document/${documentType}`;
      const urlWithParams = `${url}?${params.toString()}`;
      const response = await axios.get(urlWithParams,{headers});
      console.log(response)
      if(response.status===200){
        return response.data;
      }
      return null;
    }catch(err){
      console.log(err);
    }
  }

  export const documentUse = async(document)=>{
    const accessToken = Cookies.get("accessToken");
    try{
      if(!document){
        throw Error('provide all required params');
      }
      const headers = {
        'x-api-key': apiHeader,
        Authorization: `Bearer ${accessToken}`
      };
      const body = {
        s3DocumentId:document.documentId,
        link:document.documentUrl
      }
      const url = `${apiUrlNode}/legalAgreement/add/link`
      const response = await axios.post(url,body,{headers});
      if(response.status === 200){
        return response.data;
      }
      return null;
    }catch(err){
      console.log(err);
    }
  }
  