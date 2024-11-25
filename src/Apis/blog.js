import axios from "axios";

export const getBlogs = async (court,type,pageNumber,pageSize,language) => {
    try {
      const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
      const headers = {
        'x-api-key': apiHeader,
        'Authorization': "Bearer eyJyb2xlIjpbIlJPTEVfTEFXWUVSIiwiUk9MRV9BRE1JTiJdLCJpZCI6IjY0ZTVlNGUwNzlhOTczZjM2ZTc4ZWY5ZSIsImFsZyI6IkhTNTEyIn0.eyJzdWIiOiI5ODc2NTQzMjEwIiwiaWF0IjoxNjk0MDgxMjcxLCJleHAiOjIwMDk3MDA0NzF9.Q5uHDj7U_LH-bEAzpXidkwIKRCupor4NFv1pyfpUONnEdxnzqggbTs-MoCbsy1tyGQWUtBayVjk2kllHZhh7dQ"
      };
      const url = `https://api.easedraft.com/api/v1/judgments`;
      
      const params = new URLSearchParams();
        params.append("page", pageNumber);
        params.append("isActive", 1);
        params.append("size", pageSize);
        
        if(court){
            params.append("court", court);
        }
        console.log(type)
        if(type){
            params.append("isJudgement", type);
            params.append("type", type);
        }
        if(language){
          console.log(language)
          params.append("language",language)
        }
        const urlWithParams = `${url}?${params.toString()}`;
        console.log(urlWithParams)
      const response = await axios.get(urlWithParams, { headers });
      
      // console.log(response);
      if (response.status === 200) {
        // console.log("case report fetched", response);
        return response?.data
      }
    } catch (e) {
      console.log(e);
    }
  };

  export const getBlogsById = async (id,type) => {
    try {
      const apiHeader="449772DE-2780-4412-B9F7-E49E48605875"
      const headers = {
        'x-api-key': apiHeader,
        'Authorization': "Bearer eyJyb2xlIjpbIlJPTEVfTEFXWUVSIiwiUk9MRV9BRE1JTiJdLCJpZCI6IjY0ZTVlNGUwNzlhOTczZjM2ZTc4ZWY5ZSIsImFsZyI6IkhTNTEyIn0.eyJzdWIiOiI5ODc2NTQzMjEwIiwiaWF0IjoxNjk0MDgxMjcxLCJleHAiOjIwMDk3MDA0NzF9.Q5uHDj7U_LH-bEAzpXidkwIKRCupor4NFv1pyfpUONnEdxnzqggbTs-MoCbsy1tyGQWUtBayVjk2kllHZhh7dQ"
      };
      let urlWithParams
      if(type==="Judgement"){
        urlWithParams = `https://api.easedraft.com/api/v1/judgments/${id}?isJudgement=Judgement`;
      }else{
        urlWithParams = `https://api.easedraft.com/api/v1/judgments/${id}?isJudgement=None`;
      }
      const response = await axios.get(urlWithParams, { headers });
  
      // console.log(response);
      if (response.status === 200) {
        // console.log("case report fetched", response);
        return response?.data
      }
    } catch (e) {
      console.log(e);
    }
  };