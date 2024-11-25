import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { AirplayIcon, GalleryHorizontal, GalleryVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import { pageSetupOptions } from "@/lib/constants/page";
import { useDocItemStore } from "../stores/useDocItemStore";
import { useTabsStore } from "../stores/useDocTabsStore";
import { usePageDataStore } from "../stores/usePageDataStore";
import { getPageHeight, pixelToNumber } from "@/lib/helpers/templateHelpers";
import { getPageWidth } from "../../../lib/helpers/templateHelpers";
const pagesetupOptions2 = [
  {
    title: "Letter",
    size: {
      height: "1056px",
      width: "816px",
    },
  },
  {
    title: "A4",
    size: {
      height: "1080px",
      width: "768px",
    },
  },
  {
    title: "Legal",
    size: {
      height: "1346px",
      width: "816px",
    },
  },
];

const pagesetupOptions = ["Letter", "A4", "Legal"];

const MIN_ALLOWED_PADDING_SIZE = "0px";
const MAX_ALLOWED_PADDING_SIZE = "50px";

const PageSetup = ({
  // pageOreintation,
  // setPageOreintation,
  pageSize,
  // setPageSize,
  arePagesEmpty,
  value,
  isApprover,
}) => {
  const [title, setTitle] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { pageSetup, setPageOrientation, setPageSize } = useTabsStore();
  const {
    headerActive,
    setHeaderActive,
    footerActive,
    setFooterActive,
    setActiveHeaderFooterPageHeight,
    showPageNo,
    setShowPageNo,
    isEditable
  } = usePageDataStore();

  const handlePageSize = (index) => {
    setPageSize(index);
  };
  const handleHeaderActiveToggle = (e) => {
    const pageHeightNumber = pixelToNumber(getPageHeight(pageSetup));
    if (headerActive) {
      setActiveHeaderFooterPageHeight(
        footerActive ? `${pageHeightNumber - 128}px` : `${pageHeightNumber}px`
      );
    } else {
      setActiveHeaderFooterPageHeight(
        footerActive
          ? `${pageHeightNumber - 2 * 128}px`
          : `${pageHeightNumber - 128}px`
      );
    }
    setHeaderActive(e.target.checked);
  };
  const handleFooterActiveToggle = (e) => {
    const pageHeightNumber = pixelToNumber(getPageHeight(pageSetup));
    if (footerActive) {
      setActiveHeaderFooterPageHeight(
        headerActive ? `${pageHeightNumber - 128}px` : `${pageHeightNumber}px`
      );
    } else {
      setActiveHeaderFooterPageHeight(
        headerActive
          ? `${pageHeightNumber - 2 * 128}px`
          : `${pageHeightNumber - 128}px`
      );
    }
    setFooterActive(e.target.checked);
  };

  const handleShowPageNo = (e)=>{
    setShowPageNo(e.target.checked);
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Page Setup Change
              </ModalHeader>
              <ModalBody>
                Orientation and placement of content will be changed on changing
                page settings. Do you wish to continue?
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setModalTitle(null);
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#05686e] text-white"
                  onPress={() => {
                    setTitle(modalTitle);
                    onClose();
                  }}
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div>
        <div className="p-4 border-b-2">
          <p className="text-[14px] text-[#05686e]">Page Settings</p>
        </div>
        <div className="overflow-y-scroll max-h-[calc(100vh-155px)]">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] px-4 pt-2">Header and Footer </p>
          <div className="fllex flex-col border-b">
            <div className="flex justify-between   p-4  gap-3">
              <span className="text-[14px]">Header </span>
              <div>
                <Switch
                  // isDisabled={disabledApprover || isActiveUpload}
                  isSelected={headerActive}
                  isDisabled={!isEditable}
                  // onValueChange={setHeaderActive}
                  onChange={handleHeaderActiveToggle}
                  size="sm"
                  color="secondary"
                >
                  {/* <span className="text-[12px] text-[#151513]">
                {headerActive ? "Show" : "Hide"}
              </span> */}
                </Switch>
              </div>
            </div>
            <PaddingHeaderFooterInput header disabled={!isEditable} />
          </div>
          <div className="fllex flex-col border-b">
            <div className="flex justify-between  p-4  gap-3">
              <span className="text-[14px]">Footer </span>
              <div>
                <Switch
                  isDisabled={!isEditable}
                  isSelected={footerActive}
                  // onValueChange={setFooterActive}
                  onChange={handleFooterActiveToggle}
                  size="sm"
                  color="secondary"
                >
                  {/* <span className="text-[12px] text-[#151513]">
                {headerActive ? "Show" : "Hide"}
              </span> */}
                </Switch>
              </div>
            </div>
            <PaddingHeaderFooterInput  />
            <div className="flex justify-between px-4 py-2">
              <span className="text-[14px]">Page No's</span>
              <Switch
                  isDisabled={!isEditable}
                  isSelected={showPageNo}
                  // onValueChange={setFooterActive}
                  onChange={handleShowPageNo}
                  size="sm"
                  color="secondary"
                >
                  {/* <span className="text-[12px] text-[#151513]">
                {headerActive ? "Show" : "Hide"}
              </span> */}
                </Switch>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start border-b p-4 flex-col gap-3">
              <p className="text-[14px]">Page Orientation: </p>
              <PageOrientationDropdown
                pageOreintation={pageSetup?.orientation}
                setPageOreintation={setPageOrientation}
                isApprover={!isEditable}
              />
            </div>
            <RadioGroup
              label="Select Page Size:"
              className="p-4 text-[14px]"
              value={pageSetupOptions.findIndex(
                (ele) => ele.title === pageSetup.size.title
              )}
              onValueChange={handlePageSize}
              defaultValue={pageSetupOptions.findIndex(
                (ele) => ele.title === pageSetup.size.title
              )}
            >
              {pageSetupOptions.map((ele, index) => {
                return (
                  <Radio
                    isDisabled={!isEditable}
                    value={index}
                    key={index}
                    classNames={{
                      label: "text-[14px]",
                      control: "bg-[#e8713d] border-[#e8713d]",
                    }}
                    size="sm"
                  >
                    {ele.title}
                  </Radio>
                );
              })}
            </RadioGroup>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default PageSetup;

export const PageOrientationDropdown = ({
  pageOreintation,
  setPageOreintation,
  isApprover,
}) => {

  const {headerActive,footerActive, setActiveHeaderFooterPageHeight} = usePageDataStore();
  const {pageSetup} = useTabsStore();
  const updateActiveHeaderFooterPageHeight = (orientation)=>{
    const pageWidth = pixelToNumber(getPageWidth(pageSetup));
    // debugger;
    if(pageOreintation === orientation && !isNaN(pageWidth)){
      if(headerActive){
        setActiveHeaderFooterPageHeight(footerActive ? `${pageWidth-256}px`:`${pageWidth-128}px`)
      }
      else{
        setActiveHeaderFooterPageHeight(footerActive?`${pageWidth-128}px`:`${pageWidth}px`);
      }
    }
  }

  return (
    <>
      <ButtonGroup
        isDisabled={isApprover}
        className="rounded-md bg-transparent border"
      >
        <Button
          onClick={() => {
            updateActiveHeaderFooterPageHeight('portrait');
            setPageOreintation("landscape");
          }}
          startContent={<AirplayIcon sx={{ fontSize: 20 }} />}
          className={`rounded-none bg-transparent ${
            pageOreintation === "landscape" ? "text-[#05686E]" : "text-black"
          }`}
        >
          Landscape
        </Button>
        <Button
          onClick={() => {
            updateActiveHeaderFooterPageHeight('landscape');
            setPageOreintation("portrait");
          }}
          className={`rounded-none bg-transparent ${
            pageOreintation === "portrait" ? "text-[#05686E]" : "text-black"
          }`}
          startContent={<StayCurrentPortraitIcon sx={{ fontSize: 20 }} />}
        >
          Portrait
        </Button>
      </ButtonGroup>
    </>
  );
};



const PaddingHeaderFooterInput = ({ header,disabled}) => {
  const { headerPadding, footerPadding, setHeaderPadding, setFooterPadding,headerActive,footerActive } =
    usePageDataStore();
  const isDisabled = header ? !headerActive : !footerActive;
  const handleButtonClick = (increase) => {
    if (increase) {
      const value = `${pixelToNumber(header?headerPadding:footerPadding) + 1}px`;
      if((pixelToNumber(header?headerPadding:footerPadding) < pixelToNumber(MAX_ALLOWED_PADDING_SIZE))){
        if (header) {
          setHeaderPadding(value);
        } else {
          setFooterPadding(value);
        }
      }
    } else {
      const value = `${pixelToNumber(header?headerPadding:footerPadding) - 1}px`;
      if (
        header &&
        pixelToNumber(headerPadding) > pixelToNumber(MIN_ALLOWED_PADDING_SIZE)
      ) {
        setHeaderPadding(value);
      } else {
        setFooterPadding(value);
      }
    }
  };
  const handleKeyPress = (e)=>{
    // debugger;
    const value = pixelToNumber(e.currentTarget.value+"px");

    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(value) || (value<pixelToNumber(MIN_ALLOWED_PADDING_SIZE) || value>pixelToNumber(MAX_ALLOWED_PADDING_SIZE))) {
        e.preventDefault();
        // setInputValue('');
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        if (header) {
          setHeaderPadding(value+"px");
        } else {
          setFooterPadding(value+"px");
        }
    }
  }
  return (
    <div className="flex flex-col px-4 pb-2">
      <div className="flex justify-between">
        <span className="text-[14px]">Padding</span>
        <div className="flex">
          <button
            type="button"
            disabled={isDisabled|| disabled}
            onClick={() => handleButtonClick(false)}
            className="toolbar-item font-decrement"
          >
            <i className="format minus-icon" />
          </button>

          <input
            style={{ width: "fit-content", maxWidth: "30px", margin: 0 }}
            type="number"
            value={pixelToNumber(header ? headerPadding : footerPadding)}
            disabled={isDisabled || disabled}
            className="toolbar-item font-size-input"
            min={MIN_ALLOWED_PADDING_SIZE}
            max={MAX_ALLOWED_PADDING_SIZE}
            onChange={(e) => {
              const padding = `${e.target.value}px`;
              if (header) {
                setHeaderPadding(padding);
              } else {
                setFooterPadding(padding);
              }
            }}
            onKeyDown={handleKeyPress}
          />

          <button
            type="button"
            disabled={isDisabled || (pixelToNumber(header ? headerPadding : footerPadding) === pixelToNumber(MAX_ALLOWED_PADDING_SIZE)) || disabled}
            onClick={() => handleButtonClick(true)}
            className="toolbar-item font-increment"
          >
            <i className="format add-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
