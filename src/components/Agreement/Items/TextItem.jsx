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

const TextItem = ({
  item,
  setItems,
  setSelectedFieldItem,
  selectedSignee,
  setUpdate,
  colors,
  signees,
}) => {
    const [textBoxOpen, setTextBoxOpen] = useState(false);
    const [text, setText] = useState(null);
    console.log(item)
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
          {item.type === 'text' && !textBoxOpen? (
            <span
            onClick={()=>{
              if(item?.signee?.fullname === selectedSignee?.fullname){
                setTextBoxOpen(true)
              }
            }}>
              { item.text? item.text : (item.placeholder || item.field)}
          </span>
          ) : textBoxOpen && (
            <Input
            isDisabled ={item?.signee?.fullname !== selectedSignee?.fullname}
              variant={'underlined'}
              aria-label={item.field}
              className="!bg-transparent relative !p-0"
              classNames={{
                inputWrapper: 'h-full',
                innerWrapper: 'p-0 m-0',
              }}
              autoFocus
              defaultValue={item.text && item.text}
              placeholder={item.placeholder || ""}
              value={text}
              onChange={(e) => {
                console.log(e.target.value)
                setItems((prev) => {
                  const index = prev.findIndex((el) => el.id === item.id);
                console.log(index)

                  if (index !== -1) {
                    const removed = prev.splice(index, 1);
                  }
                  prev.push({
                    ...item,
                    text: e.target.value,
                  });
                  console.log(text, item);
                  setText(e.target.value)
                  return prev;
                });
                setUpdate((prev) => !prev);
                // setTextBoxOpen(false)
              }}
              // onFocus={()=> {setDisable(true);}}
              onBlur={(e) => {
                console.log('focusout (self or child)');
                if (e.currentTarget === e.target) {
                  console.log('blur (self)');
                }
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  console.log('focusleave');
                  // setSelectedFieldItem(null);
                  setTextBoxOpen(false);
                }
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default TextItem;
