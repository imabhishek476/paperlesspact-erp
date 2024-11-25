import React, { useEffect, useState } from "react";
import PagesPreviewPane from "../Prepare/PagesPreviewPane";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
} from "@nextui-org/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  getRentalAgreementById,
  prepareDocument,
  signDocument,
} from "@/Apis/legalAgreement";
import PagePreviewSign from "./PagePreviewSign";
import SignActionBar from "./SignActionBar";
import { Alert, InputAdornment, Snackbar, TextField } from "@mui/material";
import { useRouter } from "next/router";
import OtpF from "@/components/EnquiryPage/otpF";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { generateOtp, sendEmailOTP } from "@/Apis/login";
import Otp from "@/components/Auth/Aadhar/OTP";
import { requestAadharOTP } from "@/Apis/aadhar";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import EmailOTP from "@/components/Auth/Email/EmailOTP";
// import Navbar from "@/components/Navbar/Navbar";
const colors = [
  {
    color: "rgba(0, 112, 240,0.2)",
    variant: "primary",
  },
  {
    color: "rgba(245, 165, 36,0.2)",
    variant: "warning",
  },
  {
    color: "rgba(243, 83, 96,0.2)",
    variant: "danger",
    auth: true,
  },
];

const validation = Yup.object().shape({
  fullName: Yup.string().required("Full name is required").nullable(),
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

const SignAgreementPage = ({ id, isSign, userType }) => {
  const [agreement, setAgreement] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(null);
  const [offsetY, setOffsetY] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedFieldItem, setSelectedFieldItem] = useState(null);
  const [update, setUpdate] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loginModal = useDisclosure();
  const index = id && id.includes("-") ? id.split("-")[1] : -1;
  const extractedId = id && id.includes("-") ? id.split("-")[0] : id;
  const accessToken = Cookies.get("accessToken");
  const [selectedSignee, setSelectedSignee] = useState(null);
  const [auth, setAuth] = useState("email");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null);
  const [aadhaarStatus, setAadhaarStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [signees, setSignees] = useState([]);
  const router = useRouter();
  const emailModal = useDisclosure();
  const aadhaarModal = useDisclosure();
  const [aadhaarRequestId, setAadhaarRequestId] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [aadhaarError, setAadhaarError] = useState("");
  const [isVerifing, setIsVerifing] = useState(false);

  const verifySigningMethod = () => {
    if (agreement && agreement?.signMethod) {
      if (agreement?.signMethod === "aadhaar") {
        aadhaarModal.onOpen();
      }
      if (agreement?.signMethod === "email") {
        emailModal.onOpen();
      }
    }
    if (!accessToken) {
      loginModal.onOpen();
    }
  };

  useEffect(()=>{
    if(otpStatus==="verified"){
      const accessToken = Cookies.get("accessToken")
      if(accessToken){
        router.reload()
      }
    }
  },[otpStatus])
  const getAgreement = async () => {
    console.log(id);
    setIsPageLoading(true);
    try {
      if (!id || !accessToken) {
        throw Error("No id or accessToken provided");
      }
      const response = await getRentalAgreementById(
        accessToken,
        extractedId,
        index
      );
      console.log(response);
      if (response) {
        if(response?.isExpired==="1"||response?.isExpired===1){
          router.push("/expired");
          }
        setAgreement(response);
        if (response?.agreements) {
          console.log(response.agreements[currentDocumentIndex].items);
          setItems(
            response.agreements[currentDocumentIndex].items
              ? response.agreements[currentDocumentIndex].items
              : []
          );
                  }
        setSelectedSignee({
          ...response?.signees[index],
          color: colors[index % 3].color,
          variant: colors[index % 3].variant,
        });
        setSignees(response?.signees);
        // setAadhaarNumber(
        //   response?.signees.length > 0
        //     ? response?.signees[index].aadhaarNo
        //     : null
        // );
        console.log(
          response?.signMethod === "email",
          response?.signMethod === "aadhaar"
        );
        if (response?.signMethod === "aadhaar") {
          setTaskId(`${extractedId}-${index}`);
          aadhaarModal.onOpen();
          // requestOTPAadhaar(`${extractedId}-${index}`);
        }
        if (response?.signMethod === "email") {
          emailModal.onOpen();
          // setEmailStatus("requested");
          requestEmailOTP(
            response?.signees[index].signersEmail,
            response?.signees[index].fullname
          );
          setEmail(response?.signees[index].signersEmail);
          // requestOTPAadhaar(`${extractedId}-${index}`);
        }

        // if(response?.signees&&response?.signees.length>0&&index&&(index>=response?.signees.length||index<response?.signees.length)){
        //   router.push('/404');
        // }
      }
      setIsPageLoading(false);
      return response;
    } catch (err) {
      console.log(err);
      setIsPageLoading(false);
    }
  };

  const requestEmailOTP = async (email, fullname) => {
    try {
      const res = await sendEmailOTP(email, fullname);
      console.log(res);
      if (res) {
        setEmailStatus("requested");
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  const handlePageIndexChange = (docIndex, index) => {
    setCurrentPageIndex(index);
  };

  const isAllItemsSigned = () => {
    let flag = true;
    console.log(items);
    const userItems = items.filter(
      (ele) => ele?.signee?.fullname === selectedSignee?.fullname
    );
    // userItems.forEach((item)=>{
    for (const item of userItems) {
      if (item.field === "Signature" || item.field === "Initials") {
        if (!item.image) {
          flag = false;
        }
      }
      if (item.field === "Date Signed") {
        if (!item.text) {
          flag = false;
        }
      }
      if (item.type === "text") {
        if (!item.text) {
          flag = false;
        }
      }
      if (item.type === "image") {
        if (!item.image) {
          flag = false;
        }
      }
      if (item.type === "file" || item.type==="stamp") {
        if (!item.file) {
          flag = false;
        }
      }
      
      if ( item.field === "radio buttons" || item.field === "dropdown"  || item.field==="checkbox" ) {
        if (!item.text) {
          flag = false;
        }
      }
    }
    return flag;
  };
console.log(items)
  const handleSubmit = () => {
    setIsLoading(true);
    const prepare = async (documentId, items, accessToken) => {
      const response = await signDocument(
        documentId,
        items,
        selectedSignee,
        agreement?._id,
        accessToken
      );
      if (response) {
        setSnackbarOpen(true);
        setIsLoading(false);
        router.push(`/document/success?id=${id}`);
      } else {
        // setSnackbarOpen(true);
        setIsLoading(false);
      }
      console.log(response);
    };
    console.log(items);
    const documentId = agreement?.agreements[currentDocumentIndex]?._id;
    if (isAllItemsSigned()) {
      prepare(documentId, items, accessToken);
    } else {
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  const requestOTPAadhaar = async (taskId) => {
    setAadhaarStatus("requested");
    try {
      console.log(aadhaarNumber, taskId);
      const res = await requestAadharOTP(aadhaarNumber, taskId);
      if (
        res?.response_message === "Valid Authentication" &&
        res?.result?.is_otp_sent
      ) {
        setAadhaarRequestId(res?.request_id);
        setTaskId(res?.task_id);
      }
      // setIsSubmitting(false)
    } catch (err) {
      console.log(err);
    }
  };
  const verifyAadhar = () => {
    setIsVerifing(true);
    if (aadhaarNumber === selectedSignee.aadhaarNo) {
      requestOTPAadhaar(taskId);
      setAadhaarError("");
    } else {
      setAadhaarError(
        "Enter the aadhaar number provided when creating the document"
      );
    }
    setIsVerifing(false);
  };

  useEffect(() => {
    if (
      currentDocumentIndex > -1 &&
      agreement?.agreements[currentDocumentIndex]?.items
    ) {
      setItems(agreement?.agreements[currentDocumentIndex]?.items);
    } else {
      setItems([]);
    }
  }, [currentDocumentIndex]);

  useEffect(() => {
    if (!selectedSignee?.auth) {
      setAuth(false);
    }
  }, [selectedSignee]);

  useEffect(() => {
    if (!accessToken) {
      loginModal.onOpen();
    } else {
      loginModal.onClose();
    }
  }, [accessToken]);

  useEffect(() => {
    if (aadhaarStatus === "verified") {
      aadhaarModal.onClose();
    }
  }, [aadhaarStatus]);

  useEffect(() => {
    if (emailStatus === "verified") {
      emailModal.onClose();
    }
  }, [emailStatus]);

  useEffect(() => {
    if (!isOpen && accessToken) {
      getAgreement();
    }
  }, [loginModal.isOpen]);

  // useEffect(()=>{
  //   if(id&&!index){
  //     router.push("/404");
  //   }
  // },[index])
  useEffect(() => {
    getAgreement();
  }, [id]);
  if (isPageLoading) {
    return <LoadingPage />;
  }
  // if(emailStatus==="verified"||aadhaarStatus==="verified"){
  return (
    <>
      <Modal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
        isDismissable={false}
        backdrop="blur"
        placement="center"
        classNames={{
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          <ModalHeader>Verify phone number to continue</ModalHeader>
          <Formik
            initialValues={{ phoneNumber: "" }}
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
                }}
                className="p-4 pt-0"
              >
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
                      sx={{ my: 2, width: "100%" }}
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
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={aadhaarModal.isOpen}
        onOpenChange={aadhaarModal.onOpenChange}
        isDismissable={false}
        backdrop="blur"
        placement="center"
        classNames={{
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          <ModalHeader>Aadhaar Verification</ModalHeader>
          <ModalBody>
            {aadhaarStatus === "requested" ? (
              <Otp
                aadharNumber={
                  agreement &&
                  agreement.signees &&
                  agreement.signees.length > 0 &&
                  index
                    ? agreement?.signees[index].aadhaarNo
                    : null
                }
                setAadharStatus={setAadhaarStatus}
                fromSigning={true}
                aadharRequestId={aadhaarRequestId}
                taskId={`${extractedId}-${index}`}
                setAadharRequestId={setAadhaarRequestId}
                setAadharData={setAadhaarData}
              />
            ) : (
              <TextField
                sx={{ mb: 0, mt: 2, width: "100%" }}
                id="outlined-basic"
                autoComplete="false"
                label="Aadhar Number"
                required
                variant="outlined"
                value={aadhaarNumber}
                error={aadhaarError ? true : false}
                helperText={aadhaarError}
                onChange={(event) => {
                  setAadhaarNumber(event.target.value);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                  if (e.target.value.length > 0) {
                    e.target.value = Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 12);
                  }
                }}
                disabled={aadhaarStatus === "verified"}
                InputProps={{
                  maxLength: 12,
                  endAdornment: (
                    <InputAdornment position="end">
                      {aadhaarStatus === "verified" ? (
                        <CheckCircleOutlineIcon className="text-success" />
                      ) : (
                        <Button
                          type="button"
                          size="md"
                          radius="sm"
                          className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                          onClick={verifyAadhar}
                          isLoading={isVerifing}
                        >
                          Verify
                        </Button>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={emailModal.isOpen}
        onOpenChange={emailModal.onOpenChange}
        isDismissable={false}
        backdrop="blur"
        placement="center"
        classNames={{
          closeButton: "hidden",
        }}
      >
        <ModalContent>
          <ModalHeader>Email Verification</ModalHeader>
          <ModalBody>
            {emailStatus === "requested" && (
              <EmailOTP
                email={email}
                setEmailStatus={setEmailStatus}
                fullname={
                  agreement &&
                  agreement?.signees &&
                  agreement?.signees.length > 0 &&
                  index
                    ? agreement?.signees[index]?.fullname
                    : ""
                }
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={4000}
      >
        <Alert severity="error">Fill all the fields</Alert>
      </Snackbar>
      <Navbar height={"7vh"} maxWidth="full" isBordered>
        <NavbarBrand>
          <p className="text-[24px] font-semibold text-[#151513]">
            Sign Document
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {(emailStatus === "verified" || aadhaarStatus === "verified") && (
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className="capitalize  text-[16px]"
                    endContent={<KeyboardArrowDownIcon />}
                  >
                    {agreement?.agreements[currentDocumentIndex]?.name}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  onAction={(index) => setCurrentDocumentIndex(index)}
                >
                  {agreement &&
                    agreement?.agreements.length > 0 &&
                    agreement?.agreements.map((document, index) => {
                      return (
                        <DropdownItem key={index}>
                          {document?.name}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex flex-col items-end text-[9px] ">
              <p>Powered By</p>
              <Image
                height={30}
                width={130}
                src={"/images/Colibri.png"}
                alt="laiwnzo logo"
              />
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {accessToken &&
      (emailStatus === "verified" || aadhaarStatus === "verified") ? (
        <div className=" relative flex flex-col">
          <div className="grid grid-cols-12 h-[93vh]">
            <PagesPreviewPane
              document={
                agreement?.agreements[currentDocumentIndex] &&
                agreement?.agreements[currentDocumentIndex]
              }
              currentDocumentIndex={currentDocumentIndex}
              handlePageIndexChange={handlePageIndexChange}
              currentPageIndex={currentPageIndex}
            />
            <PagePreviewSign
              documentPages={
                agreement?.agreements
                  ? agreement?.agreements[currentDocumentIndex]?.imageUrls
                  : null
              }
              stampPages={
                agreement?.agreements&&agreement?.agreements[currentDocumentIndex]&&agreement?.agreements[currentDocumentIndex]?.stampImgUrls
                ? agreement?.agreements[currentDocumentIndex]?.stampImgUrls
                : null
              }
              currentPageIndex={currentPageIndex}
              items={items}
              offsetX={offsetX}
              offsetY={offsetY}
              setOffsetX={setOffsetX}
              setOffsetY={setOffsetY}
              selectedFieldItem={selectedFieldItem}
              setSelectedFieldItem={setSelectedFieldItem}
              onOpen={onOpen}
              selectedSignee={selectedSignee}
              setUpdate={setUpdate}
              update={update}
              setItems={setItems}
              signees={signees}
            />
            <SignActionBar
              setOffsetX={setOffsetX}
              setOffsetY={setOffsetY}
              setSelectedFieldItem={setSelectedFieldItem}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              items={items}
              selectedFieldItem={selectedFieldItem}
              setItems={setItems}
              selectedSignee={selectedSignee}
              setSelectedSignee={setSelectedSignee}
              auth={auth}
              setAuth={setAuth}
            />
            <div className="absolute z-[50] bottom-0 w-full py-2 px-5 bg-white flex justify-between items-center gap-2">
              <div></div>
              <p className="text-[#151513] text-[10px] md:text-[14px]">
                I agree to be legally bound by this agreement and the{" "}
                <Link
                  href="https://easedraft.com/terms-and-conditions"
                  className="text-[10px] lg:text-[14px]"
                >
                  easedraft terms and conditions.
                </Link>{" "}
                Click on "Confirm" to sign this agreement.
              </p>
              <Button
                radius="sm"
                className="bg-[#fda178]"
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[93vh] flex flex-col justify-center items-center gap-4">
          <p className="text-[20px]">Please Verify To continue</p>
          <Button
            onPress={() => verifySigningMethod()}
            className="bg-[#fda178]"
          >
            Verify
          </Button>
        </div>
      )}
    </>
  );
  // }
};

export default SignAgreementPage;

//secondary snackbar
{
  /* <div class="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-gray-50 shadow-lg p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
<div class="inline-flex items-center text-green-500">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clip-rule="evenodd"
    />
  </svg>
  Notification sent successfully!
</div>
<div class="text-green-700 cursor-pointer hover:text-green-800">
  <span class="flex-shrink-0 inline-flex item-center justify-center border-l-2 border-t-2 border-green-700 p-1 leading-none rounded-full"
  onClick={handleClose}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </span>
</div>
</div> */
}
