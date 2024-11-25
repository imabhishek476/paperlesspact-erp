import { create } from "zustand";
import { getUserProfile } from "../../../Apis/login";
import Cookies from "js-cookie";
import { devtools } from 'zustand/middleware';
export const useUserStore = create((set) => ({
  details: null,
  setUserDetails: async (accessToken) => {
    const res = await getUserProfile(accessToken);
    console.log(res);
    set({ details: res });
  },
  logout: () => {
    if (process.env.NODE_ENV === "development") {
      Cookies.remove("accessToken");
      Cookies.remove("assignedRole");
      Cookies.remove("isLoggedIn");
      Cookies.remove("onbording");
      console.log("in me");
    } else {
      Cookies.remove("accessToken", { domain: ".easedraft.com" });
      Cookies.remove("assignedRole", { domain: ".easedraft.com" });
      Cookies.remove("isLoggedIn", { domain: ".easedraft.com" });
      Cookies.remove("onbording", { domain: ".easedraft.com" });
      console.log("in me");
    }
    set({ details: null });
  },
}));
