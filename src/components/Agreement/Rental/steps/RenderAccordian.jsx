import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

const validation = Yup.object().shape({
  fullName: Yup.string().required("Full name is required").nullable(),
  address: Yup.string().required("Address is required").nullable(),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
      "Enter Valid Phone Number"
    )
    .nullable(),
});

const RenderAccordian = ({ name, agreementResponse, count, index,setList,handleRemove,setIsAccordianOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(count === 1 ? true : false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 useEffect(() => {
  if(expanded){
    setIsAccordianOpen(true)
  } else {
    setIsAccordianOpen(false)
  }
 
 }, [expanded])
 
  const isSameNumber = (phoneNumber) => {
    let check = false;
    if (name === "Owner" && agreementResponse?.tenanDetails) {
      check = agreementResponse?.tenanDetails?.some((tenant) => {
        return tenant?.phone === phoneNumber;
      });
    } else if (name === "Tenant" && agreementResponse?.ownerDetails) {
      check = agreementResponse?.ownerDetails?.some((owner) => {
        return owner?.phone === phoneNumber;
      });
    }
    return check;
  };
  const onSubmitHandler = (values, actions) => {
    if (isSameNumber(values?.phoneNumber)) {
      actions.setFieldError(
        "phoneNumber",
        "Phone number of Owner and Tenant can't be same"
      );
    } else {
      setList((prev) => {
        console.log(prev);
        console.log([
            ...prev,{
                fullname: values.fullName,
                phone: values.phoneNumber,
                address: values.address,
                aadhar: values.aadhar,
                isSigned:"0",
            }
        ])
        return [...prev,{
            fullname: values.fullName,
            phone: values.phoneNumber,
            address: values.address,
            aadhar: values.aadhar,
            isSigned:"0",
        }];
      });
      setExpanded(false);
    }
  };

  const initialValues = useMemo(() => {
    if(name==="Owner"){
        if (agreementResponse?.ownerDetails &&  agreementResponse?.ownerDetails.length>0) {
            return {
              fullName: agreementResponse?.ownerDetails[index]?.fullname,
              phoneNumber: agreementResponse?.ownerDetails[index]?.phone,
              aadhar: agreementResponse?.ownerDetails[index]?.aadhar,
              address: agreementResponse?.ownerDetails[index]?.address,
            };
          } else if (agreementResponse?.user?.userType === "Landlord") {
            return {
              fullName: agreementResponse?.user.fullname,
              phoneNumber: agreementResponse?.user.phone,
              address: "",
              aadhar: "",
            };
          } else {
            return {
              fullName: "",
              phoneNumber: "",
              address: "",
              aadhar: "",
            };
          }
    }else if(name==="Tenant"){
        if (agreementResponse?.tenantDetails &&  agreementResponse?.tenantDetails.length>0) {
            return {
              fullName: agreementResponse?.tenantDetails[index]?.fullname,
              phoneNumber: agreementResponse?.tenantDetails[index]?.phone,
              aadhar: agreementResponse?.tenantDetails[index]?.aadhar,
              address: agreementResponse?.tenantDetails[index]?.address,
            };
          } else if (agreementResponse?.user?.userType === "Tenant") {
            return {
              fullName: agreementResponse?.user.fullname,
              phoneNumber: agreementResponse?.user.phone,
              address: "",
              aadhar: "",
            };
          } else {
            return {
              fullName: "",
              phoneNumber: "",
              address: "",
              aadhar: "",
            };
          }
    }
    
  }, [agreementResponse]);

  return (
    <Accordion
      elevation={0}
      sx={{
        marginBottom: 1,
        width: "100%",
        border: "none",
      }}
      expanded={expanded === true}
      onChange={handleChange(true)}
    >
      <AccordionSummary
        sx={{ height: "50px", p: 0 }}
        expandIcon={<ExpandMoreIcon />}
        id="panel1bh-header"
      >
        <Typography
          variant="h6"
          sx={{
            width: "90%",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* {pref ? "Edit " + name : "New " + name} */}
          {name}
          {index > 0 && (
            <p
            onClick={()=>handleRemove(index)}
            >
              <DeleteOutlineIcon sx={{ fontSize: "24px" }} />
            </p>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <div className="h-full w-full">
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
                  label="Full Name"
                  required
                  color="secondary"
                  value={values.fullName}
                  onChange={handleChange}
                  error={errors.fullName && touched.fullName}
                  onBlur={handleBlur}
                  name="fullName"
                  helperText={
                    errors.fullName && touched.fullName ? errors.fullName : ""
                  }
                />
                <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  label="Phone Number"
                  required
                  color="secondary"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber && touched.phoneNumber}
                  onBlur={handleBlur}
                  name="phoneNumber"
                  helperText={
                    errors.phoneNumber && touched.phoneNumber
                      ? errors.phoneNumber
                      : ""
                  }
                />
                <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  label="Aadhar No."
                  required
                  color="secondary"
                  value={values.aadhar}
                  onChange={handleChange}
                  error={errors.aadhar && touched.aadhar}
                  onBlur={handleBlur}
                  name="aadhar"
                  helperText={
                    errors.aadhar && touched.aadhar ? errors.aadhar : ""
                  }
                />
                <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  label="Full Address"
                  placeholder="Enter owner's full address with pincode"
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
                <div className="flex justify-end pt-4 pb-3 gap-3">
                  <Button
                    type="submit"
                    size="md"
                    radius="sm"
                    className="bg-[#EABF4E] hover:text-[white] hover:bg-[black]"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                  >
                    Add {name}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default RenderAccordian;
