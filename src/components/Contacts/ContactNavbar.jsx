import { getUserProfile } from "../../Apis/login";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  User,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useEnv } from "../Hooks/envHelper/useEnv";

const ContactNavbar = ({ content, handleSubmit }) => {
  const [details, setDetails] = useState(null);
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
  return (
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
          {content?.title}
        </h1>
      </NavbarContent>
      <NavbarContent
        justify="end"
        className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end"
      >
        <Button
          onPress={handleSubmit}
          className="hidden md:flex font-semibold rounded-full bg-[#05686E] text-background px-[20px] py-[5px] mr-4 w-max"
        >
          {content?.links?.title}
        </Button>
        
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
        {/* {modal} */}
      </NavbarContent>
    </Navbar>
  );
};

export default ContactNavbar;
