import { getCity, getState } from "@/Apis/information";
import {
  Autocomplete,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import RoofingIcon from "@mui/icons-material/Roofing";
import HailIcon from "@mui/icons-material/Hail";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Button } from "@nextui-org/react";
import { createRentalAgreement } from "@/Apis/legalAgreement";
import Cookies from "js-cookie";
import OtpF from "@/components/EnquiryPage/otpF";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { generateOtp, getUserProfile } from "@/Apis/login";
import * as Yup from "yup";

const validation = Yup.object().shape({
  fullName: Yup.string().required("Full name is required").nullable(),
  stamp: Yup.string().required("Stamp Amount is required").nullable(),
  email: Yup.string().email().nullable(),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
      "Enter Valid Phone Number"
    )
    .nullable(),
  // userType: Yup.string().nullable(),
});

const Step1 = ({
  // initialValues,
  agreementResponse,
  setAgreementResponse,
  handleNext,
  handleBack,
  setCompleted,
}) => {
  const [otpStatus, setOtpStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [UserTypeError, setUserTypeError] = useState("");
  const [initialValues, setInitialValues] = useState({
    fullName:"",
    phoneNumber:"",
    email: "",
    stamp: "",
    userType: "",
  });

  const isLoggedIn = Cookies.get("isLoggedIn");
  useEffect(() => {
    if (isLoggedIn === "true") {
      const getUserDetails = async (accessToken) => {
        const res = await getUserProfile(accessToken);
        if (res) {
          console.log(res);
          setInitialValues((prev) => {
            return {
              ...prev,
              fullName: res?.data?.fullname,
              phoneNumber: res?.data?.phone,
            };
          });
          setOtpStatus("verified");
        }
      };
      const accessToken = Cookies.get("accessToken");
      getUserDetails(accessToken);
    }
  }, [isLoggedIn]);
  useEffect(()=>{
    if(agreementResponse){
        setInitialValues({
          fullName: agreementResponse ? agreementResponse?.user?.fullname : "",
          phoneNumber: agreementResponse ? agreementResponse?.user?.phone : "",
          email: agreementResponse ? agreementResponse?.user?.email : "",
          stamp: agreementResponse ? agreementResponse?.stampAmount : "",
          userType: agreementResponse ? agreementResponse?.user?.userType : "",
        })
    }
  },[agreementResponse])
  const requestOTP = async (phoneNumber, setFieldError) => {
    if (
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber)
    ) {
      setOtpStatus("requested");
      const response = await generateOtp(phoneNumber);
    } else {
      setFieldError("phone", "Enter a valid Mobile Number");
    }
  };

  const onSubmitHandler = async (values, actions) => {
    console.log(values?.userType);
    if (!values.userType) {
      setUserTypeError("Choose a Role");
    } else {
      setUserTypeError("");
      setIsLoading(true);
      const accessToken = Cookies.get("accessToken");
      const lawyerId = Cookies.get("lawyerId");
      console.log(lawyerId);

      // if(!accessToken){
      // return
      // }
      console.log(values);
      const data = {
        rentalId: agreementResponse?._id || null,
        user: {
          id: lawyerId,
          fullname: values.fullName,
          userType: values.userType,
          phone: values.phoneNumber,
          email: values.email || values.email,
        },
        stampAmount: values.stamp,
      };
      const res = await createRentalAgreement(accessToken, data, "0");
      if (res) {
        setAgreementResponse(res);
        console.log(res);
        setCompleted((prev) => {
          let temp = prev;
          temp[0] = true;
          console.log(temp);
          return temp;
        });
        setIsLoading(false);
        handleNext();
      }
    }
  };
  const errorCheck = (userType) => {
    if (!userType) {
      setUserTypeError("Choose a Role");
    }
  };

  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Enter Basic Details
      </p>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
        validationSchema={validation}
        enableReinitialize
      >
        {({
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          setFieldError,
          errors,
          touched,
        }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Full Name"
              required
              color="secondary"
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName && touched.fullName}
              onBlur={handleBlur}
              name="fullName"
              helperText={
                errors.fullName && touched.fullName ? errors.fullName : ""
              }
            />

            {otpStatus === "requested" ? (
              <OtpF
                otpStatus={otpStatus}
                setOtpStatus={setOtpStatus}
                phoneNumber={values.phoneNumber}
                setUserId={setUserId}
              />
            ) : (
              <>
                <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  id="outlined-basic"
                  label="Phone Number"
                  disabled={otpStatus === "verified"}
                  required
                  color={otpStatus === "verified" ? "success" : "secondary"}
                  variant="outlined"
                  InputProps={{
                    maxLength: 10,
                    endAdornment: (
                      <InputAdornment position="end">
                        {otpStatus === "verified" ? (
                          <CheckCircleOutlineIcon className="text-success" />
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
                              requestOTP(values.phoneNumber, setFieldError)
                            }
                            className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                          >
                            Get OTP
                          </Button>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber && touched.phoneNumber}
                  onBlur={handleBlur}
                  name="phoneNumber"
                  helperText={
                    errors.phoneNumber && touched.phoneNumber
                      ? errors.phoneNumber
                      : ""
                  }
                />
              </>
            )}
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Email"
              color="secondary"
              value={values.email}
              onChange={handleChange}
              error={touched.email && errors.email}
              onBlur={handleBlur}
              name="email"
              helperText={errors.email && touched.email ? errors.email : ""}
            />

            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Stamp"
              color="secondary"
              required
              value={values.stamp}
              onChange={handleChange}
              error={touched.stamp && errors.stamp}
              onBlur={handleBlur}
              name="stamp"
              helperText={errors.stamp && touched.stamp ? errors.stamp : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <div className="mt-5">
              <p className="mb-3">I am a/an</p>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer hover:border-logo-golden/60 ${
                      values.userType === "Tenant"
                        ? "bg-[#f2f3f8] border-logo-golden text-logo-golden"
                        : ""
                    }`}
                    onClick={() => setFieldValue("userType", "Tenant")}
                  >
                    <HailIcon
                      style={{
                        fontSize: "16px",
                        // color: "rgba(156, 163, 175,1)",
                      }}
                      className={`${
                        values.userType === "Tenant"
                          ? "fill-logo-golden"
                          : "text-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Tenant</p>
                  </div>
                </div>
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer hover:border-logo-golden/60 ${
                      values.userType === "Landlord"
                        ? "bg-[#f2f3f8] border-logo-golden text-logo-golden"
                        : ""
                    }`}
                    onClick={() => setFieldValue("userType", "Landlord")}
                  >
                    <RoofingIcon
                      style={{
                        fontSize: "16px",
                        // color: "rgba(156, 163, 175,1)",
                      }}
                      className={`${
                        values.userType === "Landlord"
                          ? "fill-logo-golden"
                          : "text-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Landlord</p>
                  </div>
                </div>
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer  hover:border-logo-golden/60 ${
                      values.userType === "Agent"
                        ? "bg-[#f2f3f8] border-logo-golden text-logo-golden"
                        : ""
                    }`}
                    onClick={() => setFieldValue("userType", "Agent")}
                  >
                    <SupportAgentIcon
                      style={{
                        fontSize: "16px",
                        // color: "rgba(156, 163, 175,1)",
                      }}
                      className={`${
                        values.userType === "Agent"
                          ? "fill-logo-golden"
                          : "text-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Agent</p>
                  </div>
                </div>
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer  hover:border-logo-golden/60 ${
                      values.userType === "Lawyer"
                        ? "bg-[#f2f3f8] border-logo-golden text-logo-golden"
                        : ""
                    }`}
                    onClick={() => setFieldValue("userType", "Lawyer")}
                  >
                    <PermIdentityIcon
                      style={{
                        fontSize: "16px",
                        // color:"rgba(156, 163, 175,1)"
                      }}
                      className={`${
                        values.userType === "Lawyer"
                          ? "fill-logo-golden text-logo-golden"
                          : "color-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Lawyer</p>
                  </div>
                </div>
              </div>
              {UserTypeError && (
                <div>
                  <span className="text-[#d32f2f] text-[0.75rem]">
                    {UserTypeError}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-start md:justify-end pt-10 pb-3">
              <Button
                type="submit"
                size="md"
                radius="sm"
                className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                onClick={(e) => {
                  errorCheck(values?.userType);
                  handleSubmit(e);
                }}
                isLoading={isLoading}
                isDisabled={otpStatus !== "verified"}
              >
                Save & Continue
              </Button>
              {/* <Button
                isDisabled
                radius="sm"
                size="md"
                variant="bordered"
                className="ms-2"
              >
                Save & Continue
              </Button> */}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step1;
