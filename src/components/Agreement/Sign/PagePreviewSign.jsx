import NextImage from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate } from '@/Utils/dateTimeHelpers';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tooltip,
} from '@nextui-org/react';
import Toolbar from '../Prepare/Toolbar';
import { InputAdornment, TextField } from '@mui/material';
import { ArrowBigRight } from 'lucide-react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ItemRenderer from '../Items/ItemRenderer';

const colors = [
  {
    color: 'rgba(0, 112, 240,0.2)',
    variant: 'primary',
  },
  {
    color: 'rgba(245, 165, 36,0.2)',
    variant: 'warning',
  },
  {
    color: 'rgba(243, 83, 96,0.2)',
    variant: 'danger',
  },
];

const fieldNames = ['Signature', 'Initials', 'Date Signed'];

const PagePreviewSign = ({
  documentPages,
  currentPageIndex,
  items,
  setItems,
  handleAdditem,
  handleRemoveItem,
  offsetX,
  offsetY,
  setOffsetX,
  setOffsetY,
  selectedFieldItem,
  setSelectedFieldItem,
  onOpen,
  selectedSignee,
  update,
  setUpdate,
  signees,
  stampPages
}) => {
  const imageRef = useRef(null);
  const [widthPerct, setWidthPerct] = useState(100);
  const [textBoxOpen, setTextBoxOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [text, setText] = useState(null);
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
              if (prev.some((el) => el.id === selectedFieldItem?.id)) {
                const index = prev.findIndex(
                  (el) => el.id === selectedFieldItem.id
                );
                console.log(index);
                const temp = prev.filter(
                  (item) => item.id !== selectedFieldItem.id
                );
                console.log(temp);
                // console.log(bigImage);
                temp.push({
                  ...selectedFieldItem,
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
  const onDateHandler = (item) => {
    setItems((prev) => {
      const index = prev.findIndex((el) => el.id === item.id);
      if (index !== -1) {
        const removed = prev.splice(index, 1);
      }
      const date = formatDate(new Date());
      console.log(date);
      prev.push({
        ...item,
        text: date,
      });
      setSelectedFieldItem(null);
      return prev;
    });
    setUpdate((prev) => !prev);
  };

  useEffect(() => {
    if (currentPageIndex !== -1 && imageRef && imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPageIndex]);
  return (
    <div className=" relative  flex flex-col gap-4 col-span-12 lg:col-span-8 h-full bg-gray-50 overflow-y-auto border-t border-gray-400">
      <>
        <span className="hidden z-[30]  border-r-0 bg-[#151513]   right-10 top-[0.1px]   w-auto items-center h-auto p-2">
          <p className="p-1 text-[12px]  text-white ">{widthPerct}%</p>
          <p
            className=" p-1 text-white text-[12px] hover:cursor-pointer text-center   "
            size="sm"
            onClick={() => handleZoomIn()}
          >
            <ZoomInIcon className="fill-white text-[18px]" />
          </p>
          <p
            className="p-1  text-white text-[12px] hover:cursor-pointer text-center  "
            size="sm"
            onClick={() => handleZoomOut()}
          >
            <ZoomOutIcon className="fill-white text-[18px]" />
          </p>
        </span>
        <span className="flex  sticky justify-between lg:hidden z-30  border-r-0 bg-gray-100   right-10 top-[0.1px]   w-auto items-center h-auto p-2">
          {/* <Dropdown showArrow>
            <DropdownTrigger> */}
          <div
            style={{
                backgroundColor:selectedSignee?selectedSignee?.color:signees[0]?.color
            }}
            className={`flex items-center p-3 bg-gray-50 gap-3 hover:cursor-pointer rounded-lg border `}
          >
            <Avatar
              isBordered
              color={selectedSignee && selectedSignee?.variant}
              src={selectedSignee && selectedSignee?.profileImgUrl}
              // size="sm"
              className="w-5 h-5 text-tiny"
            />
            {selectedSignee && selectedSignee?.fullname}
          </div>
          {/* </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              onAction={(index) => setSelectedSignee(signees[index])}
            ></DropdownMenu>
          </Dropdown> */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Action</Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
            >
              {fieldNames.map((field, index) => {
                return (
                  items.some((ele) => ele.field === field) && (
                    <DropdownItem
                      key={index}
                      endContent={
                        <Tooltip
                          color={selectedSignee?.variant}
                          showArrow={true}
                          content={`${items.reduce((total, ele) => {
                            if (
                              ele.field === field &&
                              ele.signee?.fullname === selectedSignee?.fullname
                            ) {
                              return total + 1;
                            }
                            return total;
                          }, 0)} places`}
                          // classNames={{
                          //     content:{selectedSignee?.color?`bg-[${selectedSignee}]`:"bg-[white]"}
                          // }}
                        >
                          <span className="flex justify-center items-center  bg-[#E7781380] rounded-[50%] h-[25px] w-[25px]  p-2 text-white text-[16px]">
                            {items.reduce((total, ele) => {
                              if (
                                ele.field === field &&
                                ele.signee?.fullname ===
                                  selectedSignee?.fullname
                              ) {
                                return total + 1;
                              }
                              return total;
                            }, 0)}
                          </span>
                        </Tooltip>
                      }
                      // className={`flex items-center p-3 bg-gray-50 gap-3 hover:cursor-pointer rounded-lg border `}
                    >
                      {field}
                    </DropdownItem>
                  )
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </span>
      </>
      <div className="flex flex-col gap-15 items-center justify-center px-10 pt-[50px] mb-16">
        {stampPages&&stampPages.length>0&&stampPages.map((ele,index)=>{
           return (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              {(update || !update) && (
                <div className="relative">
                  <img
                    src={ele}
                    width={`${widthPerct}%`}
                    alt={`${index} image`}
                    ref={index === currentPageIndex ? imageRef : null}
                    //   className="z-[-1]"
                    id={`page-${index}`}
                  />
                </div>
              )}
              <p>{index + 1}</p>
            </div>
          );
        })}
        {documentPages &&
          documentPages.length > 0 &&
          documentPages.map((page, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center"
              >
                {(update || !update) && (
                  <div className="relative">
                    <img
                      src={page}
                      width={`${widthPerct}%`}
                      alt={`${index} image`}
                      ref={index === currentPageIndex ? imageRef : null}
                      //   className="z-[-1]"
                      id={`page-${index}`}
                    />
                    {items?.length > 0 &&
                      items?.map((item, itemIndex) => {
                        if (item.pageIndex === index) {
                          return (
                            <ItemRenderer
                              key={item.id}
                              selectedSignee={selectedSignee}
                              setSelectedFieldItem={setSelectedFieldItem}
                              item={item}
                              signees={signees}
                              onOpen={onOpen}
                              setUpdate={setUpdate}
                              selectedFieldItem={selectedFieldItem}
                              setItems={setItems}
                            />
                          );
                        }
                      })}
                  </div>
                )}
                <p>{stampPages&&stampPages.length>0?stampPages.length+index+1:index + 1}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PagePreviewSign;
