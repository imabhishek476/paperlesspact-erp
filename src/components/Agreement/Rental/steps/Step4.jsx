import { getCity, getState } from "@/Apis/information";
import { createRentalAgreement } from "@/Apis/legalAgreement";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const validation = Yup.object().shape({
  stateSelection: Yup.object().required("State is required"),
  citySelection: Yup.object().required("City is required"),
  address: Yup.string().required("Address is required").nullable(),
  pinCode: Yup.string().required("Pincode is required").nullable(),
});

const Step4 = ({
  agreementResponse,
  setAgreementResponse,
  handleNext,
  handleBack,
  setCompleted,
  setPreviewData,
}) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (values, actions) => {
    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    console.log(values);
    if (!accessToken) {
      return;
    }
    const data = {
      rentalId: agreementResponse?._id,
      propertyDetails: {
        city: values?.citySelection?.districtId || values?.citySelection?._id ,
        state: values?.stateSelection?.stateId || values?.stateSelection?._id,
        address: values.address,
        pincode: values.pinCode,
      },
    };
    const res = await createRentalAgreement(accessToken, data, "3");
    if(res){
      setAgreementResponse(res);
      console.log(res);
      setPreviewData((prev) => {
        const temp = {
          ...prev,
          city: res?.propertyDetails?.city?.districtName,
          fullPropertyAddress: res?.propertyDetails?.address,
        };
        return temp;
      });
      setCompleted((prev) => {
        let temp = prev;
        temp[3] = true;
        console.log(temp);
        return temp;
      });
      setIsLoading(false);
      handleNext();
    }
  };
  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await getState();
        if (!response) {
          console.log("No States Found");
        }
        response.shift();
        setStateOptions(response);
      } catch (error) {
        console.log(error);
      }
    };
    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      if (selectedState) {
        try {
          const response = await getCity(selectedState.stateId);
          if (!response) {
            console.log("No City Found");
          }
          setCityOptions(response);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getCities();
  }, [selectedState]);
  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Property Details
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Fill in details of the property being rented.
      </p>
      <Formik
        initialValues={{
          stateSelection: agreementResponse?.propertyDetails
            ? agreementResponse?.propertyDetails?.state
            : null,
          citySelection: agreementResponse?.propertyDetails
            ? agreementResponse?.propertyDetails?.city
            : null,
          address: agreementResponse?.propertyDetails
            ? agreementResponse?.propertyDetails?.address
            : "",
          pinCode: agreementResponse?.propertyDetails
            ? agreementResponse?.propertyDetails?.pincode
            : "",
        }}
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
          errors,
          touched,
        }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <Autocomplete
              style={{ width: "100%" }}
              options={stateOptions}
              isOptionEqualToValue={(option, value) =>
                option.stateId === value.stateId
              }
              value={values.stateSelection}
              onChange={(e, value) => {
                setSelectedState(value);
                setFieldValue("stateSelection", value);
              }}
              getOptionLabel={(option) => {
                return option.stateName;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ mt: 2 }}
                  color="secondary"
                  label="Select State"
                  placeholder="Select State"
                  name="stateSelection"
                  required
                  onBlur={handleBlur}
                  error={errors.stateSelection && touched.stateSelection}
                  helperText={
                    errors.stateSelection && touched.stateSelection
                      ? errors.stateSelection
                      : ""
                  }
                />
              )}
            />
            <Autocomplete
              style={{ width: "100%" }}
              options={cityOptions}
              required
              isOptionEqualToValue={(option, value) =>
                option.districtId === value.districtId
              }
              disabled={!selectedState}
              value={values.citySelection}
              onChange={(e, value) => {
                setFieldValue("citySelection", value);
              }}
              getOptionLabel={(option) => {
                return option.districtName;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ mt: 2 }}
                  color="secondary"
                  disabled={!selectedState}
                  label="Select City"
                  placeholder="Select City"
                  name="citySelection"
                  required
                  onBlur={handleBlur}
                  error={errors.citySelection && touched.citySelection}
                  helperText={
                    errors.citySelection && touched.citySelection
                      ? errors.citySelection
                      : ""
                  }
                />
              )}
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Pin Code"
              required
              color="secondary"
              value={values.pinCode}
              onChange={handleChange}
              onBlur={handleBlur}
              name="pinCode"
              error={errors.pinCode && touched.pinCode}
              helperText={
                errors.pinCode && touched.pinCode ? errors.pinCode : ""
              }
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="House & street Address"
              placeholder="Enter full address of property"
              required
              color="secondary"
              value={values.address}
              onChange={handleChange}
              error={errors.address && touched.address}
              onBlur={handleBlur}
              name="address"
              helperText={
                errors.address && touched.address ? errors.address : ""
              }
            />
            <div className="flex justify-start md:justify-end pt-10 pb-3 gap-3">
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
                onClick={handleSubmit}
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

export default Step4;
