import { NextResponse } from "next/server";
import { getUserProfile } from "./Apis/login";
import { getDashboardCount } from "./Apis/legalAgreement";
import { getSubscription } from "./Apis/subscription";

export async function middleware(request) {
  // const notProtected = ["/"];
  // console.log(request.nextUrl.pathname.includes("sign"),"from middleware",request.nextUrl.pathname);
  // if (request.nextUrl.pathname === "/document/new") {
  // 	const isLoggedIn = request.cookies.get("isLoggedIn");
  // 	const accessToken = request.cookies.get("accessToken");
  // 	const id = request.nextUrl.searchParams.get("id");
  // 	if (
  // 		isLoggedIn &&
  // 		accessToken &&
  // 		isLoggedIn.value === "true" &&
  // 		accessToken.value
  // 	) {
  // 		const newUrl = new URL(request.nextUrl);
  // 		console.log("newUrl", newUrl.pathname, newUrl.origin);
  // 		return NextResponse.rewrite(
  // 			new URL(request.nextUrl.origin + request.nextUrl.pathname + "?id=" + id)
  // 		);
  // 	}
  // 	const jwt = request.nextUrl.searchParams.get("jwt");
  // 	const response = NextResponse.next();
  // 	response.cookies.set("isLoggedIn", true);
  // 	response.cookies.set("accessToken", jwt);
  // 	return;
  // }
  // if (request.nextUrl.pathname === "/onboarding/success") {
  // 	const onboarding = request.cookies.get("onboarding");
  // 	if (onboarding === "true") {
  // 		const user = await getUserProfile(accessToken.value);
  // 		console.log("user.data.data", user.data);
  // 		if (user?.data?.fullname !== "") {
  // 			const dashboardUrl = request.nextUrl.clone();
  // 			dashboardUrl.pathname = "/dashboard";

  // 			return NextResponse.redirect(dashboardUrl);
  // 		}
  // 		return NextResponse.next();
  // 	}
  // }
  // console.log("MIDDLEWARE", request.nextUrl.pathname);
  if (request.nextUrl.pathname === "/oauth2/redirect") {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === "/onboarding") {
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const accessToken = request.cookies.get("accessToken");

    if (
      isLoggedIn &&
      accessToken &&
      isLoggedIn.value === "true" &&
      accessToken.value
    ) {
      const user = await getUserProfile(accessToken.value);
      // console.log("user.data.data", user.data);
      if (user?.data?.fullname !== "" && user?.data?.phone) {
        // console.log("================");
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";

        const id =request.nextUrl.searchParams.get("teamId")
          if(id){
            dashboardUrl.pathname = "/team/invited";
            dashboardUrl.searchParams.set("teamId",id)
            return NextResponse.redirect(dashboardUrl);
          }
          
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname === "/") {
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const accessToken = request.cookies.get("accessToken");
    if (
      isLoggedIn &&
      accessToken &&
      isLoggedIn.value === "true" &&
      accessToken.value
    ) {
      // console.log(accessToken.value);
      const user = await getUserProfile(accessToken.value);
      // console.log("user.data.data", user);
      if (user?.data?.fullname === "") {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = "/onboarding";
        return NextResponse.redirect(onboardingUrl);
      }

      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }
  if (
    request.nextUrl.pathname !== "/"
    // || !request.nextUrl.pathname.includes("sign")
  ) {
    // console.log("document");
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const accessToken = request.cookies.get("accessToken");
    // console.log("get: ", isLoggedIn, accessToken);
    // const isUser = await getUserProfile(accessToken);
    // console.log("check : ", isUser, isLoggedIn);
    if (request.nextUrl.pathname === "/document/new") {
      const dashData = await getDashboardCount(accessToken?.value);
      const subscriptionData = await getSubscription(accessToken?.value);
      // console.log("path", dashData, subscriptionData);
      if (dashData && subscriptionData) {
        if (
          dashData?.totalThisMonthCount >= subscriptionData?.currentPlan?.quota
        ) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/upgrade";
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
    if (
      isLoggedIn &&
      accessToken &&
      isLoggedIn.value === "true" &&
      accessToken.value
    ) {
      const user = await getUserProfile(accessToken.value);
      // console.log("user.data.data", user);
      // console.log("check : ", accessToken.value, isLoggedIn);
      // console.log("path : ", request.nextUrl.pathname);
      if (user && user?.data?.profileStatus === 0) {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = "/onboarding";
        if(request.nextUrl.pathname.includes("invited")){
          const id =request.nextUrl.searchParams.get("teamId")
          if(id)
          onboardingUrl.searchParams.set("teamId",id)
        }
        const response = NextResponse.redirect(onboardingUrl);
        response.headers.set("x-middleware-cache", "no-cache");
        return response;
      }
      // if(){
      
      // }
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = "/";
    if (request.nextUrl.pathname.includes("sign") || request.nextUrl.pathname.includes("print") ) {
      return NextResponse.next();
    }
    if(request.nextUrl.pathname.includes("invited")){
      const id =request.nextUrl.searchParams.get("teamId")
      if(id)
      url.searchParams.set("teamId",id)
    }
    return NextResponse.redirect(url);
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
