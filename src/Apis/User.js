import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = "https://api.easedraft.com";
const apiHeader = "449772DE-2780-4412-B9F7-E49E48605875";
export const updateProfilePicture = async (accessToken, image) => {
	try {
		if (!accessToken || !image) {
			throw Error("Missing required parameters in update profile picture");
		}

		const formData = new FormData();
		formData.append("profileimage", image);

		const headers = {
			"x-api-key": apiHeader,
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "multipart/form-data",
		};

		const response = await axios.post(`${apiUrl}/user/image`, formData, {
			headers,
		});

		if (response.status === 200) {
			const data = response.data;
			console.log(data);
			return { data: data };
		}
	} catch (error) {
		console.log(error);
	}
};

export const getLawyerState = async () => {
	const response = await fetch(apiUrl + "/state", {
		method: "GET",
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};
export const getCaseCity = async (stateId) => {
	let headers = new Headers();

	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + `/state/districts/${stateId}`, {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};

export const getLang = async () => {
	// console.log("in lawyer lang");
	const response = await fetch(apiUrl + "/language", {
		method: "GET",
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};

export const getCourt = async () => {
	// console.log("in lawyer court");
	let headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + "/api/v1/courts", {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};
export const getUnderSection = async () => {
	console.log("in lawyer court");
	let headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + "/api/v1/section", {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};
export const getCaseType = async () => {
	console.log("in lawyer court");
	let headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + "/api/v1/caseType", {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};

export const getEdu = async () => {
	// console.log("in lawyer Edu");
	let headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + "/api/v1/educations", {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};

export const getSpec = async () => {
	// console.log("in lawyer spec");
	let headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("x-api-key", apiHeader);
	const response = await fetch(apiUrl + "/api/v1/speciality", {
		method: "GET",
		headers,
	})
		.then((response) => {
			const res = response.json();
			return res;
		})
		.catch((response) => {
			return response;
		});
	return response;
};

export const LawyerProfileUpdate = async (accessToken, obj) => {
	try {
		console.log(obj);
		let headers = new Headers();
		headers.append("Content-Type", "application/json");
		// headers.append('Authorization', 'Bearer ' + 'application/json');
		console.log(accessToken);
		headers.append("x-api-key", apiHeader);
		headers.append("Authorization", "Bearer " + accessToken);
		const response = await fetch(apiUrl + "/lawyer/profile", {
			method: "POST",
			headers,
			body: JSON.stringify(obj),
		});
		// console.log(response);

		if (response.status === 200) {
			const data = await response.json();
			// console.log(data);
			return { data: data };
		}
	} catch (e) {
		console.log(e);
	}
};

export const UpdateUserProfile = async (
	mobile,
	name,
	email,
	role,
	accessToken
) => {
	try {
		const obj = {
			phone: mobile,
			fullname: name,
			email: email,
			password: mobile,
			alternate: true,
			roles: [role],
		};
		console.log(obj);
		const url = "https://api.easedraft.com/user/profile";
		let headers = new Headers();
		headers.append("Content-Type", "application/json");
		// headers.append('Authorization', 'Bearer ' + 'application/json');
		headers.append("x-api-key", apiHeader);
		headers.append("Authorization", "Bearer " + Cookies.get("accessToken"));
		console.log(headers.get("x-api-key"), headers.get("Authorization"));
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiHeader,
				Authorization: `Bearer ${Cookies.get("accessToken")}`,
			},
			body: JSON.stringify(obj),
		});
		console.log(response);

		if (response.status === 200) {
			const data = await response.json();
			console.log(data);
			return { data: data };
		}
	} catch (e) {
		console.log(e);
	}
};
