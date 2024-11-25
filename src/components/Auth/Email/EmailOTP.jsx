import React, { useEffect, useState } from "react";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { generateOtp, sendEmailOTP, validateOtp, verifyEmailOTP } from "@/Apis/login";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";
import { requestAadharOTP, verifyAadharOTP } from "@/Apis/aadhar";


const EmailOTP = ({ email, setEmailStatus,fullname}) => {
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpForSigning, setOtpForSigning] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  const OtpReceived = async () => {
    setIsSubmitting(true)
    if (/^\d{6}$/.test(otp)) {
        // if(otp==="123456"){
        //     setEmailStatus("verified");

        // }else{
        //     setError("Please enter correct OTP!");
        // }
        const response = await verifyEmailOTP(email, otp);
        setIsSubmitting(false)
        console.log(response)
        if(response){
            setEmailStatus("verified");
            // setAadharData(response?.data)
        }else{
            setError("Please enter correct OTP!");
        }
    } else {
        setIsSubmitting(false)
      setError("OTP must be a number and must be exactly 6 digits!");
    }
    // setIsSubmitting(true);
    // if (/^\d{6}$/.test(otp)) {
    //   if (otp === "123456") {
    //     setAadharStatus("verified");
    //   } else {
    //     setError("Please enter correct OTP!");
    //   }
    // } else {
    //   setError("OTP must be a number and must be exactly 6 digits!");
    // }
    setIsSubmitting(false);
  };

  const getOtp = async () => {
    console.log("clicked");
    const response = await generateOtp(aadharNumber);
    console.log(response);
  };

  const resendOTP = async () => {
      setIsSubmitting(true)
      const res = await sendEmailOTP(email,fullname);
      if(res){
        setEmailStatus("requested");
      }
      setIsSubmitting(false)
    setSeconds(30);
  };
  return (
    <>
      <div className="mt-3 flex justify-between mb-3">
        <Typography
          variant={"h2"}
          sx={{
            color: "#344357",
            fontSize: "0.975rem",
            fontWeight: "700",
            // mb: 2,
          }}
        >
           {`OTP sent on email ending with ${email?.toString()?.slice(0,1)}******${email?.toString()?.slice(-4)}`}

        </Typography>
      </div>
      <TextField
        sx={{ width: "100%" }}
        id="outlined-basic"
        label="OTP"
        required
        color="secondary"
        variant="outlined"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        error={error}
        InputProps={{
          maxLength: 10,
          endAdornment: (
            <InputAdornment position="end">
              <Button
                type="button"
                size="md"
                radius="sm"
                className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                onClick={OtpReceived}
                isLoading={isSubmitting}
              >
                Verify
              </Button>
            </InputAdornment>
          ),
        }}
        name="fullname"
        helperText={error}
      />
      <div className="flex items-center justify-between">
        <Typography
          variant={"body1"}
          sx={{
            fontSize: "0.875rem",
            fontWeight: "500",
            mb: 2,
            mt: 2,
          }}
        >
          {seconds > 0
            ? `Time Remaining: ${seconds} seconds`
            : "No OTP Received? Try Again"}
        </Typography>
        <Button
          isDisabled={seconds > 0}
          variant="light"
          onClick={resendOTP}
          size="sm"
          radius="sm"
        >
          {seconds > 0 ? "" : "Resend OTP"}
        </Button>
      </div>
    </>
  );
};

export default EmailOTP;
