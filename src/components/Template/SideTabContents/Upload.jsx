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
  Skeleton,
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
  Info,
  MoreHorizontal,
  Play,
  Trash2,
  Upload,
  UploadCloud,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import GlobalTemplateTabs from "../TemplateComponents/GlobalTemplateTabs";
import TemplateList from "./TemplateList";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import { Alert, Divider } from "@mui/material";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import {
  documentUse,
  getDocumentsWithType,
  uploadDocument,
} from "../../../Apis/uploadDoc";
import { saveEnvelopeInTemplate } from "../../../Apis/template";
import { useDocItemStore } from "../stores/useDocItemStore";
import { useTabsStore } from "../stores/useDocTabsStore";
import { useDocHistory } from "../stores/useDocHistoryStore";


const UploadTab = ({
  setItems,
  setSelectedFieldItem,
  pageSize,
  setDocId,
  docDetails,
  setDocDetails,
  setIsLoading,
  serverData,
  setIsActiveUpload,
  activePageIndex
}) => {
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

  const uploadUserFile = async (data) => {
    setIsUploading(true)
    const res = await uploadDocument(data);
    if (res) {
      console.log(res)
      setUpdate(prev => !prev)
    }
    setIsUploading(false);
  };

  const handleUploadClick = (e) => {
    fileRef.current?.click();
  };

  const handleAddImages = async (images) => {
    console.log(images);
    const data = {
      documentFile: images,
      documentType: "image",
      documentName: images?.name,
      documentExtention: images?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1
    };
    await uploadUserFile(data);
    setSelected("image");
  };

  const handleAddVideo = async (video) => {
    const data = {
      documentFile: video,
      documentType: "video",
      documentName: video?.name,
      documentExtention: video?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1
    };
    await uploadUserFile(data);
    setVideoItems([
      ...videoItems,
      { url: URL.createObjectURL(video), file: video, type: "video" },
    ]);
    setSelected("video");
  };
  const handleAddAudio = async (audio) => {
    const data = {
      documentFile: audio,
      documentType: "audio",
      documentName: audio?.name,
      documentExtention: audio?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1
    };
    await uploadUserFile(data);
    setAudioItems([
      ...audioItems,
      { url: URL.createObjectURL(audio), file: audio, type: "audio" },
    ]);
    setSelected("audio");
  };
  const handleAddFile = async (file) => {

    const data = {
      documentFile: file,
      documentType: "application",
      documentName: file?.name,
      documentExtention: file?.type?.split("/")[1],
      documentDescription: "",
      isActive: 1,
    };
    await uploadUserFile(data);
    setSelected("application");
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
        } else if (isTypeFile(ele?.type)) {
          // console.log(ele);
          setSelected("application");
          return await handleAddFile(ele);
          // files.push(ele);
        } else {
          console.log("error");
        }
      })
    );
    // console.log(images);
  };

  const getDocuments = async (selected, pageNo, pageSize) => {
    console.log(pageNo, pageSize)
    const response = await getDocumentsWithType(selected, pageNo, pageSize);
    console.log(response)
    if (response) {
      if (selected === "image" && response?.data?.documents) {
        setImageItems(response?.data?.documents);
      }
      if (selected === "audio" && response?.data?.documents) {
        setAudioItems(response?.data?.documents);
      }
      if (selected === "video" && response?.data?.documents) {
        setVideoItems(response?.data?.documents);
      }
      if (selected === "application" && response?.data?.documents) {
        setFileItems(response?.data?.documents);
      }
      setLoading(false)
    }
  };

  useEffect(() => {
    if (selected) {
      getDocuments(selected, pageNo, size);
    }
  }, [selected, pageNo, pageSize, update, size]);

  return (
    <div className="px-2">
      <div className="grid grid-cols-12 p-5  border-b">
        <span
          className="bg-[#05686e] flex justify-center rounded-l-[4px] p-2 col-span-10 text-white hover:cursor-pointer"
          onClick={handleUploadClick}
        >
          Upload Files
        </span>
        <input type="file" hidden ref={fileRef} onChange={handleFileChange} />
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              className="col-span-2 bg-[#05686e] rounded-none rounded-r-[4px] border-l border-white"
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
      {
      // selected === "image" && <Alert icon={<Info size={15} />} severity="warning" className="font-semibold text-[11px]">
      //   Only jpeg,jpg & png images will show in pdf.
      // </Alert>
      }
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
              "gap-6 w-full relative rounded-none p-0 border-b border-divider justify-between",
            cursor: "w-full bg-[#E8713C]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#E8713C]",
          }}
        >
          <Tab
            disabled={isUploading}
            key="image"
            title={
              <div className="flex items-center space-x-2">
                {/* <GalleryIcon/> */}
                <span>Images</span>
              </div>
            }
          >
            <TabContents setSize={setSize} item={imageItems} size={size} loading={loading} isUploading={isUploading}  >
              {imageItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    setSelectedFieldItem={setSelectedFieldItem}
                    index={index}
                    setItems={setItems}
                    pageSize={pageSize}
                    setUpdate={setUpdate}
                    activePageIndex={activePageIndex}
                  />
                );
              })}
            </TabContents>
          </Tab>
          <Tab
            disabled={isUploading}
            key="video"
            title={
              <div className="flex items-center space-x-2">
                {/* <MusicIcon/> */}
                <span>Videos</span>
              </div>
            }
          >
            <TabContents item={videoItems} size={size} setSize={setSize} loading={loading} isUploading={isUploading} >
              {videoItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    setSelectedFieldItem={setSelectedFieldItem}
                    index={index}
                    setItems={setItems}
                    pageSize={pageSize}
                    setUpdate={setUpdate}
                    activePageIndex={activePageIndex}
                  />
                );
              })}
            </TabContents>
          </Tab>
          <Tab
            disabled={isUploading}
            key="audio"
            title={
              <div className="flex items-center space-x-2">
                {/* <VideoIcon/> */}
                <span>Audio</span>
              </div>
            }
          >
            <TabContents item={audioItems} size={size} setSize={setSize} loading={loading} isUploading={isUploading} >
              {audioItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    setSelectedFieldItem={setSelectedFieldItem}
                    index={index}
                    setItems={setItems}
                    pageSize={pageSize}
                    setUpdate={setUpdate}
                    activePageIndex={activePageIndex}
                  />
                );
              })}
            </TabContents>
          </Tab>
          <Tab
            disabled={isUploading}
            key="application"
            title={
              <div className="flex items-center space-x-2">
                {/* <VideoIcon/> */}
                <span>Files</span>
              </div>
            }
          >
            <TabContents item={fileItems} size={size} setSize={setSize} loading={loading} isUploading={isUploading} >
              {fileItems.map((ele, index) => {
                return (
                  <TabItem
                    isUploading={isUploading}
                    progressValue={progressValue}
                    key={index}
                    item={ele}
                    setSelectedFieldItem={setSelectedFieldItem}
                    index={index}
                    setItems={setItems}
                    pageSize={pageSize}
                    setUpdate={setUpdate}
                    setDocId={setDocId}
                    docDetails={docDetails}
                    setDocDetails={setDocDetails}
                    serverData={serverData}
                    setIsLoading={setIsLoading}
                    setIsActiveUpload={setIsActiveUpload}
                    activePageIndex={activePageIndex}
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

export default UploadTab;

const TabContents = ({ children, setSize, item, size, loading, isUploading }) => {

  return <div className="overflow-y-auto h-[calc(100vh-300px)]">
    <div className="grid grid-cols-12 gap-2 ">
      {loading ?
        Array.from(Array(8)).map((_, index) => (
          <Skeleton key={index} className="aspect-square col-span-6 p-1 rounded-lg" />
        )) : isUploading ?
          <>
            <div className="aspect-square col-span-6 p-1 rounded-lg flex flex-col items-center bg-gray-100 justify-between">
              <UploadCloud size={100} />
              <Progress
                aria-label="Downloading..."
                size="md"
                isIndeterminate
                className="max-w-md bg-[#808080] rounded-full"
              />
            </div>
            {children}
          </> : children}
    </div>
    {size <= item?.length && <div className="m-auto hover:cursor-pointer flex justify-center mt-2 hover:bg-gray-100 py-1" onClick={() => setSize((prev) => prev + 5)} >Load More</div>}

  </div>
};

const TabItem = ({
  item,
  setSelectedFieldItem,
  index,
  setItems,
  pageSize,
  progressValue,
  isUploading,
  setUpdate,
  setDocId,
  docDetails,
  setDocDetails,
  serverData,
  setIsLoading,
  setIsActiveUpload,
  activePageIndex
}) => {
  const {addHistory}=useDocHistory()
  const [isPopOpen, setPopIsOpen] = useState(false);
  const [updateDownload, setUpdateDownload] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addItem } = useDocItemStore();
  const { pageSetup } = useTabsStore();
  console.log(item)
  const field =
    item?.documentType === "image"
      ? {
        title: "Image",
        field: "inEditorImage",
        type: "inEditorImage",
        size: { height: 200, width: 250 },
        imageSize: {
          height: (300 / 1080) * 100,
          width: (300 / 768) * 100,
        },
        layer: 1,
      }
      : item?.documentType === "video" || item?.documentType === "audio"
        ? {
          title: "Video",
          field: "Video",
          type: "video",
          icon: <Video size={14} key={"videoIcon"} />,
          size: { height: 200, width: 250 },
        }
        : {
          title: "Image",
          field: "inEditorImage",
          type: "inEditorImage",
          size: { height: 50, width: 250 },
          imageSize: {
            height: (300 / 1080) * 100,
            width: (300 / 768) * 100,
          },
        };
  const handleDragStart = (e, item, index) => {
    setSelectedFieldItem({
      id: crypto.randomUUID(),
      ...field,
      link: item?.documentUrl,
      name: item?.documentName,
      documentId: item?.documentId
      // documentId:
    });
  };

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
      documentUrl: item?.documentUrl
    };
    console.log(data);
    const res = await uploadDocument(data);
    if (res) {
      setUpdate((prev) => !prev)
    }
  };

  const handleClickAdd = async (e, item, index) => {
    if (item?.documentType !== "application") {
      // setItems((prev) => {
      //   const pageWidth = parseInt(pageSize.width.split("px")[0]);
      //   const pageHeight = parseInt(pageSize.height.split("px")[0]);
      //   const posX = `${((pageWidth / 2 - 100) / pageWidth) * 100}%`;
      //   const posY = `${((pageHeight / 2 - 100) / pageHeight) * 100}%`;
      //   prev.push({
      //     id: crypto.randomUUID(),
      //     ...field,
      //     link: item?.documentUrl,
      //     pageIndex: 0,
      //     position: {
      //       x: posX,
      //       y: posY,
      //     },
      //     size: {
      //       height: 200,
      //       width: 200,
      //     },
      //   });
      //   return prev.map((ele) => ele);
      // });
      const pageWidth = parseInt(pageSetup?.size.width.split("px")[0]);
      const pageHeight = parseInt(pageSetup?.size.height.split("px")[0]);
      const posX = `${((pageWidth / 2 - 100) / pageWidth) * 100}%`;
      const posY = `${((pageHeight / 2 - 100) / pageHeight) * 100}%`;
      const newItem={
        id: crypto.randomUUID(),
        ...field,
        link: item?.documentUrl,
        name: item?.documentName,
        documentId: item?.documentId,
        layer: 1,
        pageIndex: activePageIndex,
        position: {
          x: posX,
          y: posY,
        },
        size: {
          height: 200,
          width: 200,
        },
      }
      addItem(newItem)
      addHistory(newItem,"item","add")
    } else {
      setIsLoading(true);
      setIsActiveUpload(true);
      const response = await documentUse(item);
      if (response) {
        const id = response?.data?._id;
        setDocId(id);
        setDocDetails({ ...docDetails, documents: response?.data });
        await saveEnvelopeInTemplate({
          templateId: serverData._id,
          envelopeId: id,
        });
      }
      setIsLoading(false);
    }
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
        className="col-span-6 p-1 rounded-lg bg-gray-50 relative group aspect-square flex justify-center h-full w-full"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, item, index)}
        onClick={(e) => {
          e.stopPropagation();
          if (item?.documentType !== "application") {
            handleClickAdd(e, item, index);
          }
        }}
      >     <Popover placement="bottom-start" isOpen={isPopOpen} onOpenChange={(open) => setPopIsOpen(open)}>

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
              <div className="px-3 pb-2 w-fit">
                <p className="font-semibold text-base">
                  {(item?.documentName?.length > 21) ? `${item?.documentName?.slice(0, 21)}...` : item?.documentName}
                  {/* {item?.documentName?.length > 25 ? `${item?.documentName?.slice(0, 25)}...` : item?.documentName?.replaceAll("_", " ")} */}
                </p>
              </div>
              <div className="border-b"></div>
              <a
                href={item?.documentUrl}
                download={item?.documentName}
                target="_blank"
              >
                <div
                  className="flex flex-row gap-2 p-4 items-center hover:bg-gray-200 h-5 hover:cursor-pointer rounded-sm bg-transparent transition-all duration-200"
                  onClick={(e) => { setPopIsOpen(false), e.stopPropagation() }}
                >
                  <ArrowDownToLine size={20} />
                  Download
                </div>
              </a>
              <div
                onClick={(e) => { handleDeleteDocument(e, item), setPopIsOpen(false) }}
                className="flex flex-row gap-2 p-4 items-center hover:bg-gray-200 hover:cursor-pointer h-5 rounded-sm bg-transparent"
              >
                <Trash2 size={20} /> Move to trash
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {console.log(item)}
        {item?.type === "image" || item?.documentType === "image" ? (
          <div className="relative ">
            <img
              alt={item?.file?.name || item?.documentName}
              src={item?.url || item?.documentUrl}
              className="w-full h-full object-contain border bg-gray-100"
            />

          </div>
        ) : (

          <>
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
              <Button
                size="sm"
                className="bg-[#05686E] flex flex-row gap-2 text-white h-6"
                onClick={onOpen}
              >
                {" "}
                <Play size={13} />
                Preview
              </Button>
            </div>

          </>

        )}
      </div>
    </>
  );
};
