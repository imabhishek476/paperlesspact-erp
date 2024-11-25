import { Box, Tooltip } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  ChevronRight,
  CircleUser,
  Component,
  FileCog,
  FilePen,
  FilePenLine,
  Folder,
  MessageSquare,
  Shapes,
  Text,
  Type,
  UploadCloud,
  Users,
} from "lucide-react";
import TextTab from "./Tabs/TextTab";
import ShapesTab from "./Tabs/ShapesTab";
import { useItemStore } from "./stores/useItemStore";
import ShapeConfigTab from "./Tabs/ShapeConfigTab";
import ShapeSelectedTab from "./Tabs/ShapeSelectedTab";
import PageSettings from "./Tabs/PageSettings";
import UploadsTab from "./Tabs/UploadsTab";
import AvatarTab from "./Tabs/AvatarTab";
import NotesTab from "./Tabs/NotesTab";
import { Button } from "@nextui-org/react";
import ShapePropertiesTab from "./Tabs/ShapePropertiesTab";
import ShapeAnimationTab from "./Tabs/ShapeAnimationTab";
import ImportTemplateTab from "./Tabs/ImportTemplateTab";
import PresentationChatComponent from './PresentationChatComponent'

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className="z-50 border-l-2 "
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 1, width: "300px", height:  "100%"}}>
          {children}
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

const PreviewSideBar = ({
  roomId,
  user
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // setSelectedItem(null);
  };
  const { selectedItem } = useItemStore();
  useEffect(() => {
    if (selectedItem === null) {
      setValue("shapeConfig");
    }
  }, [selectedItem]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        position: "relative",
        minHeight:'100%'
        // zIndex: 1000,
      }}
    >
      {/* <div>
        {selectedItem && (
          <div className="flex ps-2 justify-start gap-2 ml-[72px] fixed !top-[60px] left-0">
            <Button
              size="sm"
              variant="light"
              className="text-[14px] text-[#777777]"
              onPress={() => setValue(997)}
            >
              Position
            </Button>
            <Button
              size="sm"
              variant="light"
              className="text-[14px] text-[#777777]"
              onPress={() => setValue(999)}
            >
              Animation
            </Button>
            {selectedItem?.options && (
              <Button
                size="sm"
                variant="light"
                className="text-[14px] text-[#777777]"
                onPress={() => setValue(998)}
              >
                Properties
              </Button>
            )}
          </div>
        )}
      </div> */}
      <Tabs
        orientation="vertical"
        // variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="easedraft side navigation"
        sx={{
            minHeight:'100%',
          borderLeft: 1,
          backgroundColor: "#4A9B9F",
          borderColor: "divider",
          "& .MuiTabs-root": {
            minWidth: "40px",
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
       
        <Tooltip title="Chat" placement="left">
          <Tab
            icon={<MessageSquare color="#ffffff" className="pe-1" />}
            {...a11yProps(0)}
          />
        </Tooltip>
        <Tooltip title="Collaborators" placement="left">
          <Tab
            icon={<Users color="#ffffff" className="pe-1" />}
            {...a11yProps(0)}
          />
        </Tooltip>
        
      </Tabs>
      <TabPanel value={value} index={0}>
      <PresentationChatComponent userDetails={user} roomId={roomId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <TextTab /> */}
      </TabPanel>
      
      {value !== null && (
          <div
            // onClick={() => setIsSliderOpen((prev) => !prev)}
            style={{
              backgroundColor: "white",
              bottom: "116.5px",
              color: "#05686E",
              zIndex: 1000
            }}
            className="absolute flex items-center h-10 justify-start top-[46%] -left-[20px] px-1 rounded-l-3xl border-l-2 border-y-2 py-8 z-49 cursor-pointer"
            onClick={() => {
              setValue(null);
            }}
          >
            <ChevronRight
              size={12}
              className={`transition-all duration-1000`}
            />
          </div>
        )}
    </Box>
  );
};

export default PreviewSideBar;
