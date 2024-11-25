import { Button, ModalBody, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from 'react'
import Table from "./Table";
import { CodeSquare, DollarSign, Euro, IndianRupee, Plus } from "lucide-react";
import { $createTableNode, $createTableRowNode, $createTableCellNode, TableCellHeaderStates } from "@lexical/table";
import {$convertFromMarkdownString  } from "@lexical/markdown";
import { $createParagraphNode } from "lexical";
import { $createLayoutContainerNode } from "../../LexicalTemplatePlayground/lexical-playground/src/nodes/LayoutContainerNode";
import { $createLayoutItemNode } from "../../LexicalTemplatePlayground/lexical-playground/src/nodes/LayoutItemNode";


function createUID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}

const createTableCell = (textContent,isHeader,width)=> {
  if(typeof textContent === "number"){
    textContent=  textContent.toString()
  }
  console.log(typeof textContent , textContent)
  textContent = textContent.replace(/\\n/g, '\n');
  const cell = $createTableCellNode(isHeader ? 1 : 0,1,width);
  $convertFromMarkdownString(textContent, undefined ,cell);
  return cell;
};


const currencies = [
  {
    label: "INR",
    icon : <IndianRupee size={16}/>
  },
  {
    label: "EURO",
    icon : <Euro size={16}/>
  },
  {
    label: "USD",
    icon : <DollarSign size={16}/>
  },

]
function roundToTwo(num) {
  console.log(+(Math.round(num + "e+2")  + "e-2"));
  return +(Math.round(num + "e+2")  + "e-2");
}
const QuoteModal = ({ onClose,editor,setEditorRef,quoteTargetNode, setQuoteTargetNode }) => {
    const [tableData, setTableData] = useState([
        {name: "First Data", price: 200, quantity: 100, total:20000 },
        {name: "Second Data", price: 5000, quantity: 10, total:50000 },
        // {name: "", price: 0, quantity: 0, total:125 },
      ]);
      // debugger
      const [summaryOptions, setSummaryOptions] = useState([
        { label: "Subtotal", value: 0 },
        { label: "Discount", value: 0, reducer: 10 },
        { label: "Tax", value: 0, reducer: 25 },
      ]);
      const [update,setUpdate] = useState(false)
      const [currency, setCurrency] = useState("INR")
      useEffect(() => {
        setSummaryOptions((prev)=>{
            const temp = prev.map((option)=>{
                if(option.value !==null){
                    const total = tableData.reduce((accumulator, currentItem) => {
                        let current =currentItem.total
                        if(typeof current === "string"){
                            current = Number(current)
                        }
                        return roundToTwo(Number(accumulator) + Number(current));
                      },roundToTwo(Number(0)));
                      {console.log(option)}
                    switch (option.label) {
                        case "Subtotal":
                            return {
                                ...option,
                                value: roundToTwo(total)
                            }
                            case "Discount":
                              {console.log(option)}
                              {console.log(total)}
                                if(option.reducer !== null){
                                    return {
                                        ...option,
                                        value: -roundToTwo(total* (option.reducer/100))
                                    }
                                }
                                return option
                            case "Tax":
                                if(option.reducer !== null){
                                  const newTax=(total+summaryOptions[1]?.value)*(Number(option.reducer)/100) 
                                  console.log(newTax)
                                    return {
                                        ...option,
                                        value: roundToTwo(newTax)
                                    }
                                }
                                return option
                            case "Total":
                            console.log(option)
                                if(option.reducer !== null){
                                    return {
                                        ...option,
                                        value: roundToTwo(total* (option.reducer/100))
                                    }
                                }
                                return option
                        default:
                            return option
                            break;
                    }
                }
                return option
            })
            return temp
        })
      }, [tableData,update])
      
      
    const handleTableUpdate = (updatedData) => {
        setTableData(updatedData);
      };
    const onAddHandler = () =>{
      console.log("yay")
        const columns = Object.keys(tableData[0]);
        const twoDimensionalArray = [columns, ...tableData.map(item => Object.values(item))];
        console.log(twoDimensionalArray)
        console.log(editor)
        editor.current.update(() => {
          if (quoteTargetNode) {
            const newNode = $createParagraphNode();
            const lexicalTableNode = $createTableNode()
            for (let y = 0; y < twoDimensionalArray.length; y++) {
              const row = $createTableRowNode();
              lexicalTableNode.append(row);
              for (let x = 0; x < columns.length; x++) {
                if((y===0)&& twoDimensionalArray[y][x] !== "name"){
                  row.append(createTableCell(`${twoDimensionalArray[y][x]?.toUpperCase()} ${currency === "INR" ? "(₹)" : ""} ${currency === "EURO" ? "(€)": ""} ${currency === "USD" ? "($)": ""}`, (y===0 || x===0),165));
                } else if (y===0){
                  row.append(createTableCell(`${twoDimensionalArray[y][x]?.toUpperCase()}`, (y===0 || x===0),165));
                } else {
                  row.append(createTableCell(twoDimensionalArray[y][x], (y===0 || x===0),165));
                }
              }
              console.log(row)
            }
            newNode.append(lexicalTableNode);
            // console.log(lexicalTableNode)
            quoteTargetNode.insertBefore(newNode);
            const container = $createLayoutContainerNode('1fr 1fr');
            const summaryNode =$createParagraphNode()
            const summaryTableNode = $createTableNode()
            for (let y = 0; y < summaryOptions.length; y++) {
              const summaryOption = summaryOptions[y]
              const row = $createTableRowNode();
              summaryTableNode.append(row);
              row.append(createTableCell(
                `${summaryOption.label} ${currency === "INR" ? "(₹)" : ""} ${currency === "EURO" ? "(€)": ""} ${currency === "USD" ? "($)": ""}`,
                false,140));
              row.append(createTableCell(summaryOption.value, false,140));
              console.log(row)
            }
            const row = $createTableRowNode();
            summaryTableNode.append(row);
            row.append(createTableCell("Total", false,150));
            row.append(createTableCell(summaryOptions.reduce((accumulator, currentItem) => {
              let current =currentItem.value
              if(typeof current === "string"){
                  current = Number(current)
              }
              return Number(accumulator) + Number(current);
            }, Number(0).toFixed(2)), false,150));
            summaryNode.append(summaryTableNode);
            summaryOptions
            container.append(
              $createLayoutItemNode().append($createParagraphNode()),
            );
            container.append(
              $createLayoutItemNode().append(summaryNode),
            );
            quoteTargetNode.insertBefore(container);
            setQuoteTargetNode(null)
            setEditorRef(null)
            onClose()
          } else {
        setQuoteTargetNode(null)
        setEditorRef(null)
        onClose()
          }
        });
        // setQuoteTargetNode(null)
        // setEditorRef(null)
        // onClose()
    }

  return (
    <>
      <ModalHeader className="flex justify-between gap-1">
        Add Quote
        <Select
          // label="Currency"
          variant="bordered"
          placeholder="Currency"
          selectedKeys={[currency]}
          value={currency}
          className="max-w-[200px] me-2 "
          size="sm"
          labelPlacement="outside-left"
          onChange={(e) => {
            if(e.target.value){
              setCurrency(e.target.value)
            }
          }}
          startContent={currencies.find(el=>el.label === currency)?.icon}
        >
          {currencies.map((item) => (
            <SelectItem key={item.label} value={item.label} startContent={item.icon}>
               {item.label}
            </SelectItem>
          ))}
        </Select>
      </ModalHeader>
      <ModalBody>
        {tableData?.length > 0 && (
          <Table
            data={tableData}
            setData={setTableData}
            onUpdate={handleTableUpdate}
            currency={currency}
            currencies={currencies}
          />
        )}
        <div className="grid grid-cols-2 justify-start w-full ">
          <div>
            <Button
              size="sm"
              className="text-white bg-[#05686E] flex flex-row"
              onClick={() =>
                setTableData((prev) => [
                  ...prev,
                  { name: "Enter Data", price: 0, quantity: 0, total: 0 },
                ])
              }
            >
              <Plus size={20} /> Add Item
            </Button>
          </div>
          <div className="flex flex-col  items-end">
            <div className="w-full lg:w-[50%] md:w-[33%]">
              {tableData?.length > 0 &&
                summaryOptions?.length > 0 &&
                summaryOptions.map((option, index) => {
                  if (option.value !== null)
                    return (
                      <div
                        key={index}
                        className="flex py-2 items-center border-b-2 justify-between "
                      >
                        <div className="flex w-full items-center">
                          <div className="flex justify-center items-center">
                            <span className="px-2 font-semibold text-[14px]">{option.label}</span>
                            {"("}{currencies.find((el) => el.label === currency)?.icon}{")"}
                          </div>
                          {(option?.reducer || option?.reducer === 0) && (
                            <>
                              <span className="px-2 font-bold text-neutral-600 text-[14px]">
                                {"(%)"}
                              </span>
                              <input
                                type="text"
                                value={option?.reducer}
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /^[1-9]\d*(\.\d+)?$/,
                                    ""
                                  );
                                  console.log(parseInt(e.target.value));
                                  if (e.target.value || e.target.value === "") {
                                    setSummaryOptions((prev) => {
                                      const temp = [...prev];
                                      temp.splice(index, 1, {
                                        ...option,
                                        reducer:
                                          e.target.value === ""
                                            ? 0
                                            : (e.target.value),
                                      });
                                      return temp;
                                    });
                                    setUpdate((prev) => !prev);
                                  }
                                }}
                                className="w-12 rounded-md p-2"
                                // onBlur={() => setIsEditing(false)}
                              />
                            </>
                          )}
                        </div>
                        <span className="font-bold text-[14px]">
                          {option.value}
                        </span>
                      </div>
                    );
                  return null;
                })}
              {summaryOptions?.map((el) => el.value !== null)?.length > 1 && (
                <div className="flex justify-between pt-2 items-center">
                  <div className="flex justify-center items-center">
                            <span className="px-2 font-bold text-[16px]">Total</span>
                            {"("}{currencies.find((el) => el.label === currency)?.icon}{")"}
                          </div>
                  <span className="font-bold text-[14px]">
                    {summaryOptions.reduce((accumulator, currentItem) => {
                      let current = currentItem.value;
                      console.log(current)
                      console.log(accumulator)
                      if (typeof current === "string") {
                        current = Number(current);
                      }
                      return roundToTwo(Number(accumulator) + Number(current));
                    },roundToTwo(Number(0)))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button
          className="text-white bg-[#05686E] flex flex-row"
          onPress={onAddHandler}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  );
};

export default QuoteModal;
