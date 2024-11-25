import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Tab,
  Tabs,
  image,
  useDisclosure,
} from "@nextui-org/react";
import {
  ArrowDownToLine,
  FileMusic,
  FileText,
  FileVideo2,
  FileVolume,
  MoreHorizontal,
  Play,
  Trash2,
  Upload,
  UploadCloud,
  Video,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useRef, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import { Divider } from "@mui/material";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import {
  documentUse,
  getDocumentsWithType,
  uploadDocument,
} from "../../../Apis/uploadDoc";
import { saveEnvelopeInTemplate } from "../../../Apis/template";
import { useItemStore } from "../stores/useItemStore";
import { usePageStore } from "../stores/usePageStore";
import { usePresHistory } from "../stores/usePresHistoryStore";

const UploadsTab = ({}) => {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState("image");
  const [imageItems, setImageItems] = useState([]);
  const [audioItems, setAudioItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [fileItems, setFileItems] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [update, setUpdate] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [size, setSize] = useState(10);
  const [isDragging, setIsDragging] = useState(false);

  const uploadUserFile = async (data) => {
    const res = await uploadDocument(data);
    if (res) {
      setUpdate((prev) => !prev);
    }
    setIsUploading(false);
  };

  const handleUploadClick = (e) => {
    fileRef.current?.click();
  };

  const handleAddImages = async (images) => {
    console.log(images);
    setIsUploading(true);
    const data = {
      documentFile: images,
      documentType: "image",
      documentName: images?.name,
      documentExtention: images?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1,
    };
    await uploadUserFile(data);
    //   setImageItems([
    //     ...imageItems,
    //     { url: URL.createObjectURL(images), file: images, type: "image" },
    //   ]);
    setSelected("image");
    // setImageItems((prev) => {
    //   images.map((ele) => {
    //     prev.push({
    //       url: URL.createObjectURL(ele),
    //       file: ele,
    //       type: "image"
    //     });
    //   });
    //   console.log(prev);
    //   return prev.map((ele) => ele);
    // });
  };

  const handleAddVideo = async (video) => {
    setIsUploading(true);
    const data = {
      documentFile: video,
      documentType: "video",
      documentName: video?.name,
      documentExtention: video?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1,
    };
    await uploadUserFile(data);
    setVideoItems([
      ...videoItems,
      { url: URL.createObjectURL(video), file: video, type: "video" },
    ]);
    setSelected("video");
    console.log(video);
    // setVideoItems((prev) => {
    //   video.map((ele) => {
    //     prev.push({
    //       url: URL.createObjectURL(ele),
    //       file: ele,
    //       type: "video"
    //     });
    //   });
    //   console.log(prev);
    //   return prev.map((ele) => ele);
    // });
  };
  const handleAddAudio = async (audio) => {
    // console.log(audio);
    setIsUploading(true);
    const data = {
      documentFile: audio,
      documentType: "audio",
      documentName: audio?.name,
      documentExtention: audio?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1,
    };
    await uploadUserFile(data);
    setAudioItems([
      ...audioItems,
      { url: URL.createObjectURL(audio), file: audio, type: "audio" },
    ]);
    setSelected("audio");
    // setAudioItems((prev) => {
    //   audio.map((ele) => {
    //     prev.push({
    //       url: URL.createObjectURL(ele),
    //       file: ele,
    //       type: "audio"
    //     });
    //   });
    //   console.log(prev);
    //   return prev.map((ele) => ele);
    // });
  };

  const isTypeImage = (type) => {
    return type.includes("image/");
  };
  const isTypeVideo = (type) => {
    return type.includes("video/");
  };
  const isTypeAudio = (type) => {
    return type.includes("audio/");
  };
  const isTypeFile = (type) => {
    return type.includes("application/pdf");
  };

  const handleFileChange = async (e) => {
    const inputFiles = Array.from(e.target.files);
    console.log(inputFiles);
    const promises = Promise.all(
      inputFiles.map(async (ele) => {
        if (isTypeImage(ele?.type)) {
          // await handleAddImages(ele);
          // images.push(ele);

          return await handleAddImages(ele);
        } else if (isTypeVideo(ele?.type)) {
          setSelected("video");
          return await handleAddVideo(ele);
          // videos.push(ele);
        } else if (isTypeAudio(ele?.type)) {
          setSelected("audio");
          return await handleAddAudio(ele);
          // audio.push(ele);
        } else {
          console.log("error");
        }
      })
    );
    // console.log(images);
  };

  const getDocuments = async (selected, pageNo, pageSize) => {
    const response = await getDocumentsWithType(selected, pageNo, pageSize);
    if (response) {
      if (selected === "image" && response?.data?.documents) {
        setImageItems(response?.data?.documents);
      }
      if (selected === "video" && response?.data?.documents) {
        setVideoItems(response?.data?.documents);
      }
    }
  };

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setProgressValue((v) => (v >= 80 ? 0 : v + 10));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (selected) {
      getDocuments(selected, pageNo, size);
    }
  }, [selected, pageNo, size, update]);

  useEffect(() => {
    if (progressValue === 80) {
      setIsUploading(false);
    }
  }, [progressValue]);
  // console.log(progressValue);
  return (
    <div>
      <div className="grid grid-cols-12 p-5 border-b">
        <Button
          radius="none"
          className="bg-[#05686e] flex justify-center rounded-l-[8px] p-2 col-span-10 text-white hover:cursor-pointer"
          onPress={handleUploadClick}
        >
          Upload Files
        </Button>
        <input type="file" hidden ref={fileRef} onChange={handleFileChange} />
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              className="col-span-2 bg-[#05686e] rounded-none rounded-r-[8px] border-l border-white"
              isIconOnly
            >
              <MoreHorizontal color="#fff" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-md">
            <div className="py-2 px-1 flex flex-col gap-2">
              <div
                onClick={handleUploadClick}
                className="flex flex-row gap-2 p-4 items-center hover:bg-gray-200 h-5 hover:cursor-pointer rounded-sm bg-transparent transition-all duration-200"
              >
                <UploadCloud size={20} /> Upload
              </div>
              <div className="flex flex-row gap-2 px-4 pt-4 items-center h-5 rounded-sm bg-transparent ">
                <AddToDriveIcon size={20} /> Google Drive
              </div>
              <p variant="bordered" className="text-[10px] self-end">
                coming Soon
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className=" w-full">
        <Tabs
          selectedKey={selected}
          onSelectionChange={setSelected}
          aria-label="Options"
          color="primary"
          variant="underlined"
          classNames={{
            base: "w-full",
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#E8713C]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#E8713C]",
          }}
        >
          <Tab
            key="image"
            title={
              <div className="flex items-center space-x-2">
                {/* <GalleryIcon/> */}
                <span>Images</span>
              </div>
            }
          >
            <TabContents item={imageItems} size={size} setSize={setSize} isDragging={isDragging}>
              {imageItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    index={index}
                    setIsDragging={setIsDragging}
                    setUpdate={setUpdate}
                  />
                );
              })}
            </TabContents>
          </Tab>
          <Tab
            key="video"
            title={
              <div className="flex items-center space-x-2">
                {/* <MusicIcon/> */}
                <span>Videos</span>
              </div>
            }
          >
            <TabContents item={videoItems} size={size} setSize={setSize} isDragging={isDragging}>
              {videoItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    index={index}
                    setUpdate={setUpdate}
                    setIsDragging={setIsDragging}
                  />
                );
              })}
            </TabContents>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default UploadsTab;

const TabContents = ({ children, setSize, item, size, isDragging, setIsDragging }) => {
  return (
    <div style={{
      overflowY : !isDragging && "auto"
    }} className=" h-[calc(100vh-200px)]">
      <div id="scrollableDiv" className="grid grid-cols-12 gap-2 ">
        {children}
      </div>
      {size <= item?.length && (
        <div
          className="m-auto hover:cursor-pointer flex justify-center mt-2 hover:bg-gray-100 py-1"
          onClick={() => setSize((prev) => prev + 5)}
        >
          Load More
        </div>
      )}
    </div>
  );
};

const TabItem = ({ item, index, progressValue, isUploading, setUpdate,setIsDragging }) => {
  const [isPopOpen, setPopIsOpen] = useState(false);
  const [updateDownload, setUpdateDownload] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addItem, selectedItem ,handleDrop} = useItemStore();
  const { selectedPage ,Isdragging, setIsDragginginStore} = usePageStore();
  const {addHistory} = usePresHistory()
  const handleDownload = (item) => {
    setUpdateDownload((prev) => !prev);
  };

  const handleDeleteDocument = async (e, item) => {
    e.stopPropagation();
    const data = {
      documentType: item?.documentType,
      documentName: item?.documentName,
      documentExtention: item?.documentExtension,
      documentDescription: item?.documentDescription,
      isActive: 0,
      documentId: item?.documentId,
    };
    console.log(data);
    const res = await uploadDocument(data);
    if (res) {
      setUpdate((prev) => !prev);
    }
  };
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item?.updatedDate,
      data: {
        type: item.documentType,
        link: item.documentUrl,
        size:
          item.documentType === "video"
            ? {
                height: "50%",
                width: "50%",
              }
            : {
                height: "50%",
                width: "50%",
              },
        options: item.documentType === "image" && {
          radius: "0",
          opacity: "1",
        },
      },
    });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  useEffect(()=>{
    setIsDragging(isDragging)
    setIsDragginginStore(isDragging)
  },[isDragging])
  const handleClickAdd = async (e, item, index) => {
    const container = document.getElementById("currentPage");
    const { x, y, height, width } = container?.getBoundingClientRect();
    const posX = Math.floor(((width / 2 - 100) / width) * 100) + "%";
    const posY = Math.floor(((height / 2 - 100) / height) * 100) + "%";
    let transformStr;
    let transformObject;
    if (container) {
      transformStr = `translate(${width / 2}px,${height / 2}px)`;
      transformObject ={
        translate:[width/2,height/2,0],
        rotate:0
      }

    }

    const size =
      item.documentType === "video"
        ? {
            height: "50%",
            width: "50%",
          }
        : {
            height: "50%",
            width: "50%",
          };
    const base = {
      id: crypto.randomUUID(),
      type: item.documentType,
      link: item.documentUrl,
      position: {
        posX: posX,
        posY: posY,
      },
      size: size,
      transformStr: transformStr,
      transformObject:transformObject,
      options: item.documentType === "image" && {
        radius: "0",
        opacity: "1",
      },
      pageIndex: selectedPage?.pageIndex,
    };
    handleDrop(  selectedPage.pageIndex,{
      posX: posX,
      posY: posY,
    },base,addHistory)
    
    // addItem(base);
  };

  return (
    <>
      <Modal size={"3xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 capitalize">
                {item?.documentName.replaceAll("_", " ")}
              </ModalHeader>
              <ModalBody className="py-1 items-center lg:h-[600px] h-full">
                {item?.documentType === "video" && (
                  <video
                    width="100%"
                    height="100%"
                    controls
                    className="aspect-video"
                  >
                    <source
                      src={item?.documentUrl}
                      type={`${item?.documentType}/${item?.documentExtension}`}
                    ></source>
                  </video>
                )}
                {item?.documentType === "application" && (
                  <iframe
                    loading="lazy"
                    className="w-full h-full lg:h-[60vh] items-center"
                    src={item?.documentUrl}
                    width="100%"
                    height="100%"
                  ></iframe>
                )}
                {item?.documentType === "audio" && (
                  <audio controls className="w-full">
                    <source
                      src={item?.documentUrl}
                      type={`${item?.documentType}/${item?.documentExtension}`}
                    ></source>
                  </audio>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickAdd(e, item, index);
                    onClose();
                  }}
                  className="bg-[#05686e] text-white"
                >
                  Use
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div
        className="col-span-6 p-1 rounded-lg bg-gray-50 relative height-[15%] group aspect-square flex justify-center "
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          ...style,
          overflow: "hidden",
          cursor: "grab",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (item?.documentType !== "application") {
            handleClickAdd(e, item, index);
          }
        }}
      >
        <Popover
          isOpen={isPopOpen}
          onOpenChange={(open) => setPopIsOpen(open)}
          placement="bottom-start"
        >
          <PopoverTrigger className="absolute top-1 right-1 group-hover:flex hidden transition-all duration-300">
            <Button
              isIconOnly
              aria-label="more"
              size="sm"
              className="h-6 bg-gray-300 border rounded-sm"
            >
              <MoreHorizIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-md max-w-[230px]">
            <div className="py-2 px-1 flex flex-col gap-2">
              <div className="px-3 border-b pb-2 w-fit">
                <p className="font-semibold text-base max-w-[200px] truncate">
                  {item?.documentName?.replaceAll("_", " ")}
                </p>
              </div>
              <a
                href={item?.documentUrl}
                download={item?.documentName}
                target="_blank"
              >
                <div
                  className="flex flex-row gap-2 p-4 items-center hover:bg-gray-200 h-5 hover:cursor-pointer rounded-sm bg-transparent transition-all duration-200"
                  onClick={(e) => {
                    setPopIsOpen(false), e.stopPropagation();
                  }}
                >
                  <ArrowDownToLine size={20} />
                  Download
                </div>
              </a>
              <div
                onClick={(e) => {
                  handleDeleteDocument(e, item), setPopIsOpen(false);
                }}
                className="flex flex-row gap-2 p-4 items-center hover:bg-gray-200 hover:cursor-pointer h-5 rounded-sm bg-transparent"
              >
                <Trash2 size={20} /> Move to trash
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {item?.type === "image" || item?.documentType === "image" ? (
          <div className="relative w-full h-full">
            <img
              alt={item?.file?.name || item?.documentName}
              src={item?.url || item?.documentUrl}
              className="w-full h-full object-fill object-center border bg-gray-100"
            />
            {isUploading && (
              <Progress
                aria-label="Uploading..."
                size="sm"
                value={progressValue}
                classNames={{
                  base: "max-w-md",
                  track: "bg-white",
                  indicator: "bg-[#05686E]",
                }}
                className="max-w-md absolute bottom-2 px-2"
              />
            )}
          </div>
        ) : (
          <div className="bg-gray-100 w-full h-full flex gap-1 flex-col overflow-hidden py-2 border items-center">
            <p className="text-sm capitalize">
              {item?.file?.name.replaceAll("_", " ")?.slice(0, 15) ||
                item?.documentName.replaceAll("_", " ")?.slice(0, 15)}
              {(item?.file?.name?.length > 15 ||
                item?.documentName?.length > 15) &&
                "..."}
            </p>
            {(item?.type === "video" || item?.documentType === "video") && (
              <FileVideo2 strokeWidth={0.7} size={60} />
            )}
            {(item?.type === "audio" || item?.documentType === "audio") && (
              <FileMusic strokeWidth={0.7} size={60} />
            )}
            {(item?.type === "application/pdf" ||
              item?.documentType === "application") && (
              <FileText strokeWidth={0.7} size={60} />
            )}
            {isUploading ? (
              <Progress
                aria-label="Uploading..."
                size="sm"
                value={progressValue}
                classNames={{
                  base: "max-w-md",
                  track: "bg-white",
                  indicator: "bg-[#05686E]",
                }}
                className="max-w-md absolute bottom-2 px-2"
              />
            ) : (
              <Button
                size="sm"
                className="bg-[#05686E] flex flex-row gap-2 text-white h-6"
                onClick={onOpen}
              >
                {" "}
                <Play size={13} />
                Preview
              </Button>
            )}
          </div>
        )}
        {/* {item?.type === "video" && (
            <div className="bg-gray-100 w-full flex gap-2 flex-col overflow-hidden py-4 border justify-center  items-center">
              <p className="text-sm capitalize">{item?.file?.name.replaceAll("_", " ")?.slice(0, 15)}{item?.file?.name?.length > 15 && "..."}</p>
              <Button size="sm" className="bg-[#05686E] flex flex-row gap-2 text-white h-7" onClick={onOpen}> <Play size={15} />Preview</Button>
            </div>
          )}
          {item?.type === "audio" && (
           <div className="bg-gray-100 w-full flex gap-2 flex-col overflow-hidden py-4 border justify-center  items-center">
           <p className="text-sm capitalize">{item?.file?.name.replaceAll("_", " ")?.slice(0, 15)}{item?.file?.name?.length > 15 && "..."}</p>
           <Button size="sm" className="bg-[#05686E] flex flex-row gap-2 text-white h-7" onClick={onOpen}> <Play size={15} />Preview</Button>
         </div>
          )}
          {item?.type === "application/pdf" && (
  
            <div className="bg-gray-100 flex gap-2 flex-col overflow-hidden py-4border justify-center items-center w-full">
              <p className="text-sm  capitalize">{item?.file?.name?.replaceAll("_", " ")?.slice(0, 15)}{item?.file?.name?.length > 15 && "..."}</p>
              <Button onClick={onOpen} size="sm" className="bg-[#05686E] flex flex-row gap-2 text-white h-7"> <Play size={15} />Preview</Button>
            </div>
          )} */}
      </div>
    </>
  );
};
