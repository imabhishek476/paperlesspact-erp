import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddDocuments from "../addDocuments";
import { getIn } from "formik";

const InputAccordian = ({
  index,
  handleBlur,
  setFieldValue,
  touched,
  errors,
  handleChange,
  item,
  arrayHelpers,
}) => {
  const [expanded, setExpanded] = useState(index === 0);
  const [isStampRequired, setIsStampRequired] = useState((item?.stampURL||item?.stampAmount!=="0")?true:false);
  const [isStampAmountRequired, setIsStampAmountRequired] = useState(item?.stampURL?true:false);
  const handleAccordianChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleStampChange = (event) => {
    setIsStampRequired(event.target.checked);
  };
  const handleStampAmountChange = (event) => {
    setIsStampAmountRequired(event.target.checked);
  };

  let stampAmount = `agreements[${index}].stampAmount`;
  let touchedstampAmount = getIn(touched, stampAmount);
  let errorsstampAmount = getIn(errors, stampAmount);

  let name = `agreements[${index}].name`;
  let touchedname = getIn(touched, name);
  let errorsname = getIn(errors, name);

  

  const handleDocumentChange = (value) => {
    setFieldValue(`agreements[${index}].document`, value);
  };
  const handleStampFileChange = (value) => {
    setFieldValue(`agreements[${index}].stampFile`, value);
  };
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
          <span className="capitalize">Document {index + 1}</span>
          {index > 0 && (
            <p onClick={() => arrayHelpers.remove(index)}>
              <DeleteOutlineIcon sx={{ fontSize: "24px" }} />
            </p>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <TextField
          sx={{ mb: 0, mt: 2, width: "100%" }}
          label="Document Name"
          required
          color="secondary"
          value={item.name}
          onChange={handleChange}
          error={errorsname && touchedname}
          onBlur={handleBlur}
          name={name}
          helperText={
            errorsname && touchedname ? errorsname : ""
          }
        />
        <div className="flex justify-between mt-4">
          <p>Is stamp required for this agreement?</p>
          <Switch checked={isStampRequired} onChange={handleStampChange} />
        </div>
        {isStampRequired && (
          <div className="flex justify-between mt-4">
            <p>Have you already purchased stamp?</p>
            <Switch
              checked={isStampAmountRequired}
              onChange={handleStampAmountChange}
            />
          </div>
        )}
        {isStampRequired&&!isStampAmountRequired && (
          <TextField
            sx={{ mb: 0, mt: 2, width: "100%" }}
            label="Stamp"
            color="secondary"
            required
            value={item.stampAmount}
            onChange={handleChange}
            error={touchedstampAmount && errorsstampAmount}
            onBlur={handleBlur}
            name={stampAmount}
            helperText={
              errorsstampAmount && touchedstampAmount ? errorsstampAmount : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        )}
        {isStampRequired&&isStampAmountRequired && (
          <div className="mt-5">
            <p className="mb-3">Upload Stamp</p>
            <AddDocuments
              accept={"application/pdf"}
              multiple={false}
              documentsArray={item.stampFile}
              setDocumentsArray={handleStampFileChange}
            />
          </div>
        )}
    <div className="mt-5">
            <p className="mb-3">Upload Document</p>
        <AddDocuments
          accept={"application/pdf"}
          multiple={false}
          documentsArray={item.document}
          setDocumentsArray={handleDocumentChange}
        />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default InputAccordian;
