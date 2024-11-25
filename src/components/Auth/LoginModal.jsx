import { InputAdornment, TextField } from "@mui/material";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import OtpF from "../EnquiryPage/otpF";
import { Form, Formik } from "formik";
import { generateOtp } from "@/Apis/login";

const LoginModal = ({
  otpStatus,
  setOtpStatus,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [clientRender, setClientRenderer] = useState(false);

  
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
  
  useEffect(() => {
    setClientRenderer(true);
  }, []);
  useEffect(() => {
    if (otpStatus === "verified") {
      onClose();
    }
    if (!otpStatus) {
      onOpen();
    }
  }, [otpStatus]);
  return (
    <>
      {clientRender && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          backdrop="blur"
          hideCloseButton={true}
          isDismissable={false}
        >
          <ModalContent className="__variable_598ead !font-sans">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Login To Continue
                </ModalHeader>
                <Divider />

                <ModalBody>
                  <Formik
                    initialValues={{phoneNumber:""}}
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
                        {otpStatus === "requested" ? (
                          <OtpF
                            otpStatus={otpStatus}
                            setOtpStatus={setOtpStatus}
                            phoneNumber={values.phoneNumber}
                            fromSigning={true}
                          />
                        ) : (
                          <TextField
                            sx={{ my: 2, width: "100%" }}
                            id="outlined-basic"
                            label="Phone Number"
                            disabled={otpStatus === "verified"}
                            required
                            color={
                              otpStatus === "verified" ? "success" : "secondary"
                            }
                            variant="outlined"
                            InputProps={{
                              maxLength: 10,
                              endAdornment: (
                                <InputAdornment position="end">
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
                                    className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                                  >
                                    Get OTP
                                  </Button>
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
                        )}
                      </Form>
                    )}
                  </Formik>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default LoginModal;
