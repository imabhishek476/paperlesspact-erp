import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";

export const createEnquiry = async (body) => {
	try {
		const Body = {
			...body,
		};

		let headers = new Headers();
		headers.append("x-api-key", apiHeader);
		headers.append("Authorization", "Bearer " + accessToken);

		const response = await axios.post(
			`https://api.lawinzo.com/node/api/v1/contrakt/help/enquiry`,
			Body,
			{ headers }
		);

		// if (response.status === 200) {
		// console.log("Enquiry Created", response);
		return response;
		// }
	} catch (error) {
		console.log(error);
	}
};

export const completeEnquiry = async (body) => {
	try {
		const accessToken = Cookies.get("accessToken");
		let headers = new Headers();
		headers.append("x-api-key", apiHeader);
		headers.append("Authorization", "Bearer " + accessToken);
		const params = new URLSearchParams();
		params.append("isPay", 1);
		params.append("platform", "cloud");
		const url = apiUrl + "/enquiry";
		const urlWithParams = `${url}?${params.toString()}`;
		const Body = {
			...body,
			isActive: 1,
		};

		const response = await axios.post(urlWithParams, Body, { headers });

		// if (response.status === 200) {
		console.log("Enquiry Completed", response);
		return response?.data?.data;
		// }
	} catch (error) {
		console.log(error);
	}
};

export const getEnquiryDetailsById = async (enquiryId) => {
	try {
		if (!enquiryId) {
			throw Error("No id ");
		}
		const accessToken = Cookies.get("accessToken");
		const headers = {
			"x-api-key": apiHeader,
			Authorization: `Bearer ${accessToken}`,
		};
		const response = await axios.get(apiUrl + `/enquiry/${enquiryId}`, {
			headers,
		});
		// console.log(response);
		if (response.status === 200) {
			return response?.data;
		}
		return null;
	} catch (err) {
		console.log(err);
	}
};
