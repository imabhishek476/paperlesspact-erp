import { getUserProfile } from "@/Apis/login";
import { useEnv } from "@/components/Hooks/envHelper/useEnv";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function OauthRedirect() {
	const path = usePathname();
	const router = useRouter();
	const inDevEnvironment = useEnv();
	async function profile(token, id) {

		console.log("my id is =================================>",id);
		const profile = await getUserProfile(token);
		if (profile) {
			console.log(profile.data);
			if (inDevEnvironment) {
				Cookies.set("accessToken", token);
				Cookies.set("isLoggedIn", true);
			} else {
				Cookies.set("accessToken", token, {
					expires: 1,
					domain: ".easedraft.com",
				});
				Cookies.set("isLoggedIn", true, {
					expires: 1,
					domain: ".easedraft.com",
				});
			}
			console.log(!profile?.data?.phone);
			if (!profile?.data?.phone) {
				console.log(profile.data);
				if(id && id!==undefined){
					router.push("/onboarding?id=" + id);
				}
				router.push("/onboarding");
			} else {
				if (id) {
					return router.push("/document/new?id=" + id);
				}
				router.push("/dashboard");
			}
		} else {
			// router.back();
		}
	}
	useEffect(() => {
		console.log("hello");
		console.log(path);
		const token = router?.query?.token;
		const id = router?.query?.id;
		console.log(token, id);
		// console.log(queryParameters.get("token"), token);
		if (token || (token && id)) {
			profile(token, id);
		}
	}, [router.query]);

	return <LoadingPage />;
}

export default OauthRedirect;
