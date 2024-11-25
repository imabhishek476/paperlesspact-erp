import {
  Autocomplete,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import RoofingIcon from "@mui/icons-material/Roofing";
import HailIcon from "@mui/icons-material/Hail";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import {
  createAgreementDocument,
  createGeneralAgreement,
  createRentalAgreement,
} from "@/Apis/legalAgreement";
import Cookies from "js-cookie";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditNoteIcon from "@mui/icons-material/EditNote";
import * as Yup from "yup";

import { useRouter } from "next/router";
import AddDocuments from "@/components/DocumentComponents/AddDocs/addDocuments";
import AddAgreementDocuments from "@/components/DocumentComponents/AddDocs/AddAgreementDocuments/AddAgreementDocuments";

const validation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  type:Yup.string().required("Type is required").nullable(),
  agreements:Yup.array().nullable(),
});

const Step2 = ({
  agreementResponse,
  setAgreementResponse,
  handleNext,
  setCompleted,
  documentsArray,
  setDocumentsArray,
}) => {
  const [otpStatus, setOtpStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [UserTypeError, setUserTypeError] = useState("");
  const [draftType, setDraftType] = useState("");
  const [initialValues, setInitialValues] = useState({
    // stamp: agreementResponse ? agreementResponse?.stampAmount : "",
    type: agreementResponse ? agreementResponse?.type : "Legal Agreement",
    title: agreementResponse ? agreementResponse?.agreementTitle : "",
    agreements: agreementResponse?.agreements && agreementResponse?.agreements.length>0 ? agreementResponse?.agreements : [
      {
        name:"",
        stampAmount:"0",
        document:null,
        stampFile:null
      }
    ],
    
  });
  const router = useRouter();

  const onSubmitHandler = async (values, actions) => {
    console.log(values?.type);
    if (!values.type) {
      setUserTypeError("Choose a type");
    } else {
      setUserTypeError("");
      setIsLoading(true);
      console.log(values);
      let documentsIndex=[];
      for(const document of values.agreements){
        // const blobUrl = document?.document?.files[0];
        // console.log(blobUrl)
        try{
          const response  = await createAgreementDocument(document);
          console.log(response);
          if(response){
            documentsIndex.push(response?._id);
          }
        }catch(err){
          console.log(err);
        }
      }
      if(documentsIndex?.length > 0){
        let data = {
          agreementId: agreementResponse?._id,
          title: values?.title,
          agreementUrls: documentsIndex,
        };
        if(draftType){
          data = {
            ...data,
            agreementType:draftType
          }
        }
        console.log(data);
        const res = await createGeneralAgreement(data, "1");
        console.log(res);
        if (res&&res.length>0) {
          setAgreementResponse(res[0]);
          setCompleted((prev) => {
            let temp = prev;
            temp[1] = true;
            console.log(temp);
            return temp;
          });
          setIsLoading(false);
          console.log(draftType)
          if(draftType==="Rental Agreement"){
            router.push(`/legalagreement/rental/add?id=${agreementResponse?._id}`);
          }
          handleNext();
        }
      }
      // console.log(documentsIndex);
    }
  };
  const errorCheck = (userType) => {
    if (!userType) {
      setUserTypeError("Choose a Role");
    }
  };

  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Enter Agreement Details
      </p>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
        validationSchema={validation}
        enableReinitialize
      >
        {({
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          setFieldError,
          errors,
          touched,
        }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Agreement Title"
              required
              color="secondary"
              value={values.title}
              onChange={handleChange}
              error={errors.title && touched.title}
              onBlur={handleBlur}
              name="title"
              helperText={errors.title && touched.title ? errors.title : ""}
            />

            {/* <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Stamp"
              color="secondary"
              required
              value={values.stamp}
              onChange={handleChange}
              error={touched.stamp && errors.stamp}
              onBlur={handleBlur}
              name="stamp"
              helperText={errors.stamp && touched.stamp ? errors.stamp : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            /> */}
            <div className="mt-5">
              <p className="mb-3">Agreement type</p>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer hover:border-[#fda178]/60 ${
                      values.type === "draft"
                        ? "bg-[#f2f3f8] border-[#fda178] text-[#fda178]"
                        : ""
                    }`}
                    onClick={() => setFieldValue("type", "draft")}
                  >
                    <EditNoteIcon
                      style={{
                        fontSize: "16px",
                        // color: "rgba(156, 163, 175,1)",
                      }}
                      className={`${
                        values.userType === "draft"
                          ? "fill-[#fda178]"
                          : "text-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Draft</p>
                  </div>
                </div>
                <div className="col-span-3 flex flex-wrap gap-3 ">
                  <div
                    className={`flex justify-center items-center border border-gray-200 rounded-[10px] h-[45px] w-full gap-[2px] hover:cursor-pointer hover:border-[#fda178]/60 ${
                      values.type === "Legal Agreement"
                        ? "bg-[#f2f3f8] border-[#fda178] text-[#fda178]"
                        : ""
                    }`}
                    onClick={() => setFieldValue("type", "Legal Agreement")}
                  >
                    <FileUploadIcon
                      style={{
                        fontSize: "16px",
                        // color: "rgba(156, 163, 175,1)",
                      }}
                      className={`${
                        values.type === "Legal Agreement"
                          ? "fill-[#fda178]"
                          : "text-[rgba(156, 163, 175,1)]"
                      }`}
                    />
                    <p style={{ fontSize: "12px" }}>Upload</p>
                  </div>
                </div>
              </div>
              {UserTypeError && (
                <div>
                  <span className="text-[#d32f2f] text-[0.75rem]">
                    {UserTypeError}
                  </span>
                </div>
              )}
            </div>
            {values.type === "Legal Agreement" && (
              <div className="mt-5">
                <p className="mb-3">Upload Documents</p>
                {/* <AddDocuments
                  documentsArray={documentsArray}
                  setDocumentsArray={setDocumentsArray}
                  accept={"application/pdf"}
                  multiple={false}
                /> */}
                <AddAgreementDocuments 
                values={values}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
                />
              </div>
            )} 
            {values.type === "draft" && (
              <div className="flex flex-col gap-3">
                <RadioGroup
                  label="Select  draft"
                  value={draftType}
                  onValueChange={setDraftType}
                  className="mt-5"
                >
                  <Radio value="Rental Agreement" color="default">Rental Agreement</Radio>
                  <Radio value="Commercial Agreement" color="default">Commercial Agreement</Radio>
                  <Radio value="Employment Agreement" color="default">Employment Agreement</Radio>
                </RadioGroup>
              </div>
            )}
            <div className="flex justify-start md:justify-end pt-10 pb-3">
              <Button
                type="submit"
                size="md"
                radius="sm"
                className="bg-[#fda178] hover:bg-[#05686E] hover:text-[white]"
                onClick={(e) => {
                  errorCheck(values?.type);
                  handleSubmit(e);
                }}
                isLoading={isLoading}
              >
                Save & Continue
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step2;


