import Cookies from "js-cookie";
import axios from 'axios';

const apiURL = 'https://api.lawinzo.com/api/v1/easedraft';

export const updatePresentation = async (body) => {
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
        `${apiURL}/presentation/update`,
        // `http://localhost:4000/api/v1/easedraft/presentation/update`,
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

  export const downloadPresentationPDF = async (body) => {
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
        `${apiURL}/presentation/downloadPresentationPDF`,
        // `http://localhost:4000/api/v1/easedraft/presentation/downloadPresentationPDF`,
        requestOptions
      ).then((res) => res.arrayBuffer())
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
      }).catch(()=>{});;
      console.log(response);
      // const data = await response.json();
      // if (response.status === 200) {
      //   return data;
      // }
      return response
    } catch (error) {
      console.log(error);
    }
  };