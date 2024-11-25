import React, { useEffect, useState } from "react";
import {TextField, Typography } from "@mui/material";
import { generateOtp } from "@/Apis/login";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import OtpF from "./OtpF";
import { Button } from "@nextui-org/react"; 
import { useRouter } from "next/router";

const Edit = ({ disableSmLogin, editNumber,verifiedOtp, setVerifiedOtp  }) => {
  // const theme = useTheme();

  useEffect(() => {
    console.log("is mobile", disableSmLogin);
  }, [disableSmLogin]);
  const router = useRouter()
  const phoneUrl = router.query.phoneNumber;
  const [isLoading, setIsLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const getOtp = async () => {
    if (phoneNumber) {
      const response = await generateOtp(phoneNumber);
    } else {
      const response = await generateOtp(phoneUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber)
    ) {
      setShowOtp(true);
      setError("");
      getOtp();
    } else {
      setError("Enter a valid phone number");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };
  useEffect(() => {
    if (phoneUrl) {
      if (
        /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneUrl)
      ) {
        setShowOtp(true);
        getOtp();
      } else {
        setError("Enter a valid phone number");
      }
    }
    if (editNumber) {
      setPhoneNumber(editNumber);
    }
  }, [phoneUrl]);

  return (
    <>
      {showOtp ? (
        <OtpF
          phoneNumber={phoneNumber ? phoneNumber : phoneUrl}
          disableSmLogin={disableSmLogin}
          verifiedOtp={verifiedOtp} setVerifiedOtp={setVerifiedOtp}
        />
      ) : (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div sx={{ mb: 2, color: "#3c4d62", fontWeight: "400" }}>
                  <label>
                    <TextField
                      fullWidth
                      id="Enter Mobile Number"
                      label="Enter Mobile Number"
                      placeholder="Enter Mobile Number"
                      type="tel"
                      color="secondary"
                      onChange={handleChange}
                      value={phoneNumber}
                      required
                    />
                  </label>
                  {error && (
                    <div sx={{ display: "flex", alignItems: "center" }}>
                      <ErrorOutlineIcon color="error" fontSize="small" />
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "12px",
                          ml: 1,
                        }}
                      >
                        {error}
                      </Typography>
                    </div>
                  )}
                </div>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{
                    mb: -1,
                    backgroundColor: "#EABF4E",
                    position: "relative",
                    letterSpacing: "0.02em",
                    alignItems: "center",
                    fontWeight: "900",
                  }}
                  // onClick={getOtp}
                >
                  Get OTP
                </Button>
              </form>
      )}
    </>
  );
};

export default Edit;
