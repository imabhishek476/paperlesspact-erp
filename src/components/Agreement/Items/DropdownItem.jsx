import { InputAdornment, TextField } from '@mui/material';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import {
  ArrowBigLeft,
  GripHorizontal,
  GripVertical,
  Image,
  Minus,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';

const CustomDropdownItem = ({
    item,
    setItems,
    setSelectedFieldItem,
    selectedSignee,
    setUpdate,
    colors,
    signees
}) => {
  const [value, setValue] = useState(item.text?item.text:"");
  // const [option, setOption] = useState(new Set([]));
  // useEffect(() => {
  //   setItems((prev) => {
  //     const index = prev.findIndex((el) => el.id === item.id);
  //     if (index !== -1) {
  //       const removed = prev.splice(index, 1);
  //     }
  //     console.log(option);
  //     console.log( option?.currentKey?item.labels[Number(option?.currentKey)]:item.labels[0]);
  //     prev.push({
  //       ...item,
  //       text: option?.currentKey?item.labels[Number(option?.currentKey)]:item.labels[0],
  //     });
  //     //   console.log(text, item);
  //     setUpdate((prev) => !prev);
  //     return prev;
  //   });
  // }, [option]);
  const handleSelectionChange = (e) => {
    console.log(e.target.value)
    setItems((prev) => {
      const index = prev.findIndex((el) => el.id === item.id);
      if (index !== -1) {
        const removed = prev.splice(index, 1);
      }
      prev.push({
        ...item,
        text:e.target.value
      });
      //   console.log(text, item);
      setUpdate((prev) => !prev);
      return prev;
    });
    setValue(e.target.value);
  };

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
        // onClick={() => {
        //   // if (item?.signee?.fullname === selectedSignee?.fullname) {
        //   if (true) {
        //     onDateHandler(item);
        //   }
        // }}
        className={`absolute z-[20] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:cursor-pointer`}
      >
        <div
          className="w-full h-full relative flex items-center justify-center"
          id={item.id}
        >
          <div className="p-1 w-full">
          <Select
              isDisabled ={item?.signee?.fullname !== selectedSignee?.fullname}
              // label="Favorite Animal"
              variant="bordered"
              placeholder="Select"
              radius="none"
              selectedKeys={[value]}
              // selectedKeys={option}
              // className="max"
              size="sm"
              onChange={handleSelectionChange}
              // onSelectionChange={setOption}
            >
              {item.labels.map((label, index) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default CustomDropdownItem;
