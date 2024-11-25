import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

const DisplayDocuments = ({
  documentsArray,
  handleClick,
  setDocumentsArray,
  multiple,
}) => {
  // console.log(documentsArray);
  const removeDocument = (name) => {
    const newDocumentsArray = documentsArray.filter(
      (file) => file?.name !== name
    );
    setDocumentsArray(newDocumentsArray);
  };
  return (
    <div className="flex gap-4 flex-wrap">
      {multiple && (
      <div
        className="flex flex-col   justify-center items-center p-2 border border-solid border-gray-300 rounded-lg cursor-pointer min-h-[100px] w-[100px]"
        onClick={handleClick}
      >
        <AddCircleOutlineIcon sx={{ fontSize: "16px" }} />
        <p>Add Files</p>
      </div>
      )}
      {documentsArray &&
        documentsArray.length > 0 &&
        documentsArray.map((document) => {
          return (
            <div
              key={document.name}
              className="flex justify-center  items-center w-[100px] h-[120px]  rounded-lg relative bg-[#f3f3f3] p-2"
            >
              <p className="text-ellipsis overflow-hidden w-full">
                {document.name}
              </p>
              <span className="absolute  inline-flex -top-2 -right-2 cursor-pointer rounded-[50%] h-[20px] w-[20px] bg-[#f4f4f4]">
                {" "}
                <CancelTwoToneIcon
                  onClick={() => removeDocument(document.name)}
                />{" "}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default DisplayDocuments;
