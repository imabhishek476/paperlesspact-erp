import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography,
} from "@mui/material";
import { Field, getIn } from "formik";

const InputAccordian = ({user, index, arrayHelpers,formikProps, name}) => {
  const [expanded, setExpanded] = useState(index===0);
  const handleAccordianChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const title = name==="party1Signees"?"Party1 Signees":"Party2 Signees";
  const {
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
  }= formikProps

  let fullname
  let touchedfullname
  let errorfullname

  let phone
  let touchedphone
  let errorphone

  let address 
  let touchedaddress
  let erroraddress

  let aadhar
  let touchedaadhar
  let erroraadhar


  let email
  let touchedemail
  let erroremail

  if(name === "party1Signees"){
    fullname = `party1Signees[${index}].fullname`;
    touchedfullname = getIn(touched, fullname);
    errorfullname = getIn(errors, fullname);
    
    phone = `party1Signees[${index}].phone`;
    touchedphone = getIn(touched, phone);
    errorphone = getIn(errors, phone);

    email = `party1Signees[${index}].email`;
    touchedemail = getIn(touched, email);
    erroremail = getIn(errors, email);
    
    address = `party1Signees[${index}].address`;
    touchedaddress = getIn(touched, address);
    erroraddress = getIn(errors, address);
    
    aadhar = `party1Signees[${index}].aadhar`;
    touchedaadhar = getIn(touched, aadhar);
    erroraadhar = getIn(errors, aadhar);
}
if(name === "party2Signees"){
  fullname = `party2Signees[${index}].fullname`;
  touchedfullname = getIn(touched, fullname);
  errorfullname = getIn(errors, fullname);
  
  phone = `party2Signees[${index}].phone`;
  touchedphone = getIn(touched, phone);
  errorphone = getIn(errors, phone);

  email = `party2Signees[${index}].email`;
  touchedemail = getIn(touched, email);
  erroremail = getIn(errors, email);
  
  address = `party2Signees[${index}].address`;
  touchedaddress = getIn(touched, address);
  erroraddress = getIn(errors, address);
  
  aadhar = `party2Signees[${index}].aadhar`;
  touchedaadhar = getIn(touched, aadhar);
  erroraadhar = getIn(errors, aadhar);
}


  return (
    <Accordion
      elevation={0}
      sx={{
        marginBottom: 1,
        width: "100%",
        border: "none",
      }}
      expanded={expanded === true}
      onChange={handleAccordianChange(true)}
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
          <span className="capitalize">{title}</span>
          {index > 0 && (
            <p onClick={() => arrayHelpers.remove(index)}>
              <DeleteOutlineIcon sx={{ fontSize: "24px" }} />
            </p>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {/* <Field 
            name={`party1Signees.${index}.fullname`}
            component={TextField}
            fullWidth
            label="Full Name"
            color="secondary"
          onBlur={handleBlur}
          error={(errors.owners?.length > 0) && touched?.owners[index]?.fullname}
          helperText={
            (errors.owners?.length > 0) && touched?.owners[index]?.fullname? (typeof errors.owners[index]?.fullname === 'string' ?errors.owners[index]?.fullname:"") : ""
          }
        /> */}
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Full Name"
          required
          color="secondary"
          value={user.fullname}
          onChange={handleChange}
          onBlur={handleBlur}
          name={fullname}
          error={errorfullname && touchedfullname}
          helperText={errorfullname && touchedfullname ? errorfullname : ""}
        />
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Phone"
          required
          color="secondary"
          value={user.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          name={phone}
          error={errorphone && touchedphone}
          helperText={errorphone && touchedphone ? errorphone : ""}
        />
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Email"
          color="secondary"
          value={user.email}
          onChange={handleChange}
          onBlur={handleBlur}
          name={email}
          error={erroremail && touchedemail}
          helperText={erroremail && touchedemail ? erroremail : ""}
        />
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Address"
          color="secondary"
          required
          value={user.address}
          onChange={handleChange}
          onBlur={handleBlur}
          name={address}
          error={erroraddress && touchedaddress}
          helperText={erroraddress && touchedaddress ? erroraddress : ""}
        />
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Aadhar"
          required
          color="secondary"
          value={user.aadhar}
          onChange={handleChange}
          onBlur={handleBlur}
          name={aadhar}
          error={erroraadhar && touchedaadhar}
          helperText={erroraadhar && touchedaadhar ? erroraadhar : ""}
        />
        
      </AccordionDetails>
    </Accordion>
  );
};

export default InputAccordian;

{
  /** both these conventions do the same */
}
{
  /* <Field name={`friends[${index}].name`} />
                        <Field name={`friends.${index}.age`} />

                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          -
                        </button> */
}
