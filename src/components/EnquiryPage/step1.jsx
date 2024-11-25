import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Button } from "@nextui-org/react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { getCity, getState } from "@/Apis/information";
import { createEnquiry } from "@/Apis/enquiry";

const caseTypes = [
  {
    caseId: "0",
    caseName: "Civil Case",
  },
  {
    caseId: "1",
    caseName: "Criminal Case",
  },
];

const courtOptions = [
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
];
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

const Step1 = ({
  services,
  handleNext,
  handleBack,
  enquiryInitialState,
  setEnquiryInitialState,
  setEnquiryId,
  enquiryId,
}) => {
  const router = useRouter();
  const initialEnq = services.find((obj) => {
    return obj.serviceName === router.query.enquiry;
  });
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

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
  const onSubmitHandler = async (values, actions) => {
    setEnquiryInitialState({ ...values });
    let payload
    payload = {
      enquiryTypes: enquiryArray[values.enquiry?.enquiryId],
      caseType: caseArray[values.caseType?.caseId],
      firComplaintNo: values.FIRNumber,
      policeStationName: values.PoliceStationName,
      district: { districtId: values.citySelection?.districtId },
      state: { stateId: values.stateSelection?.stateId },
      // documentLists: documentsAPIList,
      courtName: courtArray[values.courtSelection?.courtId],
      // user: {
      //   id: userId,
      // },
    };
    if(enquiryId){
      payload = {
        enquiryId:enquiryId,
        ...payload
      }
      console.log(payload)
    }
    const response = await createEnquiry(payload);
    if (response) {
      console.log(response)
      setEnquiryId(response?.data?.data?.enquiryId)
      console.log(response?.data?.data?.enquiryId)
      handleNext();
    }
  };

  return (
    <Formik
      initialValues={enquiryInitialState}
      onSubmit={onSubmitHandler}
      enableReinitialize
    >
      {({
        values,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
        errors,
      }) => (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <Autocomplete
            style={{ width: "100%" }}
            onChange={(e, value) => setFieldValue("enquiry", value)}
            onBlur={handleBlur}
            value={values.enquiry}
            // replace enquiry options when api is ready
            options={[
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
            ]}
            // getOptionLabel={(option) => option.serviceName}
            // renderOption={(props, option, { selected }) => (
            //   <li {...props}>{option.serviceName}</li>
            // )}
            // isOptionEqualToValue={(option, value) =>
            //   option.serviceTypeId === value.serviceTypeId
            // }
            getOptionLabel={(option) => option.enquiryName}
            renderOption={(props, option, { selected }) => (
              <li {...props}>{option.enquiryName}</li>
            )}
            isOptionEqualToValue={(option, value) =>
              option.enquiryId === value.enquiryId
            }
            sx={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                sx={{ mb: 0, mt: 2 }}
                {...params}
                label="Enquiry Type"
                required
                color="secondary"
                placeholder="Enquiry Type"
                name="enquiry"
                error={errors.enquiry}
                helperText={errors.enquiry}
              />
            )}
          />
          <Autocomplete
            onChange={(e, value) => setFieldValue("caseType", value)}
            isOptionEqualToValue={(option, value) =>
              option.caseTypeId === value.caseTypeId
            }
            value={values.caseType}
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
                label="Case Type"
                placeholder="Case Type"
                name="caseType"
                required
                error={errors.caseType}
                helperText={errors.caseType}
              />
            )}
          />
          <TextField
            sx={{ mb: 0, mt: 2, width: "100%" }}
            id="outlined-basic"
            label="FIR/Complaint Number"
            required
            color="secondary"
            variant="outlined"
            value={values.FIRNumber}
            onChange={handleChange}
            error={errors.FIRNumber}
            onBlur={handleBlur}
            name="FIRNumber"
            helperText={errors.FIRNumber}
          />
          <TextField
            sx={{ mb: 0, mt: 2, width: "100%" }}
            id="outlined-basic"
            label="Police Station Name"
            required
            color="secondary"
            variant="outlined"
            value={values.PoliceStationName}
            onChange={handleChange}
            error={errors.PoliceStationName}
            onBlur={handleBlur}
            name="PoliceStationName"
            helperText={errors.PoliceStationName}
          />
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
                error={errors.stateSelection}
                helperText={errors.stateSelection}
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
                error={errors.citySelection}
                helperText={errors.citySelection}
              />
            )}
          />
          <Autocomplete
            style={{ width: "100%" }}
            onChange={(e, value) => setFieldValue("courtSelection", value)}
            value={values.courtSelection}
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
                  mt: 2,
                }}
                {...params}
                label="Court"
                placeholder="Court"
                color="secondary"
                required
                name="courtSelection"
                error={errors.courtSelection}
                helperText={errors.courtSelection}
              />
            )}
          />
          <Box sx={{ mb: 2, mt: 2 }}>
            <div>
              <Button
                type="submit"
                size="md"
                radius="sm"
                className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
              >
                Continue
              </Button>
              <Button
                isDisabled
                onClick={handleBack}
                radius="sm"
                size="md"
                variant="bordered"
                className="ms-2"
              >
                Back
              </Button>
            </div>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Step1;
