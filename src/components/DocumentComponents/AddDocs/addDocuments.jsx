import React, { useRef, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DisplayDocuments from "../DisplayDocs/displayDocuments";

const AddDocuments = ({
  accept,
  multiple,
  documentsArray,
  setDocumentsArray,
}) => {
  const [isDocumentsSelected, setIsdocumentSelected] = useState(false);
  const fileInput = useRef(null);

  const handleFileInputChange = (e) => {
    setIsdocumentSelected(false);
    console.log(documentsArray);
    console.log(e.target.files);
    if (documentsArray?.length > 0) {
      const array = [...e.target.files, ...documentsArray];
      console.log(array);
      setDocumentsArray([...array]);
    } else {
      console.log(e.target.files);
      const array = [...e.target.files];
      console.log(array);
      setDocumentsArray([...array]);
    }
    setIsdocumentSelected(true);
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  return (
    <div className="w-full border border-dotted border-[#d3d3d3] mt-3 p-3">
      <input
        accept={accept}
        multiple={multiple}
        type="file"
        ref={fileInput}
        onChange={handleFileInputChange}
        hidden
      />
      <>
        {documentsArray&&documentsArray?.length>0 ? (
          <DisplayDocuments documentsArray={documentsArray} handleClick={handleClick} setDocumentsArray={setDocumentsArray} multiple={multiple}/>
        ) : (
          <UploadFileIcon sx={{ fontSize: "40px" }} onClick={handleClick} />
        )}
      </>
    </div>
  );
};

export default AddDocuments;
