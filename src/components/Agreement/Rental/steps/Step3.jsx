import { createRentalAgreement } from "@/Apis/legalAgreement";
import { getCity, getState } from "@/Apis/information";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import { FieldArray, Form, Formik } from "formik";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import InputAccordian from "./InputAccordian";

const Step3 = ({
  agreementResponse,
  setAgreementResponse,
  handleNext,
  handleBack,
  setCompleted,
  setPreviewData,
}) => {
  const validation = Yup.object().shape({
    tenants: Yup.array()
      .of(
        Yup.object().shape({
          fullname: Yup.string().required("Fullname is required"), // these constraints take precedence
          phone: Yup.string()
            .min(10, "Phone Number Must be of 10 digits")
            .max(10, "Phone Number Must be of 10 digits")
            .required("Phone number is required")
            .matches(
              /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
              "Enter Valid Phone Number"
            )
            .test(
              "same phone number test",
              "Phone number of Owner and Tenant can't be same",
              function (value) {
                let check = false;
                if (agreementResponse?.tenantDetails) {
                  check = agreementResponse?.tenantDetails?.some((tenant) => {
                    return tenant?.phone === value;
                  });
                } else {
                  check = true;
                }
                return check;
              }
            ), // these constraints take precedence
          email: Yup.string().email("Enter correct email"),
          address: Yup.string().required("Address is required"), // these constraints take precedence
          aadhar: Yup.string()
            .matches(/^\d+$/, "Aadhar number can only contain numbers")
            .min(12, "Aadhar Number Must be of 12 digits")
            .max(12, "Aadhar Number Must be of 12 digits")
            .required("Aadhar number is required"), // these constraints take precedence
          // salary: Yup.string().min(3, 'cmon').required('Required'), // these constraints take precedence
        })
      )
      // .required('Must have friends') // these constraints are shown if and only if inner constraints are satisfied
      .min(1, "Minimum of 1 owner"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    tenants: agreementResponse?.tenantDetails
      ? agreementResponse?.tenantDetails
      : [
          {
            fullname:
              agreementResponse?.user?.userType === "Tenant"
                ? agreementResponse?.user?.fullname
                : null,
            phone:
              agreementResponse?.user?.userType === "Tenant"
                ? agreementResponse?.user?.phone
                : null,
            address: null,
            aadhar: null,
            isSigned: "0",
          },
        ],
  });

  const onSubmitHandler = async (values, actions) => {
    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    console.log(agreementResponse._id);
    if (!accessToken) {
      return;
    }
    const data = {
      rentalId: agreementResponse._id,
      // tenantDetails: {
      //   fullname: values.fullName,
      //   phone: values.phoneNumber,
      //   address: values.address,
      // },
      tenantDetails: values.tenants,
    };
    const res = await createRentalAgreement(accessToken, data, "1");
    if (res) {
      setAgreementResponse(res);
      console.log(res);
      setCompleted((prev) => {
        let temp = prev;
        temp[2] = true;
        console.log(temp);
        return temp;
      });
      handleNext();
      setIsLoading(false);
    }
    // }
  };

  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Who is renting the property?
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Fill in details of the tenant/lesser/renter.
      </p>
      <div className="w-full">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmitHandler}
          validationSchema={validation}
          // enableReinitialize
        >
          {(formikProps) => (
            <Form
              noValidate
              // autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                formikProps.handleSubmit(e);
              }}
            >
              <FieldArray
                name="tenants"
                render={(arrayHelpers) => {
                  return (
                    <div>
                      {formikProps.values.tenants.map((tenant, index) => (
                        <InputAccordian
                          user={tenant}
                          name={"tenant"}
                          key={index}
                          index={index}
                          arrayHelpers={arrayHelpers}
                          formikProps={formikProps}
                        />
                      ))}
                      <div className="flex justify-end pt-4 pb-2">
                        <Button
                          type="button"
                          size="md"
                          radius="sm"
                          className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                          onClick={() =>
                            arrayHelpers.push({
                              fullname: null,
                              phone: null,
                              address: null,
                              aadhar: null,
                              isSigned: "0",
                            })
                          }
                          isLoading={isLoading}
                        >
                          Add Tenant
                        </Button>
                      </div>
                    </div>
                  );
                }}
              />
              <div className="flex justify-start md:justify-end pt-10 pb-3 gap-3">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    size="md"
                    radius="sm"
                    className="bg-black text-[white] hover:bg-logo-golden hover:text-black"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="md"
                    radius="sm"
                    className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                    // onClick={()=>{console.log(formikProps.touched);console.log(formikProps.values)}}
                    isLoading={isLoading}
                  >
                    Save & Continue
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Step3;
