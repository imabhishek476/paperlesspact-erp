import { Popover, TextField } from "@mui/material";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { ArrowBigLeft, Clipboard, Copy, CopyPlus, GripVertical, Trash2, Upload, X } from "lucide-react";
import { Resizable } from "re-resizable";
import React, { useEffect, useRef, useState } from "react";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import ResizeHandlers from "./ResizeHandlers";
import { useDocItemStore } from "../stores/useDocItemStore";
import { useTabsStore } from "../stores/useDocTabsStore";
import { usePageDataStore } from "../stores/usePageDataStore";
import { useDocHistory } from "../stores/useDocHistoryStore";
const InEditorImage = ({
  itemClicked,
  items,
  item,
  updateItem,
  setSelectedFieldItem,
  handleRemoveItem,
  data,
  recipients,
  sharedItems,
  updateSharedItem,
  setItemClicked,
  setMenuItem,
  setMenuOpen,
  pageOreintation,
  setSelectedItem,
}) => {
  const { addHistory } = useDocHistory()
  const [selected, setSelected] = useState("file");
  const [link, setLink] = useState(null);
  const [linkError, setLinkError] = useState(false);
  const [update, setUpdate] = useState(false);
  const { onClose, onOpen, onOpenChange, isOpen } = useDisclosure();
  const [size, setSize] = useState(item.size);
  const fileInput = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const {isEditable} = usePageDataStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addHistory({
        ...item, file: e.target.files[0], size: {
          height: 250,
          width: 250
        }
      }, "item", "update", item)
      updateItem({
        ...item, file: e.target.files[0], size: {
          height: 250,
          width: 250
        }
      })
      // setSize({
      //   height:250,
      //   width:250
      // })
    }
  };

  // useEffect(() => {
  // setSize(item.size)
  // const imageSize = {
  //   height: (size.height / 1080) * 100,
  //   width: (size.width / 768) * 100,
  // }
  // updateItem({...item,size:size,imageSize: imageSize})
  // addHistory({...item,size:size,imageSize: imageSize},"item","update",item)
  // setUpdate((prev) => !prev);
  // }, [item])

  useEffect(() => {
    if (link) {
      const expression =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const regex = new RegExp(expression);
      const match = regex.test(link);
      if (!match) {
        setLinkError(true);
      } else {
        setLinkError(false);
        addHistory({
          ...item, link: link, size: {
            height: 250,
            width: 250
          }
        }, "item", "update", item)
        updateItem({
          ...item, link: link, size: {
            height: 250,
            width: 250
          }
        })
        // setSize({
        //   height: 250,
        //   width: 250
        // })
      }
    }
  }, [link]);
  console.log(item)
  const maxWidth = pageOreintation === 'landscape' ? 1000 : 700;
  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: 50,
      }}
      // maxWidth={700}
      size={sharedItems ? { height: item.height, width: item.width } : (item?.from ? { height: item.size.height, width: item.size.width } : { height: item.size.height, width: item.size.width })}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      onResizeStop={(e, direction, ref, d) => {
        // console.log(d.width);
        const width = item.size.width + d.width;
        const height = item.size.height + d.height;
        if(width>maxWidth){
          return {
            width:maxWidth,
            height:prev.height + d.height
          }
        }
        const imageSize = {
          height: (height / 1080) * 100,
          width: (width / 768) * 100,
        }
        updateItem({ ...item, size: { width: width, height: height }, imageSize: imageSize })
        addHistory({ ...item, size: { width: width, height: height }, imageSize: imageSize }, "item", "update", item)
        // if (!sharedItems) {
        //   setSize((prev) => {
        //     const width = prev.width + d.width;
        //     if (item?.from) {
        //       return {
        //         width: Number(item.size.width) + d.width,
        //         height: Number(item.size.height) + d.height,
        //       };
        //     }
        //     else{
        //       return {
        //         width:prev.width + d.width,
        //         height: prev.height + d.height,
        //       }
        //     }
        //   });
        // } else {
        //   updateSharedItem(sharedItems, {
        //     ...item,
        //     width: item.width
        //       ? item?.width + d.width > maxWidth
        //         ? maxWidth
        //         : item?.width + d.width
        //       : 300 + d.width,
        //     height: item.height ? item?.height + d.height : 50 + d.height,
        //   });
        // }
      }}
      onResizeStart={(e) => {
        // console.log(e)
        setMenuOpen(false)
        setItemClicked(false)
      }}
      boundsByDirection
      handleComponent={<ArrowBigLeft />}
      style={{
        position: "absolute",
        top: item.position.y,
        left: item.position.x,
        zIndex: item?.layer + 1 || 1,
        resize: "horizontal",
        // position:'relative'
      }}
      className="resizableItem"
    >

      {(update || !update) && (
        <>
          {!isDragging && isHovered && isEditable &&
            <span className="absolute   w-full top-[-22.7px]  flex justify-end">
              <p className="flex justify-center h-fit text-[11px] text-white px-[6px] py-[2px] bg-[#e8713c] capitalize">
                {item.title ? item.title : "Video"}
                <span
                  className="hover:cursor-pointer ps-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                    addHistory(item, "item", "delete")
                    handleRemoveItem(item)
                  }}
                >
                  <X className="w-4 h-4 text-black hover:text-white" />
                </span>

              </p>
            </span>

          }
          <div
            //   key={item.id}
            style={{
              ...style,
              overflow: isDragging ? "hidden" : "auto",
              top: item.position.y,
              left: item.position.x,
              // width: '17%',
              // height: '3.6%',
              // resize:"horizontal",
              // backgroundColor: 'rgba(0, 112, 240, 0.2)',
              cursor: "grap",
              border : (isHovered || isDragging) && isEditable ? "3px solid #e8713c" : "3px solid #e8713c00"
            }}
            id={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}
            // onDragStart={(e) => setSelectedFieldItem(item)}
            ref={setNodeRef} {...listeners} {...attributes}
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
            className={`flex  w-full h-full text-[#151513] z-[49] items-center hover:cursor-pointer`}
          >
            {/* {isHovered && ( */}
            {!isDragging && isHovered && isEditable && 
              <ResizeHandlers/>
            }
            <div
              onContextMenu={(e) => {
                if(!item?.from){
                  e.preventDefault();
                  setItemClicked(true);
                  setMenuItem(item)
                }
              }}
              className="relative w-full h-full flex justify-center items-center">
              {/* <GripVertical className="text-[#05686E]" /> */}
              {!(item?.file || item?.link) && isEditable&&  (
                <span className="text-[12px] break-all z-[100]" onClick={onOpen}>
                  Click here to add image link/file.
                </span>
              )}
              {/* {item.link} */}
              {(item?.file || item?.link) && (
                <img
                  src={item?.link ? item?.link : URL.createObjectURL(item?.file)}
                  alt=""
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  className="block cursor-move" />
              )}
              {/* <Popover
                id={item.id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                // anchorPosition={{ top: points.y, left: points.x }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                // anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                disableAutoFocus
              >
                <ul>
                  <li>Edit</li>
                  <li>Copy</li>
                  <li>Delete</li>
                </ul>
              </Popover> */}


            </div>
          </div>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add Image
                  </ModalHeader>
                  <ModalBody>
                    <div className="w-full flex flex-col gap-4">
                      <RadioGroup
                        label="Select video input type."
                        orientation="horizontal"
                        color="secondary"
                        value={selected}
                        onValueChange={setSelected}
                      >
                        <Radio value="file">File</Radio>
                        <Radio value="link">Link</Radio>
                      </RadioGroup>
                      {selected === "link" ? (
                        <>
                          <TextField
                            sx={{ mb: 0, width: "100%" }}
                            label="Enter Link*"
                            color="secondary"
                            size="small"
                            variant="outlined"
                            value={link}
                            onChange={(e) => {
                              setLink(e.target.value);
                            }}
                            name="link"
                            id="link"
                            error={linkError}
                            helperText={linkError && (
                              <span className="text-danger">
                                Please enter valid link.
                              </span>
                            )} />
                        </>
                      ) : (
                        <div
                          className="flex items-center gap-2 cursor-pointer border-dashed border-2 p-2 justify-start"
                          onClick={handleClick}
                        >
                          <input
                            // accept={accept}
                            // multiple={multiple}
                            type="file"
                            ref={fileInput}
                            onChange={handleFileInputChange}
                            accept="image/png"
                            //   className='w-full'
                            hidden />
                          <Upload sx={{ fontSize: "40px" }} />
                          {!item.file && !item.link && <span>Upload</span>}
                          {console.log(item.link)}
                          {(item?.file || item?.link) && (
                            <img
                              src={item?.link
                                ? item?.link
                                : URL.createObjectURL(item?.file)}
                              alt=""
                              className=" w-[75px] md:w-[100px] lg:w-[150px] block" />
                          )}
                        </div>
                      )}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </Resizable>

  );
};

export default InEditorImage;
