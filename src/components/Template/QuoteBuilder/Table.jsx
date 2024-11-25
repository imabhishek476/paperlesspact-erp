import { Button } from '@nextui-org/react';
import { X } from 'lucide-react';
import React, { useState } from 'react'


const EditableCell = ({ value, onChange }) => {
    // const [isEditing, setIsEditing] = useState(false);
  
    const handleInputChange = (e) => {
      onChange(e.target.value);
    };
  
    return (
      <td className='w-[20%] p-2'>
        <div className='w-full h-full border-2 border-[#05686E00]  hover:border-[#05686E70] hover:z-20'>
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className='w-full text-center p-2'
          />
        </div>
      </td>
    );
  };


const Table = ({data,onUpdate,setData,currency,currencies}) => {
    const columns = Object.keys(data[0]);

    const handleCellUpdate = (rowIndex, columnName, newValue) => {
      const updatedData = [...data];
      const row = updatedData[rowIndex]
      row[columnName] = newValue
      let price = row["price"]
      let quantity = row["quantity"]
      if(typeof price === "string"){
        price= parseInt(price)
      }
      if(typeof quantity === "string"){
        quantity = parseInt(quantity)
      }
      updatedData[rowIndex] = {
        ...row,
        total  : row["price"] * row["quantity"]
      }
      onUpdate(updatedData);
    };
  
    return (
      <table className="rounded-md bg-white">
        <thead className='border-2'>
          <tr>
            {columns.map((column) => (
              <th className="capitalize py-2" key={column}>
                <div className='flex justify-center items-center py-2'>
                  <span className='px-2'>
                {column}
                  </span>
                {column !== "name" && 
                  currencies.find((el)=>el.label === currency)?.icon
                }
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center rounded-md bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b-2">
              {columns.map((column, colIndex) => (
                <EditableCell
                  key={column}
                  value={row[column]}
                  onChange={(newValue) =>
                    handleCellUpdate(rowIndex, column, newValue)
                  }
                />
              ))}
              <td className="w-[5%] p-2">
                <div className="flex justify-end w-full h-full">
                  <Button
                    isDisabled = {data?.length === 1}
                  onPress={()=>setData(prev=>{
                    const temp = [...prev]
                    temp.splice(rowIndex,1)
                    return temp
                  })} isIconOnly size='sm' className='text-white bg-[#05686E] flex flex-row'>
                    <X size={16}/>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}

export default Table