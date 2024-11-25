import { getUserProfile } from "@/Apis/login";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  Switch,
  User,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Card from "./Card";
import { useEnv } from "../Hooks/envHelper/useEnv";
import { Alert, Snackbar } from "@mui/material";

const UpgradePage = ({ data }) => {
  const [details, setDetails] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  const inDevEnvironment = useEnv();
  const logOut = () => {
    if (inDevEnvironment) {
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
    router.reload();
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(accessToken);
        setDetails(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar
        isBlurred={false}
        isBordered
        className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 lg:[&>header]:gap-4 "
        maxWidth="full"
      >
        <NavbarContent
          justify="start"
          className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end lg:pl-[60px] pl-[20px]"
        >
          <h1 className="font-bold text-xl text-[#05686E] truncate max-w-[40vw] ps-5">
            Upgrade
          </h1>
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end"
        >
          {details?.data && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="border-3 rounded-full border-[#E8713C]"
                  classNames={{
                    base: "bg-[#05686E] text-white text-[16px]",
                  }}
                  name={
                    details?.data?.fullname
                      ? details?.data?.fullname.slice(0, 1)
                      : ""
                  }
                  size="md"
                  showFallback
                  src={details?.data?.userProfileImageLink}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection aria-label="Profile & Actions" showDivider>
                  <DropdownItem
                    isReadOnly
                    key="profile"
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      name={details?.data?.fullname}
                      description={details?.data?.phone}
                      classNames={{
                        name: "text-default-600",
                        description: "text-default-500",
                      }}
                      avatarProps={{
                        size: "lg",
                        src: details?.data?.userProfileImageLink?.present && details?.data?.userProfileImageLink,
												name: details?.data?.fullname
													? details?.data?.fullname.slice(0, 1)
													: "",
												className: "text-[18px]",
												fallback: details?.data?.fullname
												&& details?.data?.fullname.slice(0, 1)
                      }}
                    />
                  </DropdownItem>
                </DropdownSection>

                <DropdownItem key="dashboard">
                  <NextLink href="/dashboard"> Dashboard</NextLink>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  onClick={() => logOut()}
                  // color="warning"
                  className="hover:!bg-[#E8713C] hover:!text-white"
                >
                  <p>Log Out</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      </Navbar>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarMsg}</Alert>
      </Snackbar>
      <div className="lg:px-[35px] lg:pl-24  px-3">
        <section className="w-full flex flex-col items-center justify-center min-h-[200px] ">
          <div className="flex flex-col items-center justify-center pb-6 my-4">
            <h3 className="text-[30px] md:text-[60px] font-bold pb-4 text-[#05686E]">
              {data?.title}
            </h3>
            <span className="text-[12px] md:text-[24px]">{data?.subtitle}</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 mb-4">
            <span className="cursor-pointer" onClick={() => setIsYearly(false)}>
              Montly
            </span>
            <Switch
              color="secondary"
              size="sm"
              isSelected={isYearly}
              onValueChange={setIsYearly}
            />
            <span className="cursor-pointer" onClick={() => setIsYearly(true)}>
              Yearly
            </span>
            {isYearly ? (
              <span className="font-medium text-white text-[16px] rounded-md border  bg-[#05686E] px-2 py-1 ">
                Save up to {data?.discount}%
              </span>
            ) : (
              <span className="font-medium text-white text-[16px] rounded-md border  bg-[#05686E50] px-2 py-1 ">
                Save up to {data?.discount}%
              </span>
            )}
          </div>
        </section>
        <section className=" md:flex flex-nowrap gap-4 items-stretch align-middle justify-center w-full px-10 ">
          {data?.data?.map((item, index) => {
            return (
              <div key={index} className="my-4 md:my-0 flex justify-center">
                <Card
                  item={item}
                  key={index}
                  quoteType={isYearly ? "Yearly" : "Monthly"}
                  index={index}
                  setSnackbarOpen={setSnackbarOpen}
                  setSnackbarMsg={setSnackbarMsg}
                />
              </div>
            );
          })}
        </section>
        <section className="w-full flex flex-col items-center justify-center mt-6 mb-10">
          <div className="flex flex-col items-center justify-center lg:max-w-[350px] pb-6">
            <span className="text-[16px]">
              Prices exclude any applicable taxes.
            </span>
          </div>
          <div className="flex flex-col items-center justify-center  pb-6">
            <h3 className="text-[26px] md:text-[40px] font-semibold pb-4 text-[#05686E]">
              {data.faqTitle || "Questions? We have answers."}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch justify-center pb-6 px-5 md:px-10">
            {data?.faq?.map((item, index) => {
              console.log(item);
              return (
                <div
                  key={index}
                  className="my-4 md:my-0 flex flex-col lg:max-w-[350px] justify-start"
                >
                  <span className="font-bold pb-2 text-[18px]">
                    {item.title}
                  </span>
                  <span className="text-[16px] font-light">{item.body}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default UpgradePage;
