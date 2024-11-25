import {
  Alert,
  Collapse,
  IconButton,
  Paper,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { createRentalAgreement, getRentalAgreementById } from "@/Apis/legalAgreement";
import Cookies from "js-cookie";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";
import PaymentCard from "../Rental/PaymentCard";
import Step1 from "./steps/step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";



const GeneralStepper = ({
  agreementResponse,
  setAgreementResponse,
  documentsArray,
setDocumentsArray,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [restored , setIsRestored] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [isPayment, setIsPayment] = useState(false);
  const router = useRouter()
  const draftId = router?.query?.id


  const handleRestore = () => {
    const localAgreementId = localStorage.getItem("agreementId")
    if(localAgreementId && !restored){
      const getRentalById = async (accessToken,id) =>{
        const res = await getRentalAgreementById(accessToken,id)
        console.log(res) 
        setAgreementResponse(res)
      }
      const accessToken = Cookies.get("accessToken")
      getRentalById(accessToken,localAgreementId)
      setOpen(false)
      setIsRestored(true)
    }
  }  

  useEffect(() => {
    if(activeStep === 0){
      if(!agreementResponse?._id){
        const localAgreementId = localStorage.getItem("agreementId")
        console.log(agreementResponse?._id)
        if(localAgreementId && !restored){
          setOpen(true)
        }
      }
    } else {
     localStorage.setItem("agreementId", agreementResponse?._id) 
     setOpen(false)
    }  
    // console.log(localStorage.getItem("agreementId"));
  }, [agreementResponse?._id])
  
  const isCompleted = () => {
    let bool = true;
    completed.forEach((item) => {
      if (!item) {
        bool = false;
      }
    });
    return bool;
  };

  const [completed, setCompleted] = useState([
    false,
    false,
    false,
    false,
  ]);
  useEffect(()=>{
    const localAgreementId = localStorage.getItem("agreementId")
    if(draftId){
      console.log(Boolean(draftId))
      const accessToken = Cookies.get("accessToken")
      const getRentalById = async (accessToken,id) =>{
        const res = await getRentalAgreementById(accessToken,id)
        console.log(res)
        if(res){
          setAgreementResponse(res)
          setOpen(false)
        } 
      }
      getRentalById(accessToken,draftId)
    }
  },[draftId])


  const handleStep = (index) => {
    if (agreementResponse?.user) {
      setActiveStep(index);
    }
  };
  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prev) => prev + 1);
    }
    if (activeStep === 4) {
      setIsPayment(true);
    }
  };
  const handleBack = () => {
    if (activeStep === 0) {
      setActiveStep(0);
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const steps = [
    {
      label: "Help us know you better",
      component: (
        <Step1
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          setCompleted={setCompleted}
        />
      ),
    },
    {
      label: "Agreement Details",
      component: (
        <Step2
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
          documentsArray={documentsArray}
          setDocumentsArray={setDocumentsArray}
        />
      ),
    },
    {
      label: "Party 1 Details",
      component: (
        <Step3
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
        />
      ),
    },
    {
      label: "Party 2 Details",
      component: (
        <Step4
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
        />
      ),
    },
  ];

  return (
    <div
    // className="container"
    >
      <Collapse in={open}>
        <Alert
        severity="info"
          action={
            <div className="flex justify-start items-center">
            <Button size="sm" radius="sm" variant="bordered" onClick={handleRestore}>
              Restore
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                setIsRestored(true)
              }}
            >
              <CloseIcon fontSize="inherit" /> 
            </IconButton>
            </div>
          }
          sx={{ mb: 2 }}
        >
          Do you want to restore previously incomplete agreement draft?
        </Alert>
      </Collapse>
      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          "& MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
            color: "#eabf4e",
          },
        }}
      >
        {steps.map((step, index) => {
          // console.log(step);
          return (
            <Step key={step.label} completed={completed[index]}>
              <StepButton color="#eabf4e" onClick={() => handleStep(index)}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "rgb(31,41,55)",
                  }}
                >
                  {step.label}
                </Typography>
              </StepButton>
              <StepContent>{step.component}</StepContent>
            </Step>
          );
        })}
      </Stepper>
      {isCompleted() && !isPayment && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed.</Typography>
          <PaymentCard
            agreementResponse={agreementResponse}
            setAgreementResponse={setAgreementResponse}
            handleNext={handleNext}
            type ={"legal"}
          />
        </Paper>
      )}
    </div>
  );
};

export default GeneralStepper;
