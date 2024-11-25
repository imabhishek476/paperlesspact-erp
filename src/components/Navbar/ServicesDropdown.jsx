import {
  Button,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Dropdown,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, InputAdornment, TextField } from "@mui/material";
import OtpF from "../EnquiryPage/otpF";
import { Form, Formik } from "formik";
import { generateOtp, getUserProfile } from "@/Apis/login";
import { Divider } from "@nextui-org/react";
// import AddDocuments from "../documents/AddDocuments/AddDocuments";
import Cookies from "js-cookie";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const ServicesDropdown = ({ services, isMobile }) => {
  const [service, setService] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userId, setUserId] = useState(null);
  const [otpStatus, setOtpStatus] = useState(null);
  const [initialValues, setInitialValues] = useState({})
  const accessToken = Cookies.get("accessToken")
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
          if(userProfile){
            setInitialValues({
                phoneNumber: userProfile.data.phone,
                fullname: userProfile.data.fullname
            })
        }
          console.log("User profile data fetched:", userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
  
      fetchUserProfile();
      console.log(initialValues)
  }, [accessToken])
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
  return (
    <>
      <Dropdown className="hidden md:flex">
        <DropdownTrigger>
          <Button
            disableRipple
            className="text-[11px] hover:text-[#EABF4E]  text-[#161C2D] font-[500] tracking-widest leading-5"
            // endContent={idiscons.chevron}
            radius="sm"
            variant="light"
            size="md"
          >
            <WidgetsOutlinedIcon sx={{ stroke: "#ffffff", strokeWidth: 1 }} />{" "}
            {!isMobile &&
            (service ? service?.serviceName.toLocaleUpperCase() : "SERVICES")
            }
            <KeyboardArrowDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="ACME features"
          className="w-[340px] overflow-y-auto h-[350px] z-[9999]"
          itemClasses={{
            base: "gap-4",
          }}
        >
          {services?.map((s) => {
            return (
              <DropdownItem
                key={s.serviceTypeId}
                // startContent={icons.scale}
              >
                <Button
                  variant="light"
                  onPress={onOpen}
                  onClick={() => setService(s)}
                  className="__variable_598ead !font-sans w-full justify-start"
                >
                  {s.serviceName}
                </Button>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} placement="center">
        <ModalContent className="__variable_598ead !font-sans">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Enquiry</ModalHeader>
              <Divider />

              <ModalBody>
                <Formik
                  initialValues={initialValues}
                  //   onSubmit={onSubmitHandler}
                  enableReinitialize
                >
                  {({
                    values,
                    handleBlur,
                    handleChange,
                    setFieldError,
                    handleSubmit,
                    errors,
                  }) => (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                    >
                      <TextField
                        sx={{ mb: 0, mt: 2, width: "100%" }}
                        id="outlined-basic"
                        label="Enquiry Name"
                        // disabled={otpStatus === "verified"}
                        required
                        color="secondary"
                        variant="outlined"
                        disabled
                        value={service?.serviceName}
                        onChange={handleChange}
                        error={errors.enquiryName}
                        onBlur={handleBlur}
                        name="enquiryDetails"
                        helperText={errors.enquiryName}
                      />
                      <TextField
                        sx={{ mb: 0, mt: 2, width: "100%" }}
                        id="outlined-basic"
                        label="Full Name"
                        required
                        color="secondary"
                        variant="outlined"
                        value={values.fullname}
                        onChange={handleChange}
                        error={errors.fullname}
                        onBlur={handleBlur}
                        name="fullname"
                        helperText={errors.fullname}
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
                            color={
                              otpStatus === "verified" ? "success" : "secondary"
                            }
                            variant="outlined"
                            // InputProps={{
                            //     ...params.InputProps,
                            //     endAdornment: (
                            //       <InputAdornment position="end">
                            //         <SearchOutlinedIcon />
                            //       </InputAdornment>
                            //     ),
                            //   }}
                            InputProps={{
                              maxLength: 10,
                              endAdornment: (
                                <InputAdornment position="end">
                                    {otpStatus === "verified" ?
                                    <CheckCircleOutlineIcon className="text-success"/>
                                :
                                  <Button
                                    type="button"
                                    isDisabled={otpStatus === "verified" &&  values?.phoneNumber?.length ===10}
                                    size="sm"
                                    radius="sm"
                                    onClick={() =>
                                      requestOTP(
                                        values.phoneNumber,
                                        setFieldError
                                      )
                                    }
                                    className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                                  >
                                    Get OTP
                                  </Button>
                                }
                                </InputAdornment>
                              ),
                            }}
                            value={values.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                            onBlur={handleBlur}
                            name="phoneNumber"
                            helperText={errors.phoneNumber}
                          />
                          {otpStatus === "verified" && (
                            <>
                              <TextField
                                sx={{ mb: 0, mt: 2, width: "100%" }}
                                id="outlined-basic"
                                label="Enquiry Details"
                                // disabled={otpStatus === "verified"}
                                required
                                color="secondary"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={values.enquiryDetails}
                                onChange={handleChange}
                                error={errors.enquiryDetails}
                                onBlur={handleBlur}
                                name="enquiryDetails"
                                helperText={errors.enquiryDetails}
                              />
                              {/* <AddDocuments
                          documentsArray={documentsArray}
                          setDocumentsArray={setDocumentsArray}
                          documentsAPIList={documentsAPIList}
                          setDocumentsAPIList={setDocumentsAPIList}
                          type={"cases"}
                          /> */}
                            </>
                          )}
                        </>
                      )}
                    </Form>
                  )}
                </Formik>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                {!(otpStatus === "verified") ? (
                  <Button
                    className="bg-[#EABF4E] hover:bg-black hover:text-white"
                    onPress={onClose}
                    isDisabled
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    className="bg-[#EABF4E] hover:bg-black hover:text-white"
                    onPress={onClose}
                  >
                    Submit
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ServicesDropdown;
