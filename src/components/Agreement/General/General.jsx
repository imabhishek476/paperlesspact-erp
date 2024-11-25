import { Typography } from "@mui/material";
import React, { useState } from "react";
import GeneralStepper from "./Stepper";
import AgreementPreview from "../Rental/AgreementPreview";
import Preview from "./Preview";
import { Button } from "@nextui-org/react";
import PreviewPopover from "./PreviewPopover";


const GeneralAgreementPage = () => {
  const [agreementResponse, setAgreementResponse] = useState(null);
    const [documentsArray,setDocumentsArray] = useState([]);

  return (
    <section className="w-full">
      <div className="px-4 md:px-[40px] mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
        <Typography
          sx={{ fontSize: {xs:"18px",md:"24px"}, fontWeight: 700, py:{xs:3,sm:2}, color: "#05686E" }}
        >
          Legal Agreement
        </Typography>
        <PreviewPopover agreementResponse={agreementResponse} documentsArray={agreementResponse?.agreements} type={false}/>
        </div>
        <div className="grid grid-cols-10">
          <div className="col-span-12 lg:col-span-5">

            <GeneralStepper
              agreementResponse={agreementResponse}
              setAgreementResponse={setAgreementResponse}
              documentsArray={documentsArray}
              setDocumentsArray={setDocumentsArray}
            />

          </div>
          <div className="hidden  lg:block lg:col-span-5">
            <Preview  agreementResponse={agreementResponse} documentsArray={agreementResponse?.agreements} type={false}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralAgreementPage;
