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
import { Upload } from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useRef, useState } from 'react';

const FileItem = ({
  item,
  setItems,
  setSelectedFieldItem,
  selectedFieldItem,
  selectedSignee,
//   setUpdate,
  colors,
  signees,
}) => {
  const [update, setUpdate] = useState(false);
  const [imageBoxOpen, setImageBoxOpen] = useState(false);

  const fileInput = useRef(null);
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleFileInputChange = async (e) => {
    console.log(fileInput.current.value);
    if (e.target.files && e.target.files.length > 0) {
        setItems((prev) => {
            prev.some((el) => {
              return el.id === item?.id;
            })

            if (prev.some((el) => el.id === item?.id)) {
              const index = prev.findIndex(
                (el) => el.id === item.id
              );
              console.log(index);
              const temp = prev.filter(
                (items) => items.id !== item.id
              );
              console.log(temp);
              // console.log(bigImage);
              temp.push({
                ...item,
                file: e.target.files[0],
              });
              console.log(temp);
              return temp;
            } else {
              return prev;
            }
          });
    }
    // fileInput.current.value = null
    setImageBoxOpen(false)
    setUpdate((prev)=>!prev)
  };
  console.log(item?.signee?.fullname === selectedSignee?.fullname);
  return (
    <Tooltip
      key={item.id}
      content={`This place is for ${item?.signee?.fullname}`}
      isDisabled={item?.signee?.fullname === selectedSignee?.fullname}
    >
        {(update || !update) &&
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
          {imageBoxOpen  ? (
            <div className="w-full flex border border-dotted border-[#d3d3d3] items-center justify-center h-full" onClick={handleClick}>
              <input
              disabled={item?.signee?.fullname !== selectedSignee?.fullname}
                accept={item.accept?item.accept:"application/pdf,image/png,image/jpg"}
                // multiple={multiple}
                type="file"
                ref={fileInput}
                onChange={handleFileInputChange}
                // accept=".png"
                hidden
              />
              <Upload  />
              Upload
            </div>
          ) : (
            <span
              className="text-[10px] lg:text-[16px] whitespace-nowrap capitalize overflow-hidden"
              onClick={()=>{
                if(item?.signee?.fullname === selectedSignee?.fullname){
                  setImageBoxOpen(true)
                }
              }}
            >
              {item?.placeholder? item?.placeholder : item.field} &nbsp;
              ({item.file && item.file.name})
            </span>
          )}
        </div>
      </div>
        }
    </Tooltip>
  );
};

export default FileItem;
