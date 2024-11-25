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

const ImageItem = ({
  item,
  setItems,
  setSelectedFieldItem,
  selectedFieldItem,
  selectedSignee,
  setUpdate,
  colors,
  signees,
}) => {
  const [image, setImage] = useState(null);
  const [imageBoxOpen, setImageBoxOpen] = useState(false);

  const fileInput = useRef(null);
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleFileInputChange = async (e) => {
    console.log(fileInput.current.value);
    if (e.target.files && e.target.files.length > 0) {
      const img = new Image();
      img.onload = async function () {
        console.log('yay');
        const canvas2 = document.createElement('canvas');
        canvas2.setAttribute('width', 150);
        canvas2.setAttribute('height', 150);
        const ctx2 = canvas2.getContext('2d');
        // ctx2.drawImage(img, 5, 10, 200,61);
        ctx2.drawImage(img, 0, 0, 100, 100);
        const dataUrl2 = canvas2.toDataURL();
        await fetch(dataUrl2)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], 'sample.png', { type: blob.type });
            console.log(file);
            // onSign(file, all);
            setItems((prev) => {
              console.log(prev.map((el) => el.id));
              console.log(item.id);
              prev.some((el) => {
                console.log(el.id);
                console.log(item?.id);
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
                  image: file,
                });
                console.log(temp);
                return temp;
              } else {
                return prev;
              }
            });
            setImageBoxOpen(false);
          });
      };
      img.src = URL.createObjectURL(e.target.files[0]);
    }
    // fileInput.current.value = null
  };
  console.log(item);
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
          width: (item?.size ? `${item?.size?.width * 100 / 768}%` : '20%'),
          height: (item?.size ? `${item?.size?.height * 100 / 1080}%` : '3.6%'),
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
          {item.type === 'image' && imageBoxOpen ? (
            <div className="w-full flex border border-dotted border-[#d3d3d3] items-center justify-center h-full">
              <input
              disabled={item?.signee?.fullname !== selectedSignee?.fullname}
                // accept={accept}
                // multiple={multiple}
                type="file"
                ref={fileInput}
                onChange={handleFileInputChange}
                accept="image/png"
                hidden
              />
              <Upload onClick={handleClick} />
              Upload
            </div>
          ) : (
            <span
              className="text-[10px] lg:text-[16px] whitespace-nowrap"
              onClick={()=>{
                if(item?.signee?.fullname === selectedSignee?.fullname){
                  setImageBoxOpen(true)
                }
              }}
            >
              {item.image || image ? (
                <img
                  src={
                    item.image && typeof item.image === 'string'
                      ? item.image
                      : URL.createObjectURL(item.image)
                  }
                  alt=""
                  className=" w-[75px] md:w-[100px] lg:w-[150px] block"
                />
              ) : (
                item.field
              )}
            </span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default ImageItem;
