import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Tab,
  Tabs,
  User,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useUserStore } from "./stores/userDetailStore";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  Download,
  FileJson,
  FileText,
  Info,
  Maximize,
  PictureInPicture,
  Play,
  Presentation,
  Save,
  Share,
  Upload,
} from "lucide-react";
import PresenterModal from "./PresentationView/PresenterModal";
import { usePageStore } from "./stores/usePageStore";
import { useItemStore } from "./stores/useItemStore";
import { downloadPresentationPDF, updatePresentation } from "../../Apis/presentation";
import Image from "next/image";
import { Alert } from "@mui/material";

const fileTypes = [
  {
    title: "PDF",
    key: "pdf",
    icon: <FileText size={14} />,
  },
  {
    title: "JSON",
    key: "json",
    icon: <FileJson size={14} />,
  },
  // {
  //   title:"PDF",
  //   key:"pdf"
  // },
];

const PresentDropdown = ({ onOpen, selected, setSelected }) => {
  const [popOverOpen, setPopOverOpen] = useState(false);
  return (
    <Popover
      placement="bottom-end"
      onOpenChange={(isOpen) => setPopOverOpen(isOpen)}
      isOpen={popOverOpen}
    >
      <PopoverTrigger>
        <Button
          size="sm"
          variant="bordered"
          className="border-[#05686E] font-semibold"
          startContent={<Presentation size={14} />}
        >
          Present Now
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="flex min-w-[450px]  max-w-[450px] flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={setSelected}
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full rounded-none border-[#22d3ee]",
              tab: "h-12",
              tabContent: "group-data-[selected=true]:text-[#05686E]",
            }}
          >
            <Tab
              key="present"
              title={
                <div className="flex items-center space-x-2">
                  <Maximize />
                  <span>Fullscreen</span>
                </div>
              }
            >
              <Card className="shadow-none">
                <CardBody>
                  Present full screen at your own place
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="view"
              title={
                <div className="flex items-center space-x-2">
                  <PictureInPicture />
                  <span>Presenter View</span>
                </div>
              }
            >
              <Card className="shadow-none">
                <CardBody>
                Present full screen at your own place
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="autoplay"
              title={
                <div className="flex items-center space-x-2">
                  <Play />
                  <span>Autoplay</span>
                </div>
              }
            >
              <Card className="shadow-none">
                <CardBody>
                  Set speed for Automaticcally play
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
          <div className="p-4 w-full">
            <Button
              variant="shadow"
              color="primary"
              className="w-full"
              onPress={() => {
                onOpen();
                setPopOverOpen(false);
              }}
            >
              Present
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ShareDropdown = () => {
  const [value, setValue] = React.useState(new Set(["pdf"]));
  const { items } = useItemStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading,setLoading]=useState(false)
  const { pages } = usePageStore();
  const router = useRouter()
  const { id } = router.query
  const handleSelectionChange = (e) => {
    console.log(e.target.value)
    if(e.target.value.length){
      setValue(e.target.value);
    }
  };
  const handleDownload = async () => {
    setIsOpen(false)
    setLoading(true)
    switch (value) {
      case "json":
        const jsonData = {
          items,
          pages,
        };
        const json = JSON.stringify(jsonData);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `name.edd`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false)
        break;
      case "pdf":
        if (id) {
          const body = {
            id: id,
            body: {
              items: items,
              pages: pages,
            },
          };
          const res = await updatePresentation(body);
          if (res) {
            console.log(res.data);
            const response = await downloadPresentationPDF({ id })
            console.log(response)
            setLoading(false)
          }
        }
      default:
        break;
    }
  };
  console.log(loading)
  return (
    <Popover
      isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}
      placement="bottom-end"
      classNames={{
        content: "rounded-none",
      }}
    >
      <PopoverTrigger>
        <Button
          size="sm"
          variant="bordered"
          className="border-[#05686E] font-semibold"
          startContent={<Download size={14} />}
          isLoading={loading}
        >
          {loading?"Downloading":"Download"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pb-8">
        <div className="flex flex-col min-w-[450px]  max-w-[450px]">
          <span className="border-b-1 text-[18px] my-2 pb-2">Download.</span>
          <Select
            label="File Type"
            variant="bordered"
            labelPlacement="outside"
            defaultSelectedKeys={[value]}
            selectedKeys={[value]}
            radius="none"
            classNames={{
              trigger: "shadow-none",
              label: "text-[12px] top-[65%] font-semibold",
            }}
            onChange={(e)=>{
              if(e.target.value){
                setValue(e.target.value);
              }
              
            }}
          >
            {fileTypes.map((fileType) => (
              <SelectItem
                key={fileType.key}
                value={fileType.key}
                startContent={fileType.icon}
              >
                {fileType.title}
              </SelectItem>
            ))}
          </Select>
          {value === "pdf" && (
            <Alert icon={<Info />} severity="warning" className="mt-4">
              PDF does not support audio, video or animations. Consider download
              a JSON or share a link instead.
            </Alert>
          )}
          <Button
            onPress={handleDownload}
            variant="shadow"
            color="primary"
            className="mt-4"
            radius="none"
          >
            Download
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const UploadButton = () => {
  const fileInput = useRef(null);
  const { setItems } = useItemStore()
  const { setPages } = usePageStore()
  const router = useRouter()
  const { id } = router.query
  const handleClick = () => {
    fileInput.current.click();
  };

  const handleFileInputChange = async (e) => {
    const file = e?.target?.files && e?.target?.files[0];
    if (file) {
      const fileExtn = file?.name?.split(".")[1];
      switch (fileExtn) {
        case "edd":
          const reader = new FileReader();
          reader.onload = function (e) {
            const { items, pages } = JSON.parse(e.target.result)
            setItems(items)
            setPages(pages)
          };
          reader.readAsText(file);

          break;
        default:
          break;
      }
    }
  };
  return (
    <Button
      variant="bordered"
      color="primary"
      size="sm"
      onClick={handleClick}
      startContent={<Upload size={14} />}
    >
      <input
        // accept={accept}
        // multiple={multiple}
        type="file"
        ref={fileInput}
        onChange={handleFileInputChange}
        accept=".edd"
        hidden
      />
      Upload
    </Button>
  );
};

const PresentationNavbar = ({
  isPreview = false,
  isOwner = true,
  presentationName,
  data,
  ancestors
}) => {
  console.log(isPreview, isOwner);
  const { details, setUserDetails, logout } = useUserStore();
  const { pages } = usePageStore();
  const { items } = useItemStore();
  const [selected, setSelected] = useState("present");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!details) {
      const accessToken = Cookies.get("accessToken");
      setUserDetails(accessToken);
    }
  }, []);
  const { onOpen, onOpenChange, onClose, isOpen } = useDisclosure();
  const handleUpdatePresentation = async () => {
    setLoading(true);
    if (id) {
      const body = {
        id: id,
        body: {
          items: items,
          pages: pages,
        },
      };
      const res = await updatePresentation(body);
      if (res) {
        console.log(res.data);
      }
      setLoading(false);
    }
  };
  const latestValuesRef = useRef({ id: null, items: null, pages: null });

  useEffect(() => {
    latestValuesRef.current = { id, items, pages };
  }, [id, items, pages]);
  useEffect(() => {
    if (isPreview) return;
    const intervalId = setInterval(async () => {
      setLoading(true);
      const { id, items, pages } = latestValuesRef.current;
      if (id) {
        const body = {
          id: id,
          body: {
            items: items,
            pages: pages,
          },
        };
        const res = await updatePresentation(body);
        if (res) {
          console.log(res.data);
        }
        setLoading(false);
      }
    }, 30000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  const ancetsorString = useMemo(() => {
    let temp = '';
    if (ancestors?.length > 1) {
      ancestors.map((ele, index) => {
        if (index !== ancestors.length - 1) {
          temp = `${temp} ${ele.name === 'root' ? 'Home' : ele.name} /`;
        }
      })
    } else {
      return 'Home/'
    }
    return temp;
  }, []);
  return (
    <>
      <Navbar
        isBlurred={false}
        isBordered
        className={`${isPreview ? "xxl:pr-[20px] pr-5" : "xxl:px-[20px] px-5"} [&>header]:p-0 [&>header]:h-[56px] [&>header]:gap-0 lg:[&>header]:gap-4 `}
        maxWidth="full"
      >
        <NavbarContent
          justify="start"
          className={`align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end ${isPreview ? "" : "lg:pl-[45px] pl-[20px]"}`}
        >
          <h1 className="font-bold text-xl text-[#05686E] truncate max-w-[40vw] ps-5">
            {ancetsorString}{" "}{presentationName}
          </h1>
        </NavbarContent>
        {isPreview && (
          <NavbarContent
            className=" hidden md:flex justify-center flex-grow"
            justify="center"
          >
            <div className="flex  items-end text-[14px] ">
              <p>Powered By</p>
              <Image
                height={30}
                width={130}
                src={"/images/logo-light.png"}
                alt="laiwnzo logo"
              />
            </div>
          </NavbarContent>
        )}

        <NavbarContent
          justify="end"
          className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end"
        >
        {isOwner && <PresentDropdown
            onOpen={onOpen}
            selected={selected}
            setSelected={setSelected}
          />}
          {isOwner && (
            <Button
              size="sm"
              variant="bordered"
              className="border-[#05686E] font-semibold"
              startContent={<Save size={14} />}
              isLoading={loading}
              onPress={handleUpdatePresentation}
            >
              Save
            </Button>
          )}
          {isOwner && <ShareDropdown />}
          {isOwner && <UploadButton />}

          {details?.data && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="border-3 rounded-full border-[#E8713C]"
                  classNames={{
                    base: "bg-[#05686E] text-white text-[16px]",
                  }}
                  name={
                    details?.data?.fullname
                      ? details?.data?.fullname.slice(0, 1)
                      : ""
                  }
                  size="md"
                  showFallback
                  src={details?.data?.userProfileImageLink}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection aria-label="Profile & Actions" showDivider>
                  <DropdownItem
                    isReadOnly
                    key="profile"
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      name={details?.data?.fullname}
                      description={details?.data?.phone}
                      classNames={{
                        name: "text-default-600",
                        description: "text-default-500",
                      }}
                      avatarProps={{
                        size: "lg",
                        src:
                          details?.data?.userProfileImageLink?.present &&
                          details?.data?.userProfileImageLink,
                        name: details?.data?.fullname
                          ? details?.data?.fullname.slice(0, 1)
                          : "",
                        className: "text-[18px]",
                        fallback:
                          details?.data?.fullname &&
                          details?.data?.fullname.slice(0, 1),
                      }}
                    />
                  </DropdownItem>
                </DropdownSection>

                <DropdownItem key="dashboard">
                  <NextLink href="/dashboard"> Dashboard</NextLink>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  onClick={() => {
                    logout();
                    router.reload();
                  }}
                  // color="warning"
                  className="hover:!bg-[#E8713C] hover:!text-white"
                >
                  <p>Log Out</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      </Navbar>
      <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <PresenterModal
                selected={selected}
                data={data}
                isPreview={isPreview}
              />
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PresentationNavbar;
