import React, { useEffect, useState } from "react";
import { Alert, TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { getUserProfile } from "@/Apis/login";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { createCustomRequest } from "@/Apis/subscription";

const validation = Yup.object().shape({
  fullname: Yup.string().required("Full Name is required"),
  companyName: Yup.string().required("Company Name is required"),
  email: Yup.string()
    .email("Please Enter Valid Email")
    .required("Email is required"),
  documentCount: Yup.string().required("Document Count is required").nullable(),
  message: Yup.string().nullable(),
});
const ContactForm = ({ setSidebar, plan }) => {
  const accessToken = Cookies.get("accessToken");
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullname: "",
    email: "",
    companyName: null,
    message: null,
    documentCount: "",
  });
  const getUserDetails = async (accessToken) => {
    const response = await getUserProfile(accessToken);
    if (response?.data) {
      setInitialValues((prev) => {
        return {
          ...prev,
          fullname: response?.data.fullname,
          email: response?.data.email,
        };
      });
    }
    // return
  };
  useEffect(() => {
    getUserDetails(accessToken);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <div className="flex flex-col items-center justify-center  lg:max-w-[350px] pb-6">
        <h3 className="text-[22px] font-semibold pb-2 mb-2 text-[#05686E] border-b-1">
          REQUEST A SOLUTION TAILORED TO YOUR NEEDS
        </h3>
        <span className="text-[14px]">
          Each business has different requirements - if yours are not covered by
          our subscription plans, we are happy to set up a custom solution for
          you. To request one, please fill out the form below and our Sales team
          will be with you shortly.
        </span>
      </div>
      {open && (
        <Alert
          onClose={() => {
            setOpen(false);
          }}
          className="w-full"
        >
          Your request was sent successfully!
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        enableReinitialize
        onSubmit={async (values, actions) => {
          console.log(values);
          const response = await createCustomRequest(accessToken, {
            ...values,
            plan: plan,
          });
          if (response) {
            console.log(response);
            actions.setSubmitting(false);
            // setSnackbarMsg("Your request is successfully sent");
            setOpen(true);
            setInitialValues((prev) => {
              return {
                ...prev,
                companyName: "",
                message: "",
                documentCount: "",
              };
            });
            // setSidebar(false);
          }
        }}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          errors,
          isSubmitting,
          touched,
          values,
        }) => (
          <Form
            className="w-full mt-2 lg:max-w-[350px]"
            onSubmit={handleSubmit}
          >
            <TextField
              sx={{ mt: 2 }}
              color="secondary"
              label="Full Name"
              value={values.fullname}
              placeholder="Enter Full Name"
              name="fullname"
              fullWidth
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullname && errors.fullname}
              helperText={
                errors.fullname && touched.fullname ? errors.fullname : ""
              }
            />
            <TextField
              sx={{ mt: 2 }}
              color="secondary"
              label="Email"
              value={values.email}
              placeholder="Enter Email"
              name="email"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email ? errors.email : ""}
            />
            <TextField
              sx={{ mt: 2 }}
              color="secondary"
              label="Company Name"
              value={values.companyName}
              placeholder="Enter Company Name"
              name="companyName"
              fullWidth
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.companyName && errors.companyName}
              helperText={
                errors.companyName && touched.companyName
                  ? errors.companyName
                  : ""
              }
            />
            <TextField
              sx={{ mt: 2 }}
              color="secondary"
              label="No. of Documents"
              value={values.documentCount}
              placeholder="Enter No. of Documents"
              name="documentCount"
              fullWidth
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                if (e.target.value.length > 0) {
                  e.target.value = Math.max(
                    0,
                    parseInt(e.target.value)
                  ).toString();
                }
              }}
              onBlur={handleBlur}
              error={errors.documentCount && touched.documentCount}
              helperText={
                errors.documentCount && touched.documentCount
                  ? errors.documentCount
                  : ""
              }
            />
            <TextField
              sx={{ mt: 2 }}
              color="secondary"
              label="Message"
              value={values.message}
              placeholder="Enter Message"
              name="message"
              multiline
              minRows={3}
              fullWidth
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message && touched.message}
              helperText={
                errors.message && touched.message ? errors.message : ""
              }
            />
            <div className="w-full flex justify-between">
              <Button
                type="button"
                // isLoading={isSubmitting}
                onPress={() => setSidebar(false)}
                className="mt-4 font-semibold rounded-md border bg-transparent border-[#05686E] text-[#000] hover:text-[#FFF]  hover:bg-[#E8713C] lg:px-5 lg:text-base px-2 text-xs"
              >
                Close
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="mt-4 font-semibold rounded-md border bg-[#05686E] text-[#FFF]  hover:bg-[#E8713C] lg:px-5 lg:text-base px-2 text-xs"
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
