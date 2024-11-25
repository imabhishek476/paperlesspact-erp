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
  Select,
  SelectItem,
} from '@nextui-org/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  ArrowBigLeft,
  Banknote,
  GripHorizontal,
  GripVertical,
  IndianRupee,
  Settings,
  X,
} from 'lucide-react';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import ResizeHandlers from './ResizeHandlers';
import { useTabsStore } from '../stores/useDocTabsStore';
import { usePageDataStore } from '../stores/usePageDataStore';
import { useDocHistory } from '../stores/useDocHistoryStore';

const PaymentFillableField = ({
  items,
  item,
  updateItem,
  setSelectedFieldItem,
  handleRemoveItem,
  data,
  recipients,
  sharedItems,
  updateSharedItem,
  pageOreintation,
  setSelectedItem,
}) => {
  const {addHistory}=useDocHistory()
  const [amount, setAmount] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [size,setSize] = useState(item.size);
  const [isHovered,setIsHovered] = useState(false);
  // const [value, setValue] = useState(new Set([]));
  const {attributes, listeners, setNodeRef, transform,isDragging} = useDraggable({
    id: item.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };
  const {isEditable} = usePageDataStore();
  const [value, setValue] = useState(item?.signee?.email);
  useEffect(()=>{
    // console.log(index);
    if(sharedItems){
      const yarray  = sharedItems.getArray('fillableFields');
      let index=-1;
      yarray.map((ele,idx)=>{
        if(item?.signee?.email===ele?.signee?.email){
          index = idx;
        }
      });
      // console.log(index);
      if(index!==-1){
        const yItem = yarray.get(index);
        if(yItem&&yItem?.signee?.email!==value){
          setValue([yItem?.signee?.email])
        }
      }
    }
  },[item?.signee?.email])
  // useEffect(()=>{
  //   updateItem({...item,size:size})
  //   addHistory({...item,size:size},"item","update",item)
  //   // setItems((prev)=>{
  //   //   const index = prev.findIndex((ele)=>ele?.id === item.id);
  //   //   if(index!==-1){
  //   //     prev[index] = {
  //   //       ...prev[index],
  //   //       size
  //   //     }
  //   //   }
  //   //   return prev.map((ele)=>ele);
  //   // })
  // },[size])
  const maxWidth = pageOreintation==='landscape'?1000:700;

  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: 80,
      }}
      maxWidth={maxWidth}
      size={sharedItems?{height:item.height,width:item.width}:{ height: item.size.height, width: item.size.width }}
      enable={
            {
              top:isEditable,
              left:isEditable,
              bottom:isEditable,
              right:isEditable,
              topLeft:isEditable,
              topRight:isEditable,
              bottomLeft:isEditable,
              bottomRight:isEditable
            }
          }
      onMouseOver={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
      onResizeStop={(e, direction, ref, d)=> { 
        // console.log(d.width);
        const width = item.size.width + d.width;
        const height = item.size.height + d.height;
        if(width>maxWidth){
          return {
            width:maxWidth,
            height:prev.height + d.height
          }
        }
        updateItem({ ...item, size: { width: width, height: height }})
        addHistory({ ...item, size: { width: width, height: height }}, "item", "update", item)
        // if(!sharedItems ){
        //   setSize((prev)=>{
        //     const width = prev.width + d.width;
        //     if(width>maxWidth){
        //       return {
        //         width:maxWidth,
        //         height:prev.height + d.height
        //       }
        //     }
        //     return {
        //       width:prev.width + d.width,
        //       height:prev.height + d.height
        //     }
        //   })
        // }else{
        //   updateSharedItem(sharedItems,{
        //     ...item,
        //     width:item.width
        //       ?(item?.width + d.width)>700
        //         ?700
        //           :item?.width + d.width
        //             :300+d.width,
        //     height:item.height?item?.height + d.height:80+d.height
        //   })
        // }
      }}
      boundsByDirection
      handleComponent={<ArrowBigLeft />}
      style={{
        position: 'absolute',
        top: item.position.y,
        left: item.position.x,
        zIndex: item?.layer+1||1,
        resize: 'horizontal',
        // position:'relative'
      }}
      className="resizableItem"
    >
      {!isDragging && isHovered && isEditable &&<span className='absolute w-full top-[-22.7px]  flex justify-end' >
          <p className='flex justify-center items-center gap-1 h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c] capitalize'>{item.title?item.title:'Payment'}
          <span
              className=" hover:cursor-pointer"
              //   onClick={() => handleRemoveItem(item)}
            >
              {isEditable &&
              <Popover placement="top" offset={4}>
                <PopoverTrigger>
                      <Settings className="w-4 h-4 text-black hover:text-white" />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="flex flex-col gap-4">
                      <TextField
                        sx={{ mb: 0, mt: 2, width: '100%' }}
                        label="Enter Amount*"
                        color="secondary"
                        size='small'
                        variant="outlined"
                        value={sharedItems?item.amount:item.amount}
                        onChange={(e) => {
                          if(!sharedItems){
                            console.log(item)
                            addHistory({...item, amount: e.target.value}, "item", "update", {...item,amount:null})
                            updateItem({...item, amount: e.target.value})
                          
                         
                            // setItems((prev) => {
                            //   const index = prev.findIndex(
                            //     (el) => el.id === item.id
                            //   );
                            //   if (index !== -1) {
                            //     const removed = prev.splice(index, 1);
                            //   }
                            //   prev.push({
                            //     ...item,
                            //     amount: e.target.value,
                            //   });
                            //   //   console.log(text, item);
  
                            //   return prev;
                            // });
                          }else{
                            updateSharedItem(sharedItems,{
                              ...item,
                              amount: e.target.value,
                            })
                          }
                          setAmount(e.target.value);
                        }}
                        name="amount"
                        id="amount"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '');
                          if (e.target.value.length > 0) {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            ).toString();
                            // .slice(0, 10);
                          }
                        }}
                        InputProps={{
                          inputProps: {
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <IndianRupee  className='w-4 h-4'/>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <input
                        type="date"
                        name="dueDate"
                        // forma
                        className='peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                        value={sharedItems?item.dueDate:item.dueDate}
                        onChange={(e) => {
                          if(sharedItems){
                            updateSharedItem(sharedItems,{
                              ...item,
                              dueDate: e.target.value,
                            });
                          }else{
                            updateItem({...item,dueDate: e.target.value})
                            addHistory({...item,dueDate: e.target.value}, "item", "update", {...item,dueDate:null})
                            // setItems((prev) => {
                            //   const index = prev.findIndex(
                            //     (el) => el.id === item.id
                            //   );
                            //   if (index !== -1) {
                            //     const removed = prev.splice(index, 1);
                            //   }
                            //   prev.push({
                            //     ...item,
                            //     dueDate: e.target.value,
                            //   });
                            //   //   console.log(text, item);
  
                            //   return prev;
                            // });
                          }
                          setDueDate(e.target.value);
                        }}
                      />
                    </div>
                    <Divider />
                    <div className="">
                    <Dropdown>
                        <DropdownTrigger>

                          <Button
                            variant="bordered"
                          >
                            {value ? value : "Select Recipeint"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={recipients?.filter((recipient) => recipient.signerRole !== "CC")}>
                          {recipients?.filter((recipient) => recipient.signerRole !== "CC")?.map((participant) => {
                            // console.log(participant)
                            return <DropdownItem
                              key={participant.email}
                              // color={participant.key === "delete" ? "danger" : "default"}
                              // className={participant.key === "delete" ? "text-danger" : ""}
                              onClick={() => {
                                if (sharedItems) {
                                  updateSharedItem(sharedItems, {
                                    ...item,
                                    signee: recipients?.find((el) => el.email === participant.email),
                                  })
                                } else {
                                  setValue(participant.email)
                                  // console.log(item?.participant.email)
                                  console.log(item)
                                  updateItem({...item,  signee: recipients?.find((el) => el.email === participant.email)})
                                  addHistory({...item,  signee: recipients?.find((el) => el.email === participant.email)}, "item", "update", item)
                                  // setItems((prev) => {
                                  //   const index = prev.findIndex(
                                  //     (el) => el.id === item.id
                                  //   );
                                  //   if (index !== -1) {
                                  //     const removed = prev.splice(index, 1);
                                  //   }
                                  //   prev.push({
                                  //     ...item,
                                  //     signee: recipients?.find((el) => el.email === participant.email),
                                  //   });
                                  //   return prev;
                                  // });
                                }
                              }}
                            >
                              {participant.email}
                            </DropdownItem>
                          })}
                          {/* {(item) => (
                            <DropdownItem
                              key={item.email}
                              // color={item.key === "delete" ? "danger" : "default"}
                              // className={item.key === "delete" ? "text-danger" : ""}
                              onClick={()=>setValue(item.value)}
                            >
                              {item.value}
                            </DropdownItem>
                          )} */}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              }
            </span>
            <span
              className="hover:cursor-pointer flex justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
                handleRemoveItem(item);
              }}
            >
              <X className="w-4 h-4 text-black hover:text-white" />
            </span>
          </p>
          </span>}
      <div
        //   key={item.id}
        style={{
          top: item.position.y,
          left: item.position.x,
          // width: '17%',
          // height: '3.6%',
          // resize:"horizontal",
          ...style,
              overflow: isDragging ? "hidden" : "auto",
              border: (isHovered || isDragging) && isEditable ? "3px solid #e8713c" : "3px solid #e8713c00",
          // backgroundColor: 'rgba(0, 112, 240, 0.2)',
          cursor: 'grap',
        }}
        // draggable="true"
        id={item.id}
        onClick={(e)=>{
          e.stopPropagation();
          setSelectedItem(item);
        }}
        // onDragStart={(e) => setSelectedFieldItem(item)}
        ref={setNodeRef}
            {...listeners}
            {...attributes}
            onBlur={() => {
              console.log("yay");
              const keyboardEvent = new KeyboardEvent("keydown", {
                code: "Escape",
                key: "Escape",
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true,
              });
              document.dispatchEvent(keyboardEvent);
            }}
        className={`flex p-1 px-3 w-full h-full text-[#151513] z-[49] items-center hover:cursor-pointer`}
      >
       {!isDragging && isHovered && isEditable &&
              <ResizeHandlers/>
            }
        <div className="relative w-full h-full flex justify-center items-center">
        {isEditable && 
            <GripVertical className="text-[#05686E]" />
            }

          <div className="flex flex-col items-center ">
            <Banknote />
            <span className="text-[10px] text-center">Click Here to Pay.</span>
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default PaymentFillableField;
