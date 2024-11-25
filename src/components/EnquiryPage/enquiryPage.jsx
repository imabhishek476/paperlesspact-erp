import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import {
  Box,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Button } from "@nextui-org/react";


const EnquiryPage = ({ services, enquiryQuery }) => {
  const [enquiryInitialState, setEnquiryInitialState] = useState({});
  const [enquiryId, setEnquiryId] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const steps = [
    {
      label: "Enquiry Details",
      component: (
        <Step1
          services={services}
          handleNext={handleNext}
          handleBack={handleBack}
          enquiryInitialState={enquiryInitialState}
          setEnquiryInitialState={setEnquiryInitialState}
          enquiryId={enquiryId}
          setEnquiryId={setEnquiryId}
        />
      ),
    },
    {
      label: "Personal Information",
      component: <Step2 handleNext={handleNext}  handleBack={handleBack} enquiryId={enquiryId}/>,
    },
  ];
  return (
    <>
      <div className="container ">
        <div className="flex justify-center py-12 md:py-24">
          <Box sx={{ minWidth:{md:"40vw"} }}>
            <Stepper activeStep={activeStep} orientation="vertical"  sx={{
                "& .MuiStepIcon-root": {
                  color:"#000!important",
                },
              }} >
              {steps.map((step, index) => (
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
                      }}
                    >
                      {step.label}
                  </Typography>
                  </StepLabel>
                  <StepContent>
                    {step.component}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export default EnquiryPage;
