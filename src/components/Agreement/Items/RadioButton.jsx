import { InputAdornment, TextField } from '@mui/material';
import {
  Radio,
  RadioGroup,
  Tooltip,
} from '@nextui-org/react';
import {
  ArrowBigLeft,
} from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';

const RadioButton = ({
  item,
  setItems,
  setSelectedFieldItem,
  selectedSignee,
  setUpdate,
  colors,
  signees
}) => {
  const [option, setOption] = useState(null);
  return (
    <Tooltip
      key={item.id}
      content={`This place is for ${item?.signee?.fullname}`}
      isDisabled={item?.signee?.fullname === selectedSignee?.fullname}
    >
      <div
        // key={item.id}
        style={{
          top: item.top || item.position.y,
          left: item.left || item.position.x,
          width: (item?.size? `${item?.size?.width*100/ 768}%`:'20%'),
          height: (item?.size? `${item?.size?.height*100/ 1080}%` : '3.6%'),
          backgroundColor:
            colors[
              signees.findIndex(
                (ele) => ele.fullname === item?.signee?.fullname
              ) % 3
            ]?.color,
          cursor:
            item?.signee?.fullname === selectedSignee?.fullname
              ? 'pointer'
              : 'not-allowed',
        }}
        onClick={() => {
            // if (item?.signee?.fullname === selectedSignee?.fullname) {
                if (true) {
              onDateHandler(item);
            }
        }}
        className={`absolute z-[20] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:cursor-pointer`}
      >
        <div
          className="w-full h-full relative flex items-center justify-center"
          id={item.id}
        >
        
        <RadioGroup
                // label="Select your favorite city"
                isDisabled ={item?.signee?.fullname !== selectedSignee?.fullname}
                color='secondary'
                value={item?.text || null}
                onValueChange={(e) => {
                  console.log(e);
                  setItems((prev) => {
                    const index = prev.findIndex((el) => el.id === item.id);
                    if (index !== -1) {
                      const removed = prev.splice(index, 1);
                    }

                    prev.push({
                      ...item,
                      text: e,
                    });
                    setSelectedFieldItem(null)
                    setUpdate((prev) => !prev);
                    return prev;
                  });
                }}
              >
                {item?.labels?.map((label, index) => {
                  return (
                    <Radio value={label} key={index}>
                      {label}
                    </Radio>
                  );
                })}
              </RadioGroup>
        </div>
      </div>
    </Tooltip>
  );
};

export default RadioButton;
