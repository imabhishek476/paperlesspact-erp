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
} from "@nextui-org/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  CircleDot,
  FileBadge,
  FileText,
  ListOrdered,
  Mail,
  MousePointerClick,
  User2,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { getRentalAgreementById } from "@/Apis/legalAgreement";
import { generateOtp, getUserProfile } from "@/Apis/login";
import Link from "next/link";
import DocumentPreviewFrame from "../Prepare/DocumentPreviewFrame";
import { Alert, InputAdornment, Snackbar, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import OtpF from "@/components/EnquiryPage/otpF";
import * as Yup from "yup";

const validation = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email().required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
      "Enter Valid Phone Number"
    ),
  // userType: Yup.string().nullable(),
});

const SuccessForOutsider = () => {
  const [agreement, setAgreement] = useState(null);
  const [signees, setSignees] = useState(null);
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [otpStatus, setOtpStatus] = useState(null);
  const accessToken = Cookies.get("accessToken");
  const { id } = router.query;
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["exp"]));
 const index = id.split("-")[1];

 const logOut = useLogout();

  const onSubmitHandler = ({values}) =>{
    console.log(values)
}
    console.log(otpStatus === "verified")
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
      try {
        if (!id || !accessToken) {
          throw Error("No id or accessToken provided");
        }
        const response = await getRentalAgreementById(accessToken, extractedId);
        console.log(response);
        if (response) {
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
          }
        }

        return response;
      } catch (err) {
        console.log(err);
      }
    };
    getAgreement();
  }, [id]);
  const requestOTP = async (phoneNumber, setFieldError) => {
    if (
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber)
    ) {
      setOtpStatus("requested");
      const response = await generateOtp(phoneNumber);
    } else {
      setFieldError("phoneNumber", "Enter a valid Mobile Number");
    }
  };
  // <Mail />
  return (
    <>
      <Navbar
        height={"7vh"}
        maxWidth="full"
        className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 sm:[&>header]:gap-4 "
        isBordered
      >
        <NavbarBrand>
          <p className="font-bold text-xl md:ms-3  text-[#05686E]">
            Sign Document
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              onClick={() => {}}
              size="sm"
              endContent={<ArrowDown size={"14px"} />}
              className="hidden md:flex font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
            >
              Actions
            </Button>
          </NavbarItem>
          <NavbarItem>
            {/* {details?.data && (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      // isBordered
                      as="button"
                      className="border-3 rounded-full border-[#E8713C]"
                      classNames={{
                        base: "bg-[#05686E] text-white",
                      }}
                      name={details?.data?.fullname}
                      size="md"
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
                            src: details?.data?.userProfileImageLink,
                          }}
                        />
                      </DropdownItem>
                    </DropdownSection>
  
                    <DropdownItem key="dashboard">
                      <Link href="/dashboard"> Dashboard</Link>
                    </DropdownItem>
                    <DropdownItem key="logout" color="warning">
                      <p onClick={() => logOut()}>Log Out</p>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )} */}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="sm:px-[35px] flex justify-center px-3">
        {/* <Snackbar
            open={true}
            // onClose={() => setSnackbarOpen(false)}
            autoHideDuration={4000}
          >
          </Snackbar> */}
        <section className="w-[50vw]">
          <div className="flex flex-col bg-white border-1 mx-2 rounded-lg mt-4 p-3">
            <Alert severity="success" className=" mb-2  rounded-lg">
              Sucessfully Signed.
            </Alert>
            <p className="text-sm border-b-1 px-2 py-4">
              You have successfully signed this document. A copy of the final
              PDF document has been sent to your email address. Should you have
              any questions or concerns about this document, please contact
              {agreement?.user?.fullname} at the following email address: &nbsp;
              <a
                className="text-[#05686e]"
                href={`mailto:${agreement?.user?.email}`}
              >
                {agreement?.user?.email}
              </a>
              .
            </p>
            <div className="grid lg:grid-cols-2 px-2">
              <div className="hidden lg:block">
                <Image
                  src={agreement?.agreements[0]?.imageUrls[0]}
                  width={400}
                  height={800}
                  alt="preview"
                />
              </div>
              <div>
                <div className="flex h-full flex-col justify-center mt-2 px-2">
                  <span className="text-lg font-semibold text-[#05686E]">
                    Store this document in your account now!
                  </span>
                  <Formik
                    initialValues={{
                      phoneNumber: "",
                      fullname: agreement?.signees[index]
                        ? agreement?.signees[index]?.fullname
                        : "",
                      email: agreement?.signees[index]
                        ? agreement?.signees[index]?.signersEmail
                        : "",
                    }}
                    onSubmit={onSubmitHandler}
                    enableReinitialize
                    validationSchema={validation}
                  >
                    {({
                      values,
                      handleBlur,
                      handleChange,
                      setFieldError,
                      handleSubmit,
                      errors,
                      touched
                    }) => (
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit(e);
                        }}
                      >
                        <TextField
                          sx={{ my: 1, width: "100%" }}
                          id="outlined-basic"
                          label="Fullname"
                          // disabled={otpStatus === "verified"}
                          // color={
                          //   otpStatus === "verified" ? "success" : "secondary"
                          // }
                          variant="outlined"
                          value={values.fullname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="fullname"
                          error={errors.fullname && touched.fullname}
                          helperText={
                            errors.fullname && touched.fullname
                              ? errors.fullname
                              : ""
                          }
                        />
                        <TextField
                          sx={{ my: 1, width: "100%" }}
                          id="outlined-basic"
                          label="Email"
                          // disabled={otpStatus === "verified"}
                          // color={
                          //   otpStatus === "verified" ? "success" : "secondary"
                          // }
                          variant="outlined"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="email"
                          error={errors.email && touched.email}
                          helperText={
                            errors.email && touched.email
                              ? errors.email
                              : ""
                          }
                        />
                        {otpStatus === "requested" ? (
                          <OtpF
                            otpStatus={otpStatus}
                            setOtpStatus={setOtpStatus}
                            phoneNumber={values.phoneNumber}
                            fromSigning={true}
                          />
                        ) : (
                          <TextField
                            sx={{ my: 1, width: "100%" }}
                            id="outlined-basic"
                            label="Phone Number"
                            disabled={otpStatus === "verified"}
                            color={
                              otpStatus === "verified" ? "success" : "secondary"
                            }
                            variant="outlined"
                            InputProps={{
                              maxLength: 10,
                              endAdornment: (
                                <InputAdornment position="end">
                                  {otpStatus === "verified" ? (
                                    <Check className="text-success" />
                                  ) : (
                                    <Button
                                      type="button"
                                      isDisabled={
                                        otpStatus === "verified" &&
                                        values?.phoneNumber?.length === 10
                                      }
                                      size="sm"
                                      radius="sm"
                                      onClick={() =>
                                        requestOTP(
                                          values.phoneNumber,
                                          setFieldError
                                        )
                                      }
                                      className="bg-[#fda178] hover:bg-[#05686E] hover:text-[white] "
                                    >
                                      Get OTP
                                    </Button>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="phoneNumber"
                            error={errors.phoneNumber && touched.phoneNumber}
                          helperText={
                            errors.phoneNumber && touched.phoneNumber
                              ? errors.phoneNumber
                              : ""
                          }
                          />
                        )}
                        <span className="text-small">
                          By signing up you agree to recieve messages via
                          SMS,WhatsApp and email.
                        </span>
                        <div className="w-full flex justify-end">
                          <Button
                            // as={Link}
                            // href="/dashboard"
                            // type="submit"
                            size="sm"
                            isDisabled ={ otpStatus !== "verified"}
                            // isDisabled={otpStatus === "verified"? true : false}
                            // startContent={<ArrowLeft />}
                            className="font-semibold rounded-full border bg-[#05686E] text-white"
                          >
                            Start Now
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SuccessForOutsider;
