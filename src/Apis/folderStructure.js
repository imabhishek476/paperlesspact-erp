import axios from "axios";
import Cookies from "js-cookie";
// const apiUrl = "http://localhost:4000";
const apiUrl = "https://api.lawinzo.com/node";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875"; //use env
const accessToken = Cookies.get("accessToken");

export async function getFolderStructure(id = "root") {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };

    const params = new URLSearchParams();
    params.append("id", id);
    const url = `${apiUrl}/api/v1/easedraft/folders/folder/structure?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getAncestors(id) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const params = new URLSearchParams();
    params.append("id", id);
    const url = `${apiUrl}/api/v1/easedraft/folders/ancestors?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getAncestorsForServer(accessToken, id) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const params = new URLSearchParams();
    params.append("id", id);
    const url = `${apiUrl}/api/v1/easedraft/folders/ancestors?${params.toString()}`;
    // const url = `http://localhost:4000/api/v1/easedraft/folders/ancestors?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getFavourite(templateType) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const params = new URLSearchParams();
    if(templateType!=="all"){
      params.append("type", templateType);
    }
    const url = `${apiUrl}/api/v1/easedraft/folders/favourite?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getShared(templateType) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const params = new URLSearchParams();
    console.log(templateType)
    if(templateType!=="all"){
      params.append("type", templateType);
    }
    const url = `${apiUrl}/api/v1/easedraft/folders/shared?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getRecent(templateType) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    
    const params = new URLSearchParams();
    if(templateType!=="all"){
      params.append("type", templateType);
    }
    const url = `${apiUrl}/api/v1/easedraft/folders/recents?${params.toString()}`;
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
}
export async function createFolder(name, id, isFile,type,pageSetup) {
  console.log(name, id, isFile);
  try {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("x-api-key", apiHeader);
    myHeaders.append("Content-Type", "application/json");

    // console.log(levels, name);
    var raw = JSON.stringify({
      folderName: name,
      parentId: id,
      isFile: isFile,
      type:type,
      pageSetup:pageSetup
    });
    console.log(name, id, isFile);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${apiUrl}/api/v1/easedraft/folders/create/folder`,
      requestOptions
    );

    const data = await response.json();

    if (data.status) {
      return data.status;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function createFile(fileJson, name, folderName) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer eyJyb2xlIjpbIlJPTEVfTUVNQkVSIl0sImlkIjoiNjU3YWVjMzU3YjVhM2YwNDIzNWM3YjE0IiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiI4MjQ5OTE2NTA2IiwiaWF0IjoxNzAyNTU0NzAzLCJleHAiOjIwMTgxNzM5MDN9.E56Efsl1vlHK8BXK7Vfjoxcuv8Z35Yd4T86iDE5uIKnjP5dTOuLASFlql9VkDIkyq3NOfZXNktK9OwNmL7SLGg"
  );
  myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
  myHeaders.append("Content-Type", "application/json");

  const body = {
    fileJson: fileJson || "{}",
    file: {
      name: name,
    },
  };

  if (folderName && folderName !== "") {
    body.folderName = folderName;
  }
  var raw = JSON.stringify(body);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${apiUrl}/api/v1/easedraft/folders/create/file`,
    requestOptions
  );
  const data = await response.json();

  if (data.status) {
    return data.status;
  }
}
export async function renameFolder(oldfolder, newfolder) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    oldFolderName: oldfolder,
    newFolderName: newfolder,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${apiUrl}/api/v1/easedraft/folders/folder/rename`,
    requestOptions
  );

  const data = await response.json();

  return data.status === "true";
}
export async function rename(id, newName) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${apiUrl}/api/v1/easedraft/folders/folder/rename`,
      // `http://localhost:4000/api/v1/easedraft/folders/folder/rename`,
      { id, newName },
      { headers }
    );
    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log(err);
  }
}
export async function deleteNode(id) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${apiUrl}/api/v1/easedraft/folders/delete`,
      // `http://localhost:4000/api/v1/easedraft/folders/delete`,
      { id: id },
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log(err);
  }
}
export async function addToFav(id, isFavourite = "1") {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${apiUrl}/api/v1/easedraft/folders/favourite`,
      {
        id: id,
        isFavourite,
      },
      { headers }
    );
    if (response.status === 200) {
      return response.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
}
export async function moveFile(currentId, newParentId) {
  try {
    console.log(currentId, newParentId);
    if (!currentId || !newParentId) {
      throw Error("Provide all params");
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiHeader,
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      `${apiUrl}/api/v1/easedraft/folders/move`,
      {
        currentId,
        newParentId,
      },
      { headers }
    );
    if (response.status === 200) {
      return response?.data?.data;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
}
// export const templateUse=async(body)=>{
// 	try{
// 		const  headers = {
// 			"Authorization": `Bearer ${accessToken}`,
// 			"x-api-key": apiHeader,
// 			"Content-Type": "application/json"
// 		}
// 		const response = await axios.post(
// 			`${apiUrl}/api/v1/easedraft/folders/use`,
// 			// `http://localhost:4000/api/v1/easedraft/folders/use`,
// 			body,
// 			{headers}
// 		);
// 		if(response.status===200){
// 			return response?.data;
// 		}
// 		return null;
// 	}catch(err){
// 		console.log(err);
// 	}
// }
export const templateUse = async (body) => {
  const accessToken = Cookies.get("accessToken");
  console.log(body);
  let data;
  try {
    if (
      body.items.some(
        (el) =>
          (el?.type === "file" ||
            el?.type === "video" ||
            (el.type === "inEditorImage")) &&
          el.file||el?.link
      ) ||
      body.stampFile
    ) {
      const formData = new FormData();
      formData.append("id", body.id);
      formData.append("editorState", JSON.stringify(body.editorState));
      formData.append("items", JSON.stringify(body.items));
      formData.append("signMethod", body.signMethod);
      formData.append("settings", JSON.stringify(body.settings));
      formData.append("participants", body.participants);
      formData.append("signees", JSON.stringify(body.signees));
      formData.append("pageSetup",body.pageSetup);
      formData.append("showPageNo",body?.showPageNo);
      const fileItems = body.items.filter(
        (el) =>
          (el.type === "file" ||
            el.type === "video" ||
            el.type === "inEditorImage") &&
          el.file
      );
      for (const fileItem of fileItems) {
        console.log(fileItem);
        formData.append(fileItem.id, fileItem.file);
        if (fileItem?.thumbnailFile) {
          formData.append(`thumbnail-${fileItem.id}`, fileItem.thumbnailFile);
        }
      }
      if (body.stampFile) {
        formData.append("stampFile", body.stampFile);
      }
      console.log(formData.keys());
      let headers = {
        "x-api-key": "449772DE-2780-4412-B9F7-E49E48605875",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };
      const response = await axios.post(
        `${apiUrl}/api/v1/easedraft/folders/use?isApprover=${body.isApprover}`,
        // `http://localhost:4000/api/v1/easedraft/folders/use?isApprover=${body.isApprover}`,
        formData,
        {
          headers,
        }
      );
      data = response.data;
    } else {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": apiHeader,
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${apiUrl}/api/v1/easedraft/folders/use?isApprover=${body.isApprover}`,
        // `http://localhost:4000/api/v1/easedraft/folders/use?isApprover=${body.isApprover}`,
        body,
        { headers }
      );
      data = response.data;
    }
    console.log(data);
    // if (response.status === 200) {
    //   return data;
    // }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export async function moveFolder(source, dest) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    sourceFolder: source,
    destinationFolder: dest,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${apiUrl}/api/v1/easedraft/folders/folder/move`,
    requestOptions
  );

  return response.json();
}

export const downloadPDF = async (body) => {
  const accessToken = Cookies.get("accessToken");
  console.log(body);
  let data;
  try {
    if (
      body.items.some(
        (el) =>
          (el?.type === "file" ||
            el?.type === "video" ||
            el.type === "inEditorImage") &&
          el.file
      ) ||
      body.stampFile
    ) {
      const formData = new FormData();
      formData.append("id", body.id);
    //   formData.append("content", body?.content);
      formData.append("editorState", JSON.stringify(body.editorState));
      formData.append("items", JSON.stringify(body.items));
      formData.append("pageSetup", JSON.stringify(body.pageSetup));
	  console.log(JSON.stringify(body.items))
      const fileItems = body.items.filter(
        (el) =>
          (el.type === "file" ||
            el.type === "video" ||
            el.type === "inEditorImage") &&
          el.file
      );
      for (const fileItem of fileItems) {
        console.log(fileItem);
        formData.append(fileItem.id, fileItem.file);
        if (fileItem?.thumbnailFile) {
          formData.append(`thumbnail-${fileItem.id}`, fileItem.thumbnailFile);
        }
      }
      if (body.stampFile) {
        formData.append("stampFile", body.stampFile);
      }
      console.log(formData);
      let headers = {
        "x-api-key": "449772DE-2780-4412-B9F7-E49E48605875",
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "multipart/form-data",
      };
       const res = await fetch(
		// `http://localhost:4000/api/v1/easedraft/folders/downloadPDF`,
        `${apiUrl}/api/v1/easedraft/folders/downloadPDF`,
		 {
        method: "POST",
        body:formData,
        headers: headers,
      })
        .then((res) => res.arrayBuffer())
        .then((blob2) => {
          console.log(blob2);
          const blob = new Blob([blob2], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.pdf"); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return true;
        }).catch(()=>{});
      if(res){
        return true;
      }  
      return null;
    } else {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": apiHeader,
        "Content-Type": "application/json",
      };
      const res = await fetch(
        // `http://localhost:4000/api/v1/easedraft/folders/downloadPDF`,
	  `${apiUrl}/api/v1/easedraft/folders/downloadPDF`,
     {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
      })
        .then((res) => res.arrayBuffer())
        .then((blob2) => {
          console.log(blob2);
          const blob = new Blob([blob2], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.pdf"); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(()=>{});
        if(res){
          return true;
        }  
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};
