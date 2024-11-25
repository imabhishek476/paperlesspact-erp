import { TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cookies from "js-cookie";
import { createRentalAgreement } from "@/Apis/legalAgreement";
const inputArray = [
  {
    name: "Fan",
    quantity: 0,
  },
  {
    name: "Table",
    quantity: 0,
  },
  {
    name: "Refrigerator",
    quantity: 0,
  },
  {
    name: "Bed",
    quantity: 0,
  },
  {
    name: "Sofa",
    quantity: 0,
  },
  {
    name: "Washing Machine",
    quantity: 0,
  },
];
const Step6 = ({
  agreementResponse,
  setAgreementResponse,
  handleNext,
  handleBack,
  setCompleted,
  setPreviewData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateComponent, setUpdateComponent] = useState(true);
  const [itemArray, setItemArray] = useState(
    agreementResponse?.items ? agreementResponse?.items : inputArray
  );

  const onItemRemoveHandler = () => {
    if (itemArray.length > 2) {
      const newArr = itemArray;
      newArr.pop();
      setItemArray(newArr);
      setUpdateComponent((prev) => !prev);
    }
  };

  const addQuantityHandler = (index) => {
    const newArray = itemArray;
    const item = newArray[index];
    item.quantity = item.quantity + 1;
    newArray[index] = item;
    setItemArray(newArray);
    setUpdateComponent((prev) => !prev);
  };
  const removeQuantityHandler = (index) => {
    const newArray = itemArray;
    const item = newArray[index];
    if (item.quantity > 0) {
      item.quantity = item.quantity - 1;
      newArray[index] = item;
      setItemArray(newArray);
      setUpdateComponent((prev) => !prev);
    }
  };
  const onNameChangeHandler = (newName, index) => {
    const newArray = itemArray;
    const item = newArray[index];
    item.name = newName;
    newArray[index] = item;
    setItemArray(newArray);
    setUpdateComponent((prev) => !prev);
  };
  const onSubmitHandler = async () => {
    setIsLoading(true);
    const filteredArray = itemArray.filter(
      (item) => item.quantity !== 0 && item.name.trim() !== ""
    );
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    let itemTable = <></>;
    if (!accessToken) {
      return;
    }

    if (filteredArray.length > 0) {
      // if(true){
      const data = {
        rentalId: agreementResponse._id,
        itemDetails: {
          items: filteredArray,
        },
      };
      const res = await createRentalAgreement(accessToken, data, "5");
      if (res) {
        setAgreementResponse(res);
        console.log(res);
        filteredArray.map((item, index) => {
          itemTable = (
            <>
              {itemTable}
              <tr>
                <td
                  width={91}
                  valign={"top"}
                  style={{
                    width: "68.25pt",
                    border: "solid gray 1.0pt",
                    borderTop: "none",
                    padding: "4.0pt",
                    height: "21.0pt",
                  }}
                >
                  <p className="MsoNormal mt-2 text-center " align={"center"}>
                    <span className="text-black">{index + 1}</span>
                  </p>
                </td>
                <td
                  width={219}
                  valign={"top"}
                  className="border-b-1 border-r-1 border-black p-1"
                >
                  <p className="MsoNormal mt-2 text-center" align={"center"}>
                    <span className="text-black">{item.name}</span>
                  </p>
                </td>
                <td
                  width={202}
                  valign={"top"}
                  className="border-b-1 border-r-1 border-black p-1"
                >
                  <p className={"MsoNormal mt-2 text-center"} align={"center"}>
                    <span className="text-black">{item.quantity}</span>
                  </p>
                </td>
              </tr>
            </>
          );
        });
        // setPreviewData((prev) => {
        //   const temp = {
        //     ...prev,
        //     itemTable: itemTable,
        //   };
        //   console.log(temp);
        //   return temp;
        // });
      }
      
    }
    setCompleted((prev) => {
      let temp = prev;
      temp[5] = true;
      console.log(temp);
      return temp;
    });
    setIsLoading(false);
    handleNext();
    
  };
  return (
    <div className="w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-2">
        Item List/ Annexures
      </p>
      {(updateComponent || !updateComponent) && (
        <>
          {itemArray.map((item, index) => {
            return (
              <div className="flex items-center" key={index}>
                <TextField
                  sx={{ mb: 0, mt: 2, width: "100%" }}
                  label="Item Name"
                  color="secondary"
                  value={item.name}
                  onChange={(e) => {
                    onNameChangeHandler(e.target.value, index);
                  }}
                  name="itemName"
                />
                <div className="flex gap-4 justify-end items-center h-full mt-2">
                  <Button
                    className="p-0 min-w-0 px-2  bg-transparent hover:bg-slate-100"
                    onClick={() => removeQuantityHandler(index)}
                  >
                    <RemoveIcon />
                  </Button>
                  {item.quantity}
                  <Button
                    className="p-0 min-w-0 px-2  bg-transparent hover:bg-slate-100"
                    onClick={() => addQuantityHandler(index)}
                  >
                    <AddIcon />{" "}
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      )}
      <div className="md:flex justify-between mt-[16px]">
        <div className="flex gap-2">
          <Button
            type="button"
            size="md"
            radius="sm"
            className="border border-[#E9EEF2]  bg-transparent hover:bg-slate-100"
            onClick={() =>
              setItemArray((prev) => {
                return [
                  ...prev,
                  {
                    name: "",
                    quantity: 0,
                  },
                ];
              })
            }
          >
            Add Item
          </Button>
          <Button
            type="button"
            size="md"
            isDisabled={itemArray.length <= 2}
            radius="sm"
            className="border border-[#E9EEF2]  bg-transparent hover:bg-slate-100"
            onClick={onItemRemoveHandler}
          >
            Remove Item
          </Button>
        </div>
        <div className="flex justify-start md:justify-end items-center my-4 pb-3 gap-3">
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
            className="bg-[#EABF4E] md:my-0 hover:text-[white] hover:bg-[black]"
            onClick={onSubmitHandler}
            isLoading={isLoading}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step6;
