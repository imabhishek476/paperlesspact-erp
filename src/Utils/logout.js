import Cookies from "js-cookie";

export const removeCookies = () => {
	let inDevEnvironment = false;

	if (process && process.env.NODE_ENV === "development") {
		inDevEnvironment = true;
	}

	if (inDevEnvironment) {
		Cookies.remove("accessToken");
		Cookies.remove("assignedRole");
		Cookies.remove("isLoggedIn");
		Cookies.remove("onbording");
	} else {
		Cookies.remove("accessToken", { domain: ".easedraft.com" });
		Cookies.remove("assignedRole", { domain: ".easedraft.com" });
		Cookies.remove("isLoggedIn", { domain: ".easedraft.com" });
		Cookies.remove("onbording", { domain: ".easedraft.com" });
	}
};
