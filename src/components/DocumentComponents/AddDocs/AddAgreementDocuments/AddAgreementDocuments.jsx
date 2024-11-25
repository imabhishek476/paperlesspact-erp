import { FieldArray } from "formik";
import React, { useState } from "react";
import InputAccordian from "./InputAccordian";
import { Button } from "@nextui-org/react";
import AddIcon from '@mui/icons-material/Add';

const AddAgreementDocuments = ({
  values,
  handleBlur,
  setFieldValue,
  handleChange,
  touched,
  errors,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(values.agreements);
  return (
    <FieldArray
      name="agreements"
      render={(arrayHelpers) => {
        return (
          <div>
            {values.agreements.map((document, index) => {
              return (
                <InputAccordian
                  key={index}
                  index={index}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  touched={touched}
                  errors={errors}
                  item={document}
                  arrayHelpers={arrayHelpers}
                />
              );
            })}
            <div className="flex justify-end pt-4 pb-2">
              <Button
                type="button"
                size="md"
                radius="sm"
                className="bg-[#fda178] hover:bg-[#05686E] hover:text-[white]"
                onClick={() =>
                  arrayHelpers.push({
                    name: null,
                    stampAmount: "0",
                    document: null,
                    stampFile:null,
                  })
                }
                isLoading={isLoading}
                startContent={<AddIcon/>}
              >
                 Add Document
              </Button>
            </div>
          </div>
        );
      }}
    ></FieldArray>
  );
};

export default AddAgreementDocuments;
