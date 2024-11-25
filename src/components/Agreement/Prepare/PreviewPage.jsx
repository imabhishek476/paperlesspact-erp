import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Table,
  TableHeader,
  useDisclosure,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
  Accordion,
  AccordionItem,
  User,
  DropdownSection,
  Avatar,
  Chip,
} from "@nextui-org/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CircleDot,
  FileBadge,
  FileText,
  ListOrdered,
  Mail,
  MousePointerClick,
  Settings,
  User2,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  getRentalAgreementById,
  removeSignee,
  sendReminder,
} from "@/Apis/legalAgreement";
import DocumentPreviewFrame from "./DocumentPreviewFrame";
import { getUserProfile } from "@/Apis/login";
import Link from "next/link";
import { formatDate } from "@/Utils/dateTimeHelpers";
import { useLogout } from "@/components/Navbar/Hooks/Logout/useLogout";
import { Alert, Snackbar } from "@mui/material";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import { createTemplate, getTemplate, globalTemplate } from "../../../Apis/template";
const rows = [
  {
    key: "1",
    recipient: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    recipient: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    recipient: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    recipient: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  {
    key: "Order",
    label: "Order",
    icon: <ListOrdered />,
  },
  {
    key: "fullname",
    label: "Recipient",
    icon: <User2 />,
  },
  {
    key: "status",
    label: "Status",
    icon: <CircleDot />,
  },
  {
    key: "Action",
    label: "Action",
    icon: <MousePointerClick />,
  },
];

const PreviewPage = () => {
  const [agreement, setAgreement] = useState(null);
  const [signees, setSignees] = useState(null);
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const accessToken = Cookies.get("accessToken");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingArray, setLoadingArray] = useState([]);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarError, setSnackbarError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { id } = router.query;
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["exp"]));
  const logOut = useLogout();

  let oneWeekAfter= new Date()
  oneWeekAfter.setDate(oneWeekAfter.getDate()+7)
  oneWeekAfter=oneWeekAfter.toISOString()


  const getDocumentNames = () => {
    if (agreement && agreement?.agreements.length === 1) {
      return agreement?.agreements[0]?.name.length > 20
        ? `${agreement?.agreements[0]?.name.slice(0, 20)}...`
        : agreement?.agreements[0]?.name;
    }
    let name = "";
    if (agreement && agreement?.agreements) {
      agreement?.agreements.map((agreement) => {
        name += `${agreement.name}, `;
      });
    }
    return name;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
        setDetails(userProfile);
        // console.log("User profile data fetched:", userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);
  useEffect(() => {
    // const index = id && id.includes("-") ? id.split("-")[1] : -1;
    const extractedId = id && id.includes("-") ? id.split("-")[0] : id;
    const getAgreement = async () => {
      setIsPageLoading(true);
      try {
        if (!id || !accessToken) {
          throw Error("No id or accessToken provided");
        }
        const response = await getRentalAgreementById(accessToken, extractedId);
        console.log(response);
        if (response) {
          if (response?.isExpired === "1" || response?.isExpired === 1) {
            router.push("/expired");
          }
          setAgreement(response);
          if (response.signees) {
            console.log(
              response.signees.map((signee, index) => {
                return { ...signee, key: index };
              })
            );
            setSignees(
              response.signees.map((signee, index) => {
                return { ...signee, key: index };
              })
            );
            setLoadingArray(() => {
              if (
                response &&
                response?.signees &&
                response?.signees.length > 0
              ) {
                return response?.signees.map((ele) => {
                  return false;
                });
              }
              return [];
            });
          }
        }

        setIsPageLoading(false);
        return response;
      } catch (err) {
        console.log(err);
        setIsPageLoading(false);
      }
    };
    getAgreement();
  }, [id, accessToken]);
  console.log(agreement)
  const [isLoading, setIsLoading] = useState(false);
  const onSigneeRemove = async (signee) => {
    setIsLoading(true);
    const extractedId = id && id.includes("-") ? id.split("-")[0] : id;

    const response = await removeSignee(extractedId, signee);
    console.log(response);
    if (response) {
      setSignees(response?.signees);
      setIsLoading(false);
    }
  };
  // const isSigned = ()=>{
  //   let flag = false;
  //   console.log(details?.data.fullname);
  //   if(agreement&&details){
  //     const userIndex = agreement?.signees.findIndex((signee)=>signee.fullname===details.data.fullname);
  //     console.log(userIndex);
  //     if(userIndex!==-1){
  //       agreement?.items?.map((item)=>{
  //         console.log(item.signee.fullname===details.data.fullname,item.image);
  //       })
  //       if(agreement?.items&&agreement?.items.length>0){
  //         flag = items.some((item)=>{return(item.signee.fullname===details.data.fullname&&item.image)})
  //       }
  //     }
  //   }
  //   return flag;
  // }

  const sendReminderNotification = async (signee, index) => {
    try {
      // setIsLoading(true);
      setLoadingArray((prev) => {
        prev[index] = true;
        return prev.map((ele) => ele);
      });
      const body = {
        documentId: agreement?._id,
        signee: signee,
      };
      const response = await sendReminder(body);
      if (response) {
        console.log("reminder sent");
        setSnackbarError(false);
        setSnackbarMsg("Reminder sent!");
        setSnackbarOpen(true);
      } else {
        setSnackbarError(true);
        setSnackbarMsg("Error sending reminder");
        setSnackbarOpen(true);
      }
      // setIsLoading(false);
      setLoadingArray((prev) => {
        prev[index] = false;
        return prev.map((ele) => ele);
      });
    } catch (err) {
      console.log(err);
    }
  };


  const copyTemplate = async (globalId, userTempId, isRenew) => {
    let obj = {
      copiedTemplateId: globalId,
      newTemplateId: userTempId,
      isRenew:isRenew,
    };
    const res = await globalTemplate(obj);
    console.log(res);
    if (res) {
      console.log(userTempId);
      if (userTempId) {
        if(res?.data?.type === "presentation"){
          router.push(`/presentation/new?id=${userTempId}`);
        } else {
          router.push(`/template/new?id=${userTempId}`);

        }
      }
    }
  };


  const handleRenewTemplate =async(folderName,instanceId,agreementId)=>{
    const templateResponse = await getTemplate(instanceId,Cookies.get('accessToken'))
    console.log(templateResponse)

    // let newName =`Renewed-${folderName}`
    const body = {
      fileJson: "{}",
      folderName: folderName,
      isFile: "1",
      parentId: "root",
    };

    if (templateResponse?.data?.ref?.renewalHistory) {
      body.renewalHistory = [
        ...templateResponse?.data?.ref?.renewalHistory,
        {
          agreementId: agreementId,
          templateId: instanceId,
        },
      ];
    } else {
      body.renewalHistory =[{
        agreementId: agreementId,
        templateId:instanceId,
        }]
    }
    const response = await createTemplate(body);
    console.log(response);
    let userTemplateId = response?.data?._id;
    if (userTemplateId) {
      copyTemplate(instanceId, userTemplateId,true);
    }
  }

  const handleBack = () => {
    router.push("/document");
  };

  useEffect(() => {
    if (agreement && details) {
      setIsSigned(
        agreement?.events?.some(
          (event) => event.action === "Document All Signed"
        )
      );
    } else {
      setIsSigned(false);
    }
  }, [agreement, details]);
  // <Mail />
  if (isPageLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarError ? "error" : "success"}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
      <Navbar
        height={"7vh"}
        maxWidth="full"
        className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 sm:[&>header]:gap-4 "
        isBordered
      >
        <NavbarBrand className="md:pl-20">
          <Button
            onPress={() => handleBack()}
            size="sm"
            startContent={<ArrowLeft size={14} />}
            className="hidden md:flex font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
          >
            Documents
          </Button>
          <Button
            isIconOnly
            className="md:hidden bg-white -ml-4"
            onPress={() => handleBack()}
          >
            <ArrowLeft size={18} />
          </Button>
          <p className="font-bold text-xl md:ms-3  text-[#05686E]">
            Preview Document
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            {details?.data && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    // isBordered
                    as="button"
                    className="border-3 rounded-full border-[#E8713C]"
                    classNames={{
                      base: "bg-[#05686E] text-white",
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
                    <Link href="/dashboard"> Dashboard</Link>
                  </DropdownItem>
                  <DropdownItem key="logout" 
                  // color="warning"
                  className="hover:!bg-[#E8713C] hover:!text-white"
                  >
                    <p onClick={() => logOut()}>Log Out</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="sm:px-[35px] sm:pl-24  px-3">
        <section>
          <div className="mt-10  border rounded-lg">
            <div className="p-2 px-5 border-b bg-[#e3feff]">
              <div className="flex items-center justify-between">
                <div className="flex items-center   gap-1 relative -left-2">
                  <FileBadge className="hidden lg:block sm:w-[38px] w-[20px] " />
                  <p className="font-bold text-[14px]">
                    Document sent by{" "}
                    {agreement &&
                      `${agreement?.user?.fullname} ${
                        agreement?.user?.email
                          ? `(${agreement?.user?.email})`
                          : ""
                      }`}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                {
                  
                  agreement && agreement?.settings?.renewalDate < oneWeekAfter && (
                    <Button color="primary" className="rounded-full" size="sm" onPress={()=>{handleRenewTemplate(agreement?.draftName,agreement?.instanceId,agreement?._id)}}>Renew Document</Button>
                  )
                }
                <Chip color={isSigned ? "success" : "danger"}>
                  {isSigned ? "Signed" : "Not Signed"}
                </Chip>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center p-[20px] border-b lg:border-0">
              <div className="flex flex-col lg:flex-row gap-[15px] lg:gap-4 items-center">
                <p className="text-[14px] lg:text-lg font-bold">
                  {getDocumentNames()}
                </p>
              </div>
              <p className="text-left text-[14px] lg:text-lg">
                Created on{" "}
                {agreement && agreement?.createdDate
                  ? formatDate(agreement?.createdDate)
                  : "Created Date"}
              </p>
            </div>
            <div className="">
              {agreement && (
                <>
                  <table className="w-full justify-center">
                    <thead className="hidden lg:table-row-group border-b-1 bg-[#e3feff]">
                      <tr>
                        <th>
                          <span className="flex items-center gap-2 px-[20px] py-[10px]">
                            <ListOrdered />
                            Order
                          </span>
                        </th>
                        <th>
                          <span className="flex items-center gap-2 px-[20px] py-[10px]">
                            <User2 />
                            Recipient
                          </span>
                        </th>
                        <th>
                          <span className="flex items-center gap-2 px-[20px] py-[10px]">
                            <Settings />
                            Role
                          </span>
                        </th>
                        <th>
                          <span className="flex items-center gap-2 px-[20px] py-[10px]">
                            <CircleDot />
                            Status
                          </span>
                        </th>
                        <th>
                          <span className="flex items-center gap-2 px-[20px] py-[10px]">
                            <MousePointerClick />
                            Action
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {signees.map((signee, index) => {
                        let finalItems = [];
                        console.log(signee)
                        let isEligibleToSendReminder=true;
                        if(signee.key == 0) isEligibleToSendReminder=true;
                        else{
                          const isPreviousSigned = agreement?.events.some(
                            (event) =>
                              event.action === "Document Signed" &&
                              event.user === signees[signee.key-1].fullname
                          );
                          if(isPreviousSigned) isEligibleToSendReminder=true;
                          else isEligibleToSendReminder=false;
                          console.log(isEligibleToSendReminder)
                          console.log(agreement)
                          if(agreement?.isSigningOrder === 'false' || agreement?.isSigningOrder === '0' || agreement?.isSigningOrder === 0) isEligibleToSendReminder=true;
                        }
                        console.log(
                          agreement?.events.some(
                            (event) =>
                              event.action === "Document Signed" &&
                              event.user === signee.fullname
                          )
                        );
                        const isSigned = agreement?.events.some(
                          (event) =>
                            event.action === "Document Signed" &&
                            event.user === signee.fullname
                        );
                        return (
                          <tr
                            key={index}
                            className="flex flex-col lg:table-row border-b"
                          >
                            <td className="hidden lg:table-cell py-[15px] px-5 align-top">
                              {index + 1}{" "}
                            </td>
                            <td className=" flex lg:table-cell justify-between lg:justify-start pt-[15px] lg:py-[15px] px-5 align-top">
                              {" "}
                              <span className="flex gap-2">
                                <Avatar
                                  showFallback
                                  isBordered
                                  //   className="w-4 h-4"
                                  name={signee.fullname.slice(0, 1)}
                                  src={signee.imageUrlLink}
                                  //   classNames={{
                                  //     icon: "text-tiny",
                                  //   }}
                                />

                                <span className="flex flex-col ">
                                  <span className=" flex flex-row gap-1 items-center">
                                    <span className="text-[14px] lg:text-[16px] truncate max-w-[200px]">
                                      {signee.fullname}
                                    </span>
                                  </span>
                                  <span className=" flex flex-row gap-1 items-center">
                                    <Mail size={13} />
                                    <span className="text-[12px] lg:text-[14px]">
                                      {signee.signersEmail}
                                    </span>
                                  </span>
                                </span>
                              </span>{" "}
                              <span className="flex flex-col lg:hidden">
                                <span className="text-right text-[14px]">
                                  {signee?.signerRole}
                                </span>
                                <span className="text-right text-[14px]">
                                  {" "}
                                  {isSigned ? "Signed" : "Not Signed"}
                                </span>
                              </span>
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              {signee?.signerRole}
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              {isSigned ? "Signed" : "Not Signed"}
                            </td>
                            <td className="py-[15px] px-5 align-top">
                              <span className="flex  align-top justify-end lg:justify-start">
                                <Button
                                  radius="sm"
                                  color="secondary"
                                  variant="bordered"
                                  onClick={() =>
                                    sendReminderNotification(signee, index)
                                  }
                                  // isDisabled={!isEligibleToSendReminder}
                                  isDisabled={(isEligibleToSendReminder)? ((isSigned || agreement?.isDraft === 1) ? true : false): true}
                                  isLoading={loadingArray[index]}
                                >
                                  Send Reminder
                                </Button>
                                {/* <Tooltip content="Remove Recipient">
                                  <Button radius="sm" color="danger" isLoading={isLoading} onPress={()=>onSigneeRemove(signee)}>
                                    <X />
                                  </Button>
                                </Tooltip> */}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {agreement?.ccs?.map((signee, index) => {
                        let finalItems = [];
                        for (const ele of agreement.agreements) {
                          finalItems = [...finalItems, ...(ele?.items || [])];
                        }
                        // const isSigned = finalItems.some(
                        //   (el) =>
                        //     el?.signee.fullname === details?.data.fullname &&
                        //     typeof el.image === "string"
                        // );
                        return (
                          <tr
                            key={index}
                            className="flex flex-col lg:table-row border-b"
                          >
                            <td className="hidden lg:table-cell py-[15px] px-5 align-top">
                              {index + 1}{" "}
                            </td>
                            <td className=" flex lg:table-cell justify-between lg:justify-start pt-[15px] lg:py-[15px] px-5 align-top">
                              {" "}
                              <span className="flex gap-2">
                                <Avatar
                                  showFallback
                                  isBordered
                                  //   className="w-4 h-4"
                                  name={signee.fullname.slice(0, 1)}
                                  src={signee.imageUrlLink}
                                  //   classNames={{
                                  //     icon: "text-tiny",
                                  //   }}
                                />

                                <span className="flex flex-col ">
                                  <span className=" flex flex-row gap-1 items-center">
                                    <span className="text-[14px] lg:text-[16px]">
                                      {signee.fullname}
                                    </span>
                                  </span>
                                  <span className=" flex flex-row gap-1 items-center">
                                    <Mail size={13} />
                                    <span className="text-[12px] lg:text-[14px]">
                                      {signee.signersEmail}
                                    </span>
                                  </span>
                                </span>
                              </span>{" "}
                              <span className="flex flex-col lg:hidden">
                                <span className="text-right text-[14px]">
                                  {signee?.signerRole}
                                </span>
                                <span className="text-right text-[14px]">
                                  Not Applicable
                                </span>
                              </span>
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              {signee?.signerRole}
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              Not Applicable
                            </td>
                            <td className="py-[15px] px-5 align-top">
                              <span className="flex  align-top justify-end lg:justify-start">
                                <Button
                                  radius="sm"
                                  color="secondary"
                                  variant="bordered"
                                  isDisabled
                                  onClick={() =>
                                    sendReminderNotification(signee, index)
                                  }
                                  isLoading={loadingArray[index]}
                                >
                                  Send Reminder
                                </Button>
                                {/* <Tooltip content="Remove Recipient">
                                  <Button radius="sm" color="danger" isLoading={isLoading} onPress={()=>onSigneeRemove(signee)}>
                                    <X />
                                  </Button>
                                </Tooltip> */}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {agreement?.approvers?.map((signee, index) => {
                        let finalItems = [];
                        for (const ele of agreement.agreements) {
                          finalItems = [...finalItems, ...(ele?.items || [])];
                        }
                        const isSigned = finalItems.some(
                          (el) =>
                            el.signee.fullname === details?.data.fullname &&
                            typeof el.image === "string"
                        );
                        return (
                          <tr
                            key={index}
                            className="flex flex-col lg:table-row border-b"
                          >
                            <td className="hidden lg:table-cell py-[15px] px-5 align-top">
                              {index + 1}{" "}
                            </td>
                            <td className=" flex lg:table-cell justify-between lg:justify-start pt-[15px] lg:py-[15px] px-5 align-top">
                              {" "}
                              <span className="flex gap-2">
                                <Avatar
                                  showFallback
                                  isBordered
                                  //   className="w-4 h-4"
                                  name={signee.fullname.slice(0, 1)}
                                  src={signee.imageUrlLink}
                                  //   classNames={{
                                  //     icon: "text-tiny",
                                  //   }}
                                />

                                <span className="flex flex-col ">
                                  <span className=" flex flex-row gap-1 items-center">
                                    <span className="text-[14px] lg:text-[16px]">
                                      {signee.fullname}
                                    </span>
                                  </span>
                                  <span className=" flex flex-row gap-1 items-center">
                                    <Mail size={13} />
                                    <span className="text-[12px] lg:text-[14px]">
                                      {signee.signersEmail}
                                    </span>
                                  </span>
                                </span>
                              </span>{" "}
                              <span className="flex flex-col lg:hidden">
                                <span className="text-right text-[14px]">
                                  {signee?.signerRole}
                                </span>
                                <span className="text-right text-[14px]">
                                  Approval Remaining
                                </span>
                              </span>
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              {signee?.signerRole}
                            </td>
                            <td className="hidden lg:table-cell pt-[15px] lg:py-[15px] px-5 align-top">
                              Approval Remaining
                            </td>
                            <td className="py-[15px] px-5 align-top">
                              <span className="flex  align-top justify-end lg:justify-start">
                                <Button
                                  radius="sm"
                                  color="secondary"
                                  variant="bordered"
                                  onClick={() =>
                                    sendReminderNotification(signee, index)
                                  }
                                  isLoading={loadingArray[index]}
                                >
                                  Send Reminder
                                </Button>
                                {/* <Tooltip content="Remove Recipient">
                                  <Button radius="sm" color="danger" isLoading={isLoading} onPress={()=>onSigneeRemove(signee)}>
                                    <X />
                                  </Button>
                                </Tooltip> */}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </section>
        <section>
          {agreement?.agreements && (
            <Accordion
              variant="splitted"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              defaultExpandedKeys={["exp"]}
              itemClasses={{
                base: "px-0 my-3 w-full",
                content: "text-small px-0 shadow-none rounded-sm",
                title: "w-full flex justify-between items-center",
              }}
            >
              {agreement?.certificateURL && (
                <AccordionItem
                  aria-label="Accordion 1"
                  className="rounded-none shadow-none px-0"
                  startContent={
                    <FileText className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]" />
                  }
                  title={
                    <>
                      <span className="text-[14px] lg:text-lg mx-2 font-bold">
                        Envelope Certificate Powered by Easedraft
                      </span>
                    </>
                  }
                >
                  <DocumentPreviewFrame
                    url={agreement?.certificateURL}
                    height={"940px"}
                  />
                </AccordionItem>
              )}
              {agreement?.agreements?.map((document, index) => {
                return (
                  <AccordionItem
                    key={index === 0 ? "exp" : index}
                    aria-label="Accordion 1"
                    className="rounded-none shadow-none px-0"
                    startContent={
                      <FileText className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]" />
                    }
                    title={
                      <>
                        <span className="text-[14px] lg:text-lg mx-2 font-bold">
                          {document.name.length > 20
                            ? `${document.name.slice(0, 20)}...`
                            : document.name}
                        </span>
                        <span className="text-sm mx-2">
                          Pages: {document?.imageUrls?.length}
                        </span>
                      </>
                    }
                  >
                    <DocumentPreviewFrame url={document.mergedStampPdfUrl?document.mergedStampPdfUrl:document.URL} height={"640px"} />
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </section>
      </div>
    </>
  );
};

export default PreviewPage;
