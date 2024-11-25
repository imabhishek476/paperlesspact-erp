import { Autocomplete, InputAdornment, Select, TextField } from "@mui/material";
import { Button, MenuItem } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { createRentalAgreement } from "@/Apis/legalAgreement";
import dayjs from "dayjs";
import * as Yup from "yup";

const validation = Yup.object().shape({
  monthlyRent: Yup.string().required("Rent is required").nullable(),
  securityDeposit: Yup.string().required("Deposit is required").nullable(),
  escalation: Yup.string().required("Escalation is required").nullable(),
  billingBy: Yup.string().required("Billing by is required").nullable(),
  lockPeriod: Yup.string().required("Lockin period is required").nullable(),
  validity: Yup.string().required("Validity is required").nullable(),
  startDate: Yup.object().required("Start Date is required"),
});
const billingOptions = ["Tenant", "Owner"];

const Step5 = ({
  agreementResponse,
  setAgreementResponse,
  handleNext,
  handleBack,
  setCompleted,
  setPreviewData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState(false);

  const onSubmitHandler = async (values, actions) => {
    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    console.log(values);
    if (!accessToken) {
      return;
    }
    const paymentDate = new Date()
    paymentDate.setDate(values?.paymentDate)
    console.log(paymentDate)
    const data = {
      rentalId: agreementResponse._id,
      agreementDetails: {
        rent: values.monthlyRent,
        deposit: values.securityDeposit,
        lockIn: parseInt(values.lockPeriod),
        validity: parseInt(values.validity),
        startDate: new Date(values.startDate),
        paymentDate: paymentDate,
        escalation: values.escalation,
        billingBy: values.billingBy.toLowerCase(),
      },
    };
    console.log(data);
    const res = await createRentalAgreement(accessToken, data, "4");
    if(res){
      setAgreementResponse(res);
      console.log(res);
      setPreviewData((prev) => {
        const temp = {
          ...prev,
          rent: res?.agreementDetails?.rent,
          startDate: res?.agreementDetails?.startDate,
          paymentDate: res?.agreementDetails?.paymentDate,
          deposit: res?.agreementDetails?.deposit,
          billingBy: res?.agreementDetails?.billingBy,
          escalation: res?.agreementDetails?.escalation,
        };
        console.log(temp);
        return temp;
      });
      setCompleted((prev) => {
        let temp = prev;
        temp[4] = true;
        console.log(temp);
        return temp;
      });
      setIsLoading(false);
      handleNext();
    }
  };
  console.log(agreementResponse?.agreementDetails?.paymentDate)
  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Agreement Terms
      </p>
      <Formik
        validationSchema={validation}
        initialValues={{
          monthlyRent: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.rent
            : "",
          securityDeposit: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.deposit
            : "",
          escalation: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.escalation
            : "",
          billingBy: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.billingBy
                .charAt(0)
                .toUpperCase() +
              agreementResponse?.agreementDetails?.billingBy.slice(1)
            : "Owner",
          lockPeriod: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.lockIn
            : "",
          noticePeriod: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.noticePeriod
            : "",
          validity: agreementResponse?.agreementDetails
            ? agreementResponse?.agreementDetails?.validity
            : "",
          startDate: agreementResponse?.agreementDetails
            ? dayjs(agreementResponse?.agreementDetails?.startDate)
            : null,
          paymentDate: agreementResponse?.agreementDetails
            ? new Date(agreementResponse?.agreementDetails?.paymentDate).getDate()
            : null,
        }}
        onSubmit={onSubmitHandler}
        enableReinitialize
      >
        {({
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          setFieldError,
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
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Monthly Rent(in Rupees)"
              required
              color="secondary"
              value={values.monthlyRent}
              onChange={handleChange}
              onBlur={handleBlur}
              name="monthlyRent"
              error={touched.monthlyRent && Boolean(errors.monthlyRent)}
              helperText={
                errors.monthlyRent && touched.monthlyRent
                  ? errors.monthlyRent
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Security Deposit(in Rupees)"
              required
              color="secondary"
              value={values.securityDeposit}
              onChange={handleChange}
              onBlur={handleBlur}
              name="securityDeposit"
              error={touched.securityDeposit && errors.securityDeposit}
              helperText={
                errors.securityDeposit && touched.securityDeposit
                  ? errors.securityDeposit
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Increase % (per year)"
              required
              color="secondary"
              value={values.escalation}
              onChange={handleChange}
              onBlur={handleBlur}
              name="escalation"
              error={touched.escalation && errors.escalation}
              helperText={
                errors.escalation && touched.escalation ? errors.escalation : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
            />
            {/* <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  label="Billing by"
                  required
                  color="secondary"
                  value={values.billingBy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="billingBy"
                  error={touched.billingBy && errors.billingBy}
                  helperText={errors.billingBy && touched.billingBy ? errors.billingBy : "" }
                /> */}
            <Autocomplete
              style={{ width: "100%" }}
              options={billingOptions}
              value={values.billingBy}
              onChange={(e, value) => {
                setFieldValue("billingBy", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ mt: 2 }}
                  color="secondary"
                  label="Maintainance Paid By(Electricty Bill,Water Bill,etc)"
                  placeholder="Maintainance Paid By(Electricty Bill,Water Bill,etc)"
                  name="billingBy"
                  required
                  onBlur={handleBlur}
                  error={errors.billingBy && touched.billingBy}
                  helperText={
                    errors.billingBy && touched.billingBy
                      ? errors.billingBy
                      : ""
                  }
                />
              )}
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Lock in period(No. of months)"
              placeholder="Enter owner's full address with pincode"
              required
              color="secondary"
              value={values.lockPeriod}
              onChange={handleChange}
              onBlur={handleBlur}
              name="lockPeriod"
              error={touched.lockPeriod && errors.lockPeriod}
              helperText={
                errors.lockPeriod && touched.lockPeriod ? errors.lockPeriod : ""
              }
            />
            <TextField
              sx={{ mb: 0, mt: 2, width: "100%" }}
              label="Agreement Validity(No. of months)"
              placeholder="Enter owner's full address with pincode"
              required
              color="secondary"
              value={values.validity}
              onChange={handleChange}
              onBlur={handleBlur}
              name="validity"
              error={touched.validity && errors.validity}
              helperText={
                errors.validity && touched.validity ? errors.validity : ""
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Agreement Start Date"
                format="DD/MM/YYYY"
                value={values.startDate}
                onChange={(newValue) => {
                  setFieldValue("startDate", newValue);
                  const today = new Date();
                  if (
                    today > newValue.$d &&
                    today.getDate() !== newValue.$d.getDate()
                  ) {
                    setDateError("Warning: You are entering a previous date");
                  } else {
                    setDateError(null);
                  }
                }}
                sx={{ width: "100%", mt: 2 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: "startDate",
                    color: "secondary",
                    required: true,
                    error: touched.startDate && errors.startDate,
                    helperText: touched.startDate && errors.startDate,
                  },
                }}
                onError={(err) => {
                  console.log(err);
                  if (err === "disablePast") {
                    setDateError("Warning: You are entering a previous date");
                  } else if (err === "invalidDate") {
                    setDateError("Enter Valid Date");
                  } else {
                    setDateError(null);
                  }
                }}
              />
            </LocalizationProvider>
            {dateError && (
              <p className="text-[#d32f2f] text-[0.75rem] ms-[14px]">
                {dateError}
              </p>
            )}
            <Autocomplete
              style={{ width: "100%" }}
              options={Array.from({length:31}, (_, i) => i + 1)}
              value={values?.paymentDate}
              onChange={(e, value) => {
                setFieldValue("paymentDate", value);
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>{option}</li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ mt: 2 }}
                  color="secondary"
                  label="Payment Day"
                  placeholder="Payment Day"
                  name="Payment Day"
                  required
                  onBlur={handleBlur}
                  error={errors.paymentDate && touched.paymentDate}
                  helperText={
                    errors.paymentDate && touched.paymentDate
                      ? errors.paymentDate
                      : ""
                  }
                />
              )}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Payment Day"
                // format="DD/MM/YYYY"
                views={['day']}
                value={values.paymentDate}
                onChange={(newValue) => {
                  setFieldValue("paymentDate", newValue);
                }}
                sx={{ width: "100%", mt: 2 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: "paymentDate",
                    color: "secondary",
                    required: true,
                    error: touched.paymentDate && errors.paymentDate,
                    helperText:
                      errors.paymentDate && touched.paymentDate
                        ? errors.paymentDate
                        :  "",
                  },
                }}
              />
            </LocalizationProvider> */}

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

export default Step5;
