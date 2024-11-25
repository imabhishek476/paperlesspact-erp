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
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import { Button } from "@nextui-org/react";
import { createRentalAgreement, getRentalAgreementById } from "@/Apis/legalAgreement";
import Cookies from "js-cookie";
import PaymentCard from "./PaymentCard";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";


const RentalStepper = ({
  agreementResponse,
  setAgreementResponse,
  setPreviewData,
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
    console.log(localStorage.getItem("agreementId"))
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
    if (activeStep === 6) {
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
          handleBack={handleBack}
          setCompleted={setCompleted}
        />
      ),
    },
    {
      label: "Owner Details",
      component: (
        <Step2
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
          setPreviewData={setPreviewData}
        />
      ),
    },
    {
      label: "Tenant Details",
      component: (
        <Step3
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
          setPreviewData={setPreviewData}
        />
      ),
    },
    {
      label: "Property Details",
      component: (
        <Step4
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          handleNext={handleNext}
          handleBack={handleBack}
          setCompleted={setCompleted}
          setPreviewData={setPreviewData}
        />
      ),
    },
    {
      label: "Agreement Terms",
      component: (
        <Step5
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          setCompleted={setCompleted}
          setPreviewData={setPreviewData}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      ),
    },
    {
      label: "Item List/Annexures",
      component: (
        <Step6
          agreementResponse={agreementResponse}
          setAgreementResponse={setAgreementResponse}
          setCompleted={setCompleted}
          setPreviewData={setPreviewData}
          handleNext={handleNext}
          handleBack={handleBack}
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
        //   alternativeLabel
      >
        {steps.map((step, index) => {
          console.log(step);
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
          />
        </Paper>
      )}
    </div>
  );
};

export default RentalStepper;
