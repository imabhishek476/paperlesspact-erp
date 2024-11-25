import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  SvgIcon,
} from "@mui/material";
import { generateOtp, validateOtp, getUserProfile } from "@/Apis/login";
import { EnquiryValidations } from "app/utils/validators";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import {
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  Autocomplete,
   TextField
} from "@mui/material";
import { useFormik } from "formik";
import { getCity, getCourt, getState } from "@/Apis/information";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OtpF from "./OtpF";
import { completeEnquiry, createEnquiry } from "app/Apis/Enquiry";
import Cookies from "js-cookie";
// import AddDocuments from "app/Components/Documents/AddDocuments/AddDocuments";
import { defaultAccessToken } from "app/redux/actions/OnboardingInputs";
import { getEnquiryDetailsById } from "app/Apis/Enquiry";

const enquiryArray = [
  "Expert_Case_Review",
  "Anticipatory_Bail_Application",
  "Regular_Bail_Application",
];
const courtArray = [
  "District_Court",
  "Special_Court",
  "High Court",
  "Supreme_Court",
];
const caseArray = ["Civil_Case", "Criminal_Case"];

const steps = [
  {
    label: "Enquiry Detail",
  },
  {
    label: "Case Related Information",
  },
  {
    label: "Personal Information",
  },
];
const stepsForLogin = [
  {
    label: "Enquiry Detail",
  },
  {
    label: "Case Related Information",
  },
];

const VerticalLinearStepper = ({ disableSmLogin, editNumber }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  // if(!accessToken){
  //   const accessToken = useSelector((state) => state?.onboardingInputs?.accessToken);
  // }

  //error
  const [practiceCourtError, setPracticeCourtError] = useState(false);
  const [FirError, setFirError] = useState(false);
  const [policeStationNameError, setPoliceStationNameError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [enquiryError, setEnquiryError] = useState(false);
  const [caseTypeError, setCaseTypeError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [cityError, setCityError] = useState(false);

  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const id = useSelector((state) => state?.onboardingInputs?.userId);
  const [userId, setUserId] = useState(id);
  const [enquiryBody, setEnquiryBody] = useState(null);
  const dispatch = useDispatch();
  const getPaymentStatus = async () => {
    const response = await getEnquiryDetailsById(enquiryBody?.enquiryId);
    console.log(response);
    if (response) {
      if (response?.data?.payment?.order_status === "Success") {
        setIsPaymentDone(true);
      } else {
        navigate("/clients");
      }
    }
  };
  useEffect(() => {
    const checkForAccesstoken = async () => {
      const response = await getUserProfile(accessTokenFromParam);
      if (response?.status === 200) {
        setAccessToken(accessTokenFromParam);
        Cookies.set("accessToken", accessTokenFromParam,{domain:".easedraft.com"});
        dispatch(defaultAccessToken(accessTokenFromParam));
        setUserId(response.data.data.id);
      } else {
        setAccessToken(null);
      }
    };
    if (accessTokenFromParam) {
      checkForAccesstoken();
    }
  }, []);

  const handleNext = async () => {
    console.log("activeStep:", activeStep);
    console.log("enquiry:", enquiry);
    console.log("FIRNumber:", FIRNumber);
    console.log("PoliceStationName:", PoliceStationName);
    console.log("caseType:", caseType);
    console.log("courtSelection:", courtSelection);

    if (activeStep === 0) {
      if (enquiry && Object.keys(enquiry).length > 0) {
        setEnquiryError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setEnquiryError(true);
      }
    }
    if (activeStep === 1) {
      const validateForm = () => {
        let isValid = true;
        if (!caseType || Object.keys(caseType).length === 0) {
          setCaseTypeError(true);
          isValid = false;
        } else {
          setCaseTypeError(false);
        }
        if (!courtSelection || Object.keys(courtSelection).length === 0) {
          setPracticeCourtError(true);
          isValid = false;
        } else {
          setPracticeCourtError(false);
        }
        if (!FIRNumber || FIRNumber.length === 0) {
          setFirError(true);
          isValid = false;
        } else {
          setFirError(false);
        }
        if (!PoliceStationName || PoliceStationName.length === 0) {
          setPoliceStationNameError(true);
          isValid = false;
        } else {
          setPoliceStationNameError(false);
        }
        if (!states || Object.keys(states).length === 0) {
          setStateError(true);
          isValid = false;
        } else {
          setStateError(false);
        }

        if (!city || Object.keys(city).length === 0) {
          setCityError(true);
          isValid = false;
        } else {
          setCityError(false);
        }
        return isValid;
      };

      if (validateForm()) {
        console.log("Previous active step:", activeStep);
        console.log(city,states)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (!accessToken) {
          const response = await createEnquiry({
            enquiryTypes: enquiryArray[enquiry?.enquiryId],
            caseType: caseArray[caseType?.caseId],
            firComplaintNo: FIRNumber,
            policeStationName: PoliceStationName,
            district: {"districtId" : city?.districtId},
            state: {"stateId": states?.stateId},
            // documentLists: documentsAPIList,
            courtName: courtArray[courtSelection?.courtId],

            // user: {
            //   id: userId,
            // },
          });
          if (response) {
            console.log(response?.data?.data?.enquiryId);
            setEnquiryId(response?.data?.data?.enquiryId);
            setEnquiryBody(response?.data?.data);
          }
        } else {
          const response = await completeEnquiry({
            enquiryTypes: enquiryArray[enquiry?.enquiryId],
            caseType: caseArray[caseType?.caseId],
            firComplaintNo: FIRNumber,
            policeStationName: PoliceStationName,
            documentLists: documentsAPIList,
            courtName: courtArray[courtSelection?.courtId],
            district: {"districtId" : city?.districtId},
            state: {"stateId": states?.stateId},
            user: {
              id: userId,
            },
          });
          if (response) {
            console.log(response);
            setEnquiryId(response?.data?.data?.enquiryId);
            console.log(enquiryBody);
            // setEnquiryBody(response?.data?.data);
            let popUpWindow = null;
            const posX = window.screen.width / 3;
            const posY = window.screen.height / 2;
            const width = 500;
            const height = 680;
            const popUpPosition = `height=${height},width=${width},left=${posX},top=${posY}`;
            popUpWindow = window.open(
              `https://api.easedraft.com/payment/initiate?order_id=${response?.order_id}&retry=1&platform=cloud`,
              "popup",
              popUpPosition
            );
            const checkClosed = setInterval(() => {
              if (popUpWindow.location.href) {
                // consol
                console.log(popUpWindow.location.href);
              }
              if (popUpWindow.closed) {
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
        }
      }
    }
    if (activeStep === 3) {
      console.log(enquiryBody, enquiryId);
      const response = await completeEnquiry({
        ...enquiryBody,
        user: {
          id: userId,
        },
        enquiryId: enquiryId,
        documentLists: documentsAPIList,
      });
      console.log(response);
      if (response) {
        navigate("/clients");
      }
    }
    if (activeStep === 2) {
      const validateForm = () => {
        let isValid = true;

        if (!FullName || FullName.length === 0) {
          setFullNameError(true);
          isValid = false;
        } else {
          setFullNameError(false);
        }

        return isValid;
      };
      if (!isPaymentDone) {
        if (validateForm()) {
          console.log("Previous active step:", activeStep);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          console.log(enquiryBody, enquiryId);
          if (!isPaymentDone) {
            const response = await completeEnquiry({
              ...enquiryBody,
              user: {
                id: userId,
              },
              enquiryId: enquiryId,
            });
            console.log(response);
            let popUpWindow = null;
            const posX = window.screen.width / 3;
            const posY = window.screen.height / 2;
            const width = 500;
            const height = 680;
            const popUpPosition = `height=${height},width=${width},left=${posX},top=${posY}`;
            popUpWindow = window.open(
              `https://api.easedraft.com/payment/initiate?order_id=${response?.order_id}&retry=1&platform=cloud`,
              "popup",
              popUpPosition
            );
            const checkClosed = setInterval(() => {
              if (popUpWindow.closed) {
                clearInterval(checkClosed);
                getPaymentStatus();
                // setIsPaymentDone(true);
                // navigate("/clients/enquiry");
              }
            }, 1000);
          } else {
            navigate("/clients");
          }
        } else {
          setFullNameError(true);
          setStateError(true);
          setCityError(true);
        }
      } else {
        console.log(enquiryBody, enquiryId);
        const response = await completeEnquiry({
          ...enquiryBody,
          user: {
            id: userId,
          },
          enquiryId: enquiryId,
          documentLists: documentsAPIList,
        });
        console.log(response);
        if (response) {
          navigate("/clients");
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (hasDocuments === "No") {
      setHasDocuments(null);
    }
  };

  const handleReset = () => {
    console.log("reset");
    setActiveStep(0);
    setVerifiedOtp(false);
    setShowOtp(false);
    setFullName("");
    setPhoneNumber("");
    setFIRNumber("");
    setPoliceStationName("");
    setCaseType(null);
    setCourtSelection(null);
    setStates(null);
    setEnquiry(null);
    setCity(null);
    setHasDocuments(false);
    setDocumentsAPIList(null);
    setDocumentsArray(null);
  };

  const [FIRNumber, setFIRNumber] = useState();
  const [PoliceStationName, setPoliceStationName] = useState();
  const [caseTypes, setCaseTypes] = useState([
    {
      caseId: "0",
      caseName: "Civil Case",
    },
    {
      caseId: "1",
      caseName: "Criminal Case",
    },
  ]);
  const [caseType, setCaseType] = useState(null);
  const [enquiry, setEnquiry] = useState(null);

  const [enquiryList, setEnquiryList] = useState([
    {
      enquiryId: "0",
      enquiryName: "Expert Case Review",
    },
    {
      enquiryId: "1",
      enquiryName: "Anticipatory Bail Application",
    },
    {
      enquiryId: "2",
      enquiryName: "Regular Bail Application",
    },
  ]);
  const [hasDocuments, setHasDocuments] = useState(null);
  const [documentsArray, setDocumentsArray] = React.useState(null);
  const [documentsAPIList, setDocumentsAPIList] = React.useState(null);

  const [courtSelection, setCourtSelection] = useState(null);
  const [courtOptions, setCourtOptions] = useState([
    {
      courtId: "0",
      courtName: "District Court",
    },
    {
      courtId: "1",
      courtName: "Special Court",
    },
    {
      courtId: "2",
      courtName: "High Court",
    },
    {
      courtId: "3",
      courtName: "Supreme Court",
    },
  ]);

  const [FullName, setFullName] = useState([]);
  const [otp, setOtp] = useState([]);
  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [State, setState] = useState([]);
  const [states, setStates] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const [error, setError] = useState("");

  const Incrementfn = async () => {
    let courtOptions = [];
    if (courtSelection.length === 0) {
      setError(true);
      setPracticeCourtError(true);
    } else {
      courtSelection.map((ele) => {
        courtOptions.push({
          courtsId: ele.courtSelectionId,
        });
      });
      console.log(courtOptions);
    }
  };

  const ValuesToReduxForCourt = () => {
    setPracticeCourtError(false);
    dispatchEvent(UserPracticeCourts(courtSelection));
  };

  const queryParameters = new URLSearchParams(location.search);
  const phoneUrl = queryParameters.get("phoneNumber");
  const handleChange = (event) => {
    const { value } = event.target;
    formik.setFieldValue("phoneNumber", value);

    setPhoneNumber(value);
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
      setError("Enter a valid Mobile Number");
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
        setError("Enter a valid Mobile Number");
      }
    }
    if (editNumber) {
      setPhoneNumber(editNumber);
    }
  }, [phoneUrl]);

  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await getLawyerState();
        if (!response) {
          console.log("No States Found");
        }
        response.shift();
        setState(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getStates();
  }, []);
  const [city, setCity] = useState(null);
  const [cityList, setCityList] = useState([]);
  useEffect(() => {
    const getCity = async () => {
      try {
        const response = await getCaseCity(states.stateId);
        if (!response) {
          console.log("No City Found");
        }
        setCityList(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getCity();
  }, [states]);

  const formik = useFormik({
    initialValues: {
      caseType: caseType || {},
      enquiry: [],
      PoliceStationName: PoliceStationName || "",
      FullName: FullName || "",
      phoneNumber: phoneNumber || "",
      states: states || [],
      city: city || [],
      FIRNumber: FIRNumber || "",
      // courtSelection: courtSelection || [],
    },
    validationSchema: EnquiryValidations,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values, "FORMIK");
      Incrementfn();
      handleNext();
    },
  });
  console.log(accessToken);
  const [stepsArray, setStepsArray] = useState(
    accessToken ? stepsForLogin : steps
  );
  useEffect(() => {
    if (isPaymentDone) {
      // debugger;
      if (accessToken) {
        setStepsArray([
          ...stepsForLogin,
          {
            label: "Documents",
          },
        ]);
      } else {
        setStepsArray([
          ...steps,
          {
            label: "Documents",
          },
        ]);
      }
    } else {
      accessToken ? setStepsArray(stepsForLogin) : setStepsArray(steps);
    }
  }, [isPaymentDone, accessToken]);
  // const handleArrayForSteps = ()=>{
  //   // console.log(accessToken);
  //   let temp = steps
  //   if(accessToken){
  //     temp = stepsForLogin
  //   }
  //   if(isPaymentDone){
  //     temp = accessToken ? [...stepsForLogin,{
  //       label: "Documents",
  //     }]: [...steps,{
  //       label: "Documents",
  //     }]
  //   }
  //   return temp;
  // }
  console.log(activeStep);
  return (
    <>
      <div
        sx={{
          flexDirection: "column",
          display: "flex",
          height: "85%",
          alignContent: "center",
        }}
      >
        {openSnackBar && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSnackBar}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            sx={{ zIndex: 1000, mt: 10 }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%", pr: 3, pl: 3, borderRadius: "10px" }}
            >
              <Typography variant="h6">Enquiry Added Successfully</Typography>
            </Alert>
          </Snackbar>
        )}
          <div sx={{ width: "100%" }}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              sx={{
                backgroundColor: "white",
                "& .MuiStepIcon-root": {
                  fontSize: "1rem",
                  width: "1.5rem",
                  height: "1.5rem",
                },
              }}
            >
              {stepsArray.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography
                      variant="p"
                      sx={{
                        margin: "0px 0px 16px",
                        lineHeight: "1.1rem",
                        color: "rgb(52, 67, 87)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        letterSpacing: "-0.01rem",
                        color: "#364a63",
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {index === 0 && (
                      <Typography sx={{}}>
                        <Autocomplete
                          style={{ width: "100%" }}
                          onChange={(event, value) => {
                            setEnquiry(value);
                            if (enquiryError) {
                              setEnquiryError(false);
                            }
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.enquiryId === value.enquiryId
                          }
                          value={enquiry}
                          options={enquiryList}
                          getOptionLabel={(option) => option.enquiryName}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>{option.enquiryName}</li>
                          )}
                          sx={{ width: 500 }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ mb: 0, mt: 2 }}
                              {...params}
                              label="Enquiry Type"
                              required
                              color="secondary"
                              placeholder="Enquiry Type"
                              error={enquiryError}
                              name={"enquiry"}
                              helperText={formik.errors.enquiry}
                            />
                          )}
                        />
                        {enquiryError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Select the Enquiry Type
                          </Typography>
                        )}
                      </Typography>
                    )}
                    {index === 1 && (
                      <Typography>
                        <Autocomplete
                          onChange={(event, value) => {
                            setCaseType(value);
                            if (caseTypeError) {
                              setCaseTypeError(false);
                            }
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.caseTypeId === value.caseTypeId
                          }
                          value={caseType}
                          style={{ width: "100%" }}
                          options={caseTypes}
                          getOptionLabel={(option) => option.caseName}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>{option.caseName}</li>
                          )}
                          sx={{ width: 500 }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ mb: 0, mt: 2 }}
                              {...params}
                              color="secondary"
                              label="Case Type*"
                              placeholder="Case Type*"
                              error={caseTypeError}
                              name="caseType"
                              helperText={formik.errors.caseType}
                            />
                          )}
                        />
                        {caseTypeError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Select the Case Type
                          </Typography>
                        )}

                        <TextField
                          sx={{ mb: 0, mt: 2, width: "100%" }}
                          id="outlined-basic"
                          label="FIR/Complaint Number"
                          required
                          color="secondary"
                          variant="outlined"
                          value={formik.values.FIRNumber}
                          onChange={(e) => {
                            setFIRNumber(e.target.value);
                            if (FirError) {
                              setFirError(false);
                            }
                          }}
                          error={FirError}
                          name="FIR/Complaint"
                          helperText={formik.errors.FIRNumber}
                        />
                        {FirError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Enter Fir Number
                          </Typography>
                        )}

                        <TextField
                          sx={{ mb: 0, mt: 2, width: "100%" }}
                          id="outlined-basic"
                          label="Police Station Name"
                          required
                          color="secondary"
                          variant="outlined"
                          value={formik.values.PoliceStationName}
                          onChange={(e) => {
                            setPoliceStationName(e.target.value);
                            if (policeStationNameError) {
                              setPoliceStationNameError(false);
                            }
                          }}
                          error={policeStationNameError}
                          name="Police Station Name"
                          helperText={formik.errors.PoliceStationName}
                        />
                        {policeStationNameError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Enter Police Station Name
                          </Typography>
                        )}
                        <Autocomplete
                          style={{ width: "100%" }}
                          options={State}
                          required
                          isOptionEqualToValue={(option, value) =>
                            option.stateId === value.stateId
                          }
                          value={states}
                          onChange={(event, value) => {
                            console.log(value)
                            setStates(value);
                            if (stateError) {
                              setStateError(false);
                            }
                          }}
                          getOptionLabel={(option) => {
                            return option.stateName;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ mb: 2, mt: 1 }}
                              color="secondary"
                              label="Select State*"
                              placeholder="Select State*"
                              autocomplete="off"
                              error={stateError}
                              // onBlur={() => {
                              //   if (!states || states.length === 0) {
                              //     setStateError(true);
                              //   }
                              // }}
                              helperText={
                                formik.touched.states && formik.errors.states
                              }
                            />
                          )}
                        />
                        {stateError && (
                          <Typography
                            sx={{
                              marginTop: "-1rem",
                              fontSize: "10px",
                              color: "#E73145",
                            }}
                          >
                            Please Select the State
                          </Typography>
                        )}

                        <Autocomplete
                          style={{ width: "100%" }}
                          options={cityList}
                          value={city}
                          onChange={(event, value) => {
                            setCity(value);
                            if (cityError) {
                              setCityError(false);
                            }
                          }}
                          getOptionLabel={(option) => {
                            return option.districtName;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ mb: 0, mt: 0 }}
                              color="secondary"
                              label="Select City"
                              autocomplete="off"
                              placeholder="Select City"
                              error={cityError}
                              helperText={
                                formik.touched.city && formik.errors.city
                              }
                            />
                          )}
                        />
                        {cityError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Select the city
                          </Typography>
                        )}
                        <div sx={{ mt: 0 }}>
                          <Autocomplete
                            style={{ width: "100%" }}
                            value={courtSelection}
                            onChange={(event, value) => {
                              setCourtSelection(value);
                              if (practiceCourtError) {
                                setPracticeCourtError(false);
                              }
                            }}
                            options={courtOptions}
                            getOptionLabel={(option) => option.courtName}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>{option.courtName}</li>
                            )}
                            sx={{ width: 500 }}
                            renderInput={(params) => (
                              <TextField
                                sx={{
                                  marginTop: "10px",
                                  backgroundColor: "white",
                                }}
                                {...params}
                                label="Court"
                                placeholder="Court"
                                color="secondary"
                                required
                                error={practiceCourtError}
                              />
                            )}
                          />
                          {practiceCourtError && (
                            <Typography
                              sx={{ fontSize: "10px", color: "#E73145" }}
                            >
                              Please Select the Court
                            </Typography>
                          )}
                        </div>
                      </Typography>
                    )}
                    {index === 2 && !accessToken && (
                      <Typography>
                        <TextField
                          sx={{ mb: 0, mt: 2, width: "100%" }}
                          id="outlined-basic"
                          label="Full Name"
                          required
                          color="secondary"
                          variant="outlined"
                          value={FullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (fullNameError) {
                              setFullNameError(false);
                            }
                          }}
                          error={fullNameError}
                          name="FIR/Complaint"
                          helperText={formik.errors.FullName}
                        />
                        {fullNameError && (
                          <Typography
                            sx={{ fontSize: "10px", color: "#E73145" }}
                          >
                            Please Enter Your Full Name
                          </Typography>
                        )}

                        {verifiedOtp ? (
                          <TextField
                            sx={{ mb: 0, mt: 2, width: "100%" }}
                            id="outlined-basic"
                            disabled={true}
                            required
                            color="secondary"
                            value={phoneNumber}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <SvgIcon
                                    component={CheckCircleIcon}
                                    color="secondary"
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        ) : showOtp ? (
                          <OtpF
                            phoneNumber={phoneNumber ? phoneNumber : phoneUrl}
                            disableSmLogin={disableSmLogin}
                            verifiedOtp={verifiedOtp}
                            setVerifiedOtp={setVerifiedOtp}
                            setUserId={setUserId}
                          />
                        ) : (
                          <div
                            sx={{
                              backgroundColor: "#FFFFFF",
                              margin: 0,
                              display: "flex",
                              flex: "1 ",
                              minWidth: 0,
                              flexDirection: { xs: "column", md: "row" },
                              height: "100%",
                              borderRadius: "0",
                            }}
                          >
                            <div
                              sx={{
                                flex: 1,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                sx={{
                                  flex: "1",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  flexDirection: "column",
                                  my: "1rem",
                                  marginLeft: "auto",
                                  marginBottom: "1rem",
                                  marginRight: isBelow990px ? "auto" : "15%",
                                  width: "100%",
                                  alignContent: "center",
                                }}
                              >
                                <form
                                  onSubmit={handleSubmit}
                                  autoComplete="off"
                                >
                                  <div
                                    sx={{
                                      mb: 2,
                                      color: "#3c4d62",
                                      fontWeight: "400",
                                    }}
                                  >
                                    <label>
                                      <TextField
                                        fullWidth
                                        placeholder="Mobile Number"
                                        id="Mobile Number"
                                        label="Mobile Number"
                                        type="tel"
                                        color="secondary"
                                        onChange={handleChange}
                                        value={formik.values.phoneNumber}
                                        error={
                                          formik.errors.phoneNumber &&
                                          formik.touched.phoneNumber
                                        }
                                        inputProps={{
                                          maxLength: 10,
                                        }}
                                        required
                                      />
                                    </label>
                                    {error && (
                                      <div
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <ErrorOutlineIcon
                                          color="error"
                                          fontSize="small"
                                        />
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

                                  <LoadingButton
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
                                  >
                                    Get OTP
                                  </LoadingButton>
                                </form>
                              </div>
                            </div>
                          </div>
                        )}
                      </Typography>
                    )}
                    {isPaymentDone && (
                      // (enquiry?.enquiryId === "1" ||
                      //       enquiry?.enquiryId === "2") &&
                      <div sx={{ mb: 0, mt: 2 }}>
                        <Typography variant="h6">
                          Do you have any related documents?
                        </Typography>
                        <FormControl
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                          }}
                        >
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="priority"
                            defaultValue={"No"}
                            // value={hasDocuments ?? false}
                            onChange={(e, value) => {
                              console.log(e.target.value);
                              setHasDocuments(value);
                            }}
                          >
                            <FormControlLabel
                              value={"Yes"}
                              control={<Radio color="secondary" />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={"No"}
                              control={<Radio color="secondary" />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                        {/* {hasDocuments === "Yes" && (
                          <AddDocuments
                            documentsArray={documentsArray}
                            setDocumentsArray={setDocumentsArray}
                            documentsAPIList={documentsAPIList}
                            setDocumentsAPIList={setDocumentsAPIList}
                            type={"tasks"}
                            fromEnquiry={true}
                          />
                        )} */}
                      </div>
                    )}
                    <div sx={{ mb: 0 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          disabled={
                            !verifiedOtp &&
                            index === steps.length - 1 &&
                            !isPaymentDone
                          }
                          sx={{ mt: 1, mr: 1, backgroundColor: "#f1c40f" }}
                        >
                          {index === steps.length - 1 || isPaymentDone
                            ? "Finish"
                            : "Continue"}
                        </Button>
                        <LoadingButton
                          disabled={index === 0 || isPaymentDone}
                          variant="contained"
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </LoadingButton>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {/* {activeStep === handleArrayForSteps().length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <LoadingButton onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </LoadingButton>
              </Paper>
            )} */}
          </div>
      </div>
    </>
  );
};

export default VerticalLinearStepper;
