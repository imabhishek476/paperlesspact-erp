import { Box, TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import OtpF from "./otpF";
import { generateOtp } from "@/Apis/login";
import { completeEnquiry, getEnquiryDetailsById } from "@/Apis/enquiry";


const Step2 = ({ enquiryId,handleNext, handleBack }) => {
  const [userId, setUserId] = useState(null)
  const [orderId, setOrderId] = useState(null)
  useEffect(() => {
    if(orderId){
        const posX = window.screen.width / 3;
        const posY = window.screen.height / 2;
        const width = 500;
        const height = 680;
        const popUpPosition = `location,status,scrollbars,height=${height},width=${width},left=${posX},top=${posY}`;
        const myWindow = window.open(
          `https://api.easedraft.com/payment/initiate?order_id=${orderId}&retry=1&platform=cloud`,
          "new",
          popUpPosition
        );
        // myWindow.onbeforeunload(()=>{
        //     console.log("closed"); // setIsPaymentDone(true);
        
        // })  
        const checkClosed = setInterval(() => {
          if (myWindow.closed) {
            clearInterval(checkClosed);
  
            // setActiveStep((prev)=>prev+1);
            // console.log(enquiryBody);
            // if(enquiryBody?.order_status){
            getPaymentStatus();
            console.log("closed"); // setIsPaymentDone(true);
            // }
          }
        }, 1000);
    }
  }, [orderId])
  

  const getPaymentStatus = async () => {
    const response = await getEnquiryDetailsById(enquiryId);
    console.log(response);
    if (response) {
      if (response?.data?.payment?.order_status === "Success") {
        console.log("payment complete")
        window.location = 'https://cloud.lawinzo.com/clients';
      } else {
        console.log("payment failed")
        window.location = 'https://cloud.lawinzo.com/clients';
      }
    }
  };

  const onSubmitHandler = async (values) =>{
    console.log(values)
    const response = await completeEnquiry({
      user: {
        id: userId,
      },
      enquiryId: enquiryId,
    })
    if (response) {    
      console.log(response)
      setOrderId(response?.order_id)
    }
  }
  const [otpStatus, setOtpStatus] = useState(null)
  const requestOTP = async (phoneNumber,setFieldError) => {
    if (
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber)
    ) {
      setOtpStatus("requested")
      const response = await generateOtp(phoneNumber);
    } else {
      setFieldError("phoneNumber","Enter a valid Mobile Number");
    }
  }
  return (
    <>
      <Formik initialValues={{}} onSubmit={onSubmitHandler} enableReinitialize>
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
                  color="secondary"
                  variant="outlined"
                  inputProps={{
                    maxLength: 10,
                  }}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  onBlur={handleBlur}
                  name="phoneNumber"
                  helperText={errors.phoneNumber}
                />
                <Button
                  type="button"
                  isDisabled={otpStatus === "verified"}

                  size="sm"
                  radius="sm"
                  onClick={()=>requestOTP(values.phoneNumber,setFieldError)}
                  className="bg-[#EABF4E] hover:text-[white] hover:bg-[black] mt-3"
                >
                  {otpStatus === "verified"? "Phone Number Verified!" : "Get Otp"}
                </Button>
                {otpStatus === "verified" && 
                <Box sx={{ mb: 2, mt: 2 }}>
                  <div>
                    <Button
                      type="submit"
                      size="md"
                      radius="sm"
                      className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                    >
                      Finish
                    </Button>
                    <Button
                      // isDisabled
                      onClick={handleBack}
                      radius="sm"
                      size="md"
                      variant="bordered"
                      className="ms-2"
                    >
                      Back
                    </Button>
                  </div>
                </Box>
          
                }
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Step2;
