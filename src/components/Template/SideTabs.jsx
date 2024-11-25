import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Component,
  File,
  FileClock,
  GripVertical,
  MailPlus,
  Mails,
  MessageSquare,
  Palette,
  Plus,
  Settings,
  Stamp,
  Shapes,
  Trash2,
  Users,
  Workflow,
  FileCog,
  ArrowLeftFromLine,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileStack,
  UploadCloud,
  Brackets,
  Layers3,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getUserProfile } from "@/Apis/login";
import Cookies from "js-cookie";
import Participants from "./Participants";
import ChatComponent from "./ChatComponent";
import ApproverTab from "./approver/ApproverTab";
import { Tooltip } from "@mui/material";
import workFlowIcon from "../../lib/icons/workFlowIcon";
import Image from "next/image";
import DocSettings from "./SideTabContents/DocSettings";
import EmailContents from "./SideTabContents/EmailContents";
import { useSearchParams } from "next/navigation";
import { getRentalAgreementById } from "../../Apis/legalAgreement";
import ShapesTab from "./shapes/shapes";
import StampComponent from "./SideTabContents/Stamp";
import PageSetup from "./SideTabContents/Pagesetup";
import { Button } from "@nextui-org/react";
import Position from "./SideTabContents/Position";
import UploadTab from "./SideTabContents/Upload";
import TemplateList from "./SideTabContents/TemplateList";
import Variable from "./SideTabContents/Variable/Variable";
import { useDocItemStore } from "./stores/useDocItemStore";
import { useTabsStore } from "./stores/useDocTabsStore";
import { usePageDataStore } from "./stores/usePageDataStore";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{  width: "300px", }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs = ({
  handleFileChange,
  isActiveUpload,
  DraggableItems,
  roomId,
  data,
  participants,
  setParticipants,
  isSigningOrder,
  setIsSigningOrder,
  userDetails,
  setUserDetails,
  approverSelection,
  approverSequence,
  disabledApprover,
  setApproverSelection,
  setApproverSequence,
  docDetails,
  setDocDetails,
  doc,
  setDoc,
  ShapeTab,
  stampFile,
  setStampFile,
  pageOreintation,
  setPageOreintation,
  pageSize,
  setPageSize,
  arePagesEmpty,
  isContactSave,
  setIsContactSave,
  setItems,
  sharedItems,
  updateSharedItem,
  setUpdate,
  setDocId,
  setIsLoading,
  setIsActiveUpload,
  serverData,
  activePageIndex,
  setActivePageIndex
}) => {
  const { setSelectedFieldItem, items, setSelectedItem, selectedItem } = useDocItemStore()
  const accessToken = Cookies.get("accessToken");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const clientLogoForm = useRef();
  console.log(data?.approvers && data?.approvers?.some((ele) => ele?.email === userDetails?.data?.email))
  const [value, setValue] = useState(0)
  const [documentSettings, setdocumnetSettings] = useState({
    autoReminder: true,
    requiredAllSigners: true,
    expires: "1d",
  });
  const [approvers, setApprovers] = useState(data?.approvers || []);
  // const [isApprover, setApprover] = useState(false)
  const [documentDetail, setdocumentDetail] = useState({
    title: "Signature Requested on Document Added with Link",
    message: "",
  });
  const [clientEmail, setClientEmail] = useState(null);
  const handleRemoveLogo = () => {
    setDocDetails({ ...docDetails, clientFile: null });
  };
  const [user, setUser] = useState(null);
  const fetchUserProfile = async () => {
    try {
      const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
      setUserDetails(userProfile);
      console.log(userProfile);
      if (userProfile) {
        setUser(userProfile?.data);
      }

      // setdocumentDetail({
      //     title: "Signature Requested on Document Added with Link",
      //     message: `${userDetails?.data?.fullname ? userDetails?.data?.fullname : "User"
      //         } has requested your signature on document & it's ready for review and signing.\n\nKindly go through it and complete the signing process.\n\nClick on the link below to sign the document. Once all parties finish signing, You will receive a copy of the executed document`,
      // })
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const { isApprover } = useTabsStore();
  const {isEditable} = usePageDataStore();
  // console.log(data)
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedItem(null);
  };
  useEffect(() => {
    console.log(selectedItem);
    if (selectedItem && (!isApprover || isEditable)) {
      setValue(12);
    } 
  }, [selectedItem]);
  useEffect(() => {
    fetchUserProfile();
  }, [searchParams]);

  useEffect(() => {
    if (isApprover || !isEditable) {
      setValue(4)
    }
    // console.log(isApprover)
  }, [isApprover])
  // useEffect(()=>{
  //     const isApprov = data?.approvers && data?.approvers?.some((ele)=>ele?.email===userDetails?.data?.email);
  //     if(isApprov){
  //       setValue(4)
  //     }
  //     console.log(data?.approvers)
  //     console.log(userDetails?.data)
  //     console.log(isApprov)
  // },[])

  // console.log(value)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        height: "calc(100vh-10px)",
        position: "relative",
        marginTop: !isActiveUpload && 4,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}

        onChange={handleChange}
        aria-label="easedraft side navigation"
        sx={{
          borderLeft: 1,
          width: "100%",
          backgroundColor: "#4A9B9F",
          borderColor: "divider",
          "& .MuiButtonBase-root": {
            minWidth: "55px",
            padding:"0px"
          },
          "& .MuiTabs-root": {
            minWidth: "30px",
          },
          "& .MuiTabs-vertical": { minWidth: "40px" },
          "& .Mui-selected": {
            backgroundColor: "#05686E",
          },
          "& .MuiTab-root": {
            minWidth: "40px",
          },
        }}
      >
        <Tooltip title="Contents" placement="left">
          <Tab
            icon={<Component color="#ffffff" className="pe-1" />}
            {...a11yProps(0)}
            disabled={!isEditable}
          />
        </Tooltip>
        <Tooltip title="Elements" placement="left">
          <Tab
            icon={<Shapes  color="#ffffff" className="pe-1" />}
            {...a11yProps(1)}
            disabled={!isEditable}
          />
        </Tooltip>
        <Tooltip title="Templates" placement="left">
          <Tab
            icon={<FileStack color="#ffffff" className="pe-1" />}
            {...a11yProps(2)}
            // disabled={data?.scope === "global"}
            disabled={!isEditable}
          />
        </Tooltip>
        <Tooltip title="Upload" placement="left">
          <Tab
            icon={<UploadCloud color="#ffffff" className="pe-1" />}
            {...a11yProps(3)}
            disabled={!isEditable}
          />
        </Tooltip>
        <Tooltip title="Page Setup" placement="left">
          <Tab
          disabled={isActiveUpload}
            icon={<FileCog color="#ffffff" className="pe-1" />}
            {...a11yProps(4)}
          />
        </Tooltip>
        <Tooltip title="Participants" placement="left">
          <Tab
            icon={<Users color="#ffffff" className="pe-1" />}
            {...a11yProps(5)}
          />
        </Tooltip>
        <Tooltip title="Workflow" placement="left">
          <Tab
            icon={<Workflow color="#ffffff" className="pe-1" />}
            {...a11yProps(6)}
            disabled={data?.scope === "global" || isApprover || !isEditable}
          />
        </Tooltip>
        <Tooltip
          title={
            !participants?.collaborators?.length > 0
              ? "Please add participants to start chatting."
              : "Chat"
          }
          placement="left"
        >
          {/* disabled={!participants?.collaborators?.length > 0} */}
          <Tab
            icon={<MessageSquare color="#ffffff" className="pe-1" />}
            {...a11yProps(7)}
            disabled={!participants?.collaborators?.length}
          />
        </Tooltip>
        <Tooltip title="Email" placement="left">
          <Tab
            icon={<MailPlus color="#ffffff" className="pe-1" />}
            {...a11yProps(8)}
            disabled={data?.scope === "global"}
          />
        </Tooltip>
        <Tooltip title="Settings" placement="left">
          <Tab
            icon={<Settings color="#ffffff" className="pe-1" />}
            {...a11yProps(9)}
            disabled={data?.scope === "global"}
          />
        </Tooltip>
        <Tooltip title="Stamp" placement="left">
          <Tab
            icon={<Stamp color="#ffffff" className="pe-1" />}
            {...a11yProps(10)}
            disabled={data?.scope === "global"}
          />
        </Tooltip>
        <Tooltip title="Variable" placement="left">
          <Tab
            icon={<Brackets color="#ffffff" className="pe-1" />}
            {...a11yProps(11)}
            
            // disabled

            //disabled={data?.scope === "global" || isApprover || isActiveUpload}
          />
        </Tooltip>
        <Tooltip title="Position" placement="left">
          <Tab
            icon={<Layers3  color="#ffffff" className="pe-1" />}
            {...a11yProps(12)}
            disabled={data?.scope === "global" || isApprover}
          />
        </Tooltip>

      </Tabs>
      <TabPanel value={value} index={0}>
        {DraggableItems}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {ShapeTab}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TemplateList serverData={data} handleFileChange={handleFileChange} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UploadTab
          setItems={setItems}
          setSelectedFieldItem={setSelectedFieldItem}
          pageSize={pageSize}
          setDocId={setDocId}
          docDetails={docDetails}
          setDocDetails={setDocDetails}
          serverData={serverData}
          setIsLoading={setIsLoading}
          setIsActiveUpload={setIsActiveUpload}
          activePageIndex={activePageIndex}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PageSetup
          pageOreintation={pageOreintation}
          setPageOreintation={setPageOreintation}
          pageSize={pageSize}
          setPageSize={setPageSize}
          arePagesEmpty={arePagesEmpty}
          value={value}
          isApprover={isApprover}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Participants
          setDocDetails={setDocDetails}
          docDetails={docDetails}
          userDetails={userDetails}
          roomId={roomId}
          participants={participants}
          setParticipants={setParticipants}
          data={data}
          isSigningOrder={isSigningOrder}
          setIsSigningOrder={setIsSigningOrder}
          disabledApprover={disabledApprover}
          doc={doc}
          setDoc={setDoc}
          setIsContactSave={setIsContactSave}
          isContactSave={isContactSave}
          isApprover={isApprover}
        />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <ApproverTab
          isActiveUpload={isActiveUpload}
          userDetails={userDetails}
          data={data}
          approvers={approvers}
          setApprovers={setApprovers}
          disabledApprover={disabledApprover}
          approverSequence={approverSequence}
          setApproverSequence={setApproverSequence}
          approverSelection={approverSelection}
          setApproverSelection={setApproverSelection}
        />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <ChatComponent userDetails={userDetails} roomId={roomId} />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <EmailContents
          setDocDetails={setDocDetails}
          docDetails={docDetails}
          setdocumentDetail={setdocumentDetail}
          documentDetail={documentDetail}
          handleRemoveLogo={handleRemoveLogo}
          userDetails={userDetails}
          clientEmail={clientEmail}
          clientLogoForm={clientLogoForm}
          isApprover={isApprover}
        />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <div className="w-full">
          <DocSettings
            setDocDetails={setDocDetails}
            docDetails={docDetails}
            setdocumnetSettings={setdocumnetSettings}
            documentSettings={documentSettings}
            isApprover={isApprover}
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={10}>
        <StampComponent stampFile={stampFile} setStampFile={setStampFile} isApprover={isApprover} />
      </TabPanel>
      <TabPanel value={value} index={12}>
        <Position
          selectedItem={selectedItem}
          items={items}
          setItems={setItems}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          setUpdate={setUpdate}
          setSelectedItem={setSelectedItem}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
        />
      </TabPanel>
      <TabPanel value={value} index={11}>
        <Variable />
      </TabPanel>

      {value !== null && (
        <span
          className="absolute flex items-center justify-start top-[35%] -left-[12px] z-49 cursor-pointer"
          onClick={() => {
            setValue(null);
            setSelectedItem(null);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: "scale(2) rotate(180deg)",
            }}
            viewBox="0 0 13 96"
            width="13"
            height="96"
            fill="none"
            class="IrLwCg"
          >
            <path
              fill="#15151300"
              d="M0,0 h1 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32 H0 z"
            ></path>
            <path
              fill="#FFF"
              d="M0.5,0 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32"
            ></path>
          </svg>
          <span className="absolute">
            <ChevronRight size={18} />
          </span>
        </span>
      )}
    </Box>
  );
};
export default VerticalTabs;
