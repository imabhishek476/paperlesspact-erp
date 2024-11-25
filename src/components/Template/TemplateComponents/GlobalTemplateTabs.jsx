import { InputAdornment, Tab, Tabs, TextField } from "@mui/material";
// import { Button, ButtonGroup, Tab, Tabs } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Search, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import AirplayIcon from "@mui/icons-material/Airplay";
import GlobalTemplateListing from "./GlobalTemplateListing";
import { getAllCategory } from "../../../Apis/template";
import { getcompletedTemplateList } from "../../../Apis/legalAgreement";
import { Box } from "@mui/system";
import { TabContext, TabPanel } from "@mui/lab";

const GlobalTemplateTabs = ({ templateId, fromTab, handleFileChange,templateType }) => {
  const classname = fromTab ? "flex-col" : "flex-col lg:flex-row gap-5 item-start lg:items-center mt-8"
  const [mode, setMode] = useState("portrait");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState(null);
  const fileRef = useRef()
  const getTemplate = async (categoryId, _mode,templateType) => {
    setLoading(true);
    let filter = {
      isPublished: 1,
      isGlobal: 1,
      pageOrientation: _mode,
      search: search,
      type: templateType === "all" ? null : templateType
    };
    if (categoryId && categoryId !== "all") {
      filter = {
        ...filter,
        categoryId: categoryId,
      };
    }
    console.log(filter);
    if (filter?.pageOrientation) {
      const res = await getcompletedTemplateList(filter, 1, 5);
      console.log(res);
      setTemplates(res);
    }
    setLoading(false);
  };
  const getcategory = async () => {
    const res = await getAllCategory(0, 0, 1);
    if (res) {
      console.log(res);
      setCategories(res?.data?.ref);
    }
  };
  const handleChange = (_mode) => {
    setMode(_mode);
  };
  useEffect(() => {
    let timer;
    setTimeout(()=>{
      getcategory();
      getTemplate(selected, mode,templateType);
    },500)
    return () => {
      clearTimeout(timer);
    };
  }, [mode, selected,templateType,search]);

  const handleTabChange = (event, newValue) => {
    console.log(newValue)
    setSelected(newValue);
    getTemplate(newValue);
  };
  console.log(templateType);
  return (
    <div>
      <div className={`flex ${classname} justify-between item-start`}>
        {fromTab ? <div className="border-b-2 flex flex-row justify-between items-center py-4">
          <span className="text-[14px] text-[#05686e]">   Public Templates ({templates?.totalItems})</span>
          <div className="flex flex-row gap-4 justify-center text-[14px]  items-center self-center hover:bg-gray-100 rounded-md hover:text-[#05686E] hover:cursor-pointer transition-all duration-300">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              ref={fileRef}
            />
            <Button size="sm" className="flex flex-row gap-2 bg-transparent" onClick={() => fileRef.current.click()}>
              <Upload size={15} className="self-center" /> Upload
            </Button>
          </div>
        </div> :
          <h1 className="text-sm font-semibold">
            Public Templates ({templates?.totalItems})
          </h1>}

        <div className={`flex ${classname} gap-5 ${fromTab ? "!mt-4" : "!mt-0"}`}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search template"
            value={search}
            onChange={(e)=>{
              setSearch(e.target.value)
              console.log(e.target.value)
            }}
            id="outlined-start-adornment"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <ButtonGroup className="rounded-md bg-transparent border">
            <Button
              onClick={() => handleChange("landscape")}
              startContent={<AirplayIcon sx={{ fontSize: 20 }} />}
              className={`rounded-none bg-transparent ${mode === "landscape" ? "text-[#05686E]" : "text-black"
                }`}
            >
              Landscape
            </Button>
            <Button
              onClick={() => handleChange("portrait")}
              className={`rounded-none bg-transparent ${mode === "portrait" ? "text-[#05686E]" : "text-black"
                }`}
              startContent={<StayCurrentPortraitIcon sx={{ fontSize: 20 }} />}
            >
              Portrait
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <TabContext value={selected}>
        <Box sx={{ mt: 0, maxWidth: { xs: 320, sm: 480, md: "100%" }}}>
          <Tabs
            value={selected}
            // textColor="secondary"
            indicatorColor="secondary"
            sx={{
              borderBottom: '1px solid #e8e8e8',
              "& .MuiTabs-indicator": {
                color: "#05686E !important",
              },
              "& .MuiTabs-scrollButtons.Mui-disabled ":{
                opacity:"0.3"
              },
              "& .Mui-selected": {
                color:"#E8713C"
              },
              "& .MuiButtonBase-root":{
                minWidth:"0px !important",
                padding:"12px 12px !important",
                textDecoration:"capitalize",
                fontSize:"14px",
                letterSpacing:"0.035em",
                marginTop:"0"
              }
            }}
            allowScrollButtonsMobile
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab className="!capitalize" label="All" value={"all"} />
            {categories?.map((item) => {
              return (
                <Tab className="!capitalize" key={item?._id} value={item._id} label={item.name} />
              );
            })}
          </Tabs>
        </Box>
        {selected === "all" ?
          <TabPanel className="!px-0" value={selected}  >
            <GlobalTemplateListing
              modeStatus={mode}
              templates={templates}
              loading={loading}
              templateId={templateId}
              fromTab={fromTab}
              all={true}
            />
          </TabPanel> :
          categories?.map((item) => {
            return <TabPanel className="!px-0" key={item?._id} value={item?._id} >
              <GlobalTemplateListing
                modeStatus={mode}
                templates={templates}
                loading={loading}
                templateId={templateId}
                fromTab={fromTab}
              />
            </TabPanel>
          })
        }
      </TabContext>

      {/* <Tabs
      selectedKey={selected}
      onSelectionChange={handleTabChange}
      aria-label="Global Template tabs"
      color="primary"
      variant="underlined"
      className=""
      classNames={{
        tabList:
          "gap-6 w-full relative rounded-none p-0 border-b border-divider overflow-x-scroll",
        cursor: "w-full bg-[#05686E]",
        base: "w-full",
        tab: "max-w-fit px-0 h-12 ",
        tabContent: "group-data-[selected=true]:text-[#05686E] ",
      }}
    >
      <Tab className="capitalize" key={"all"} title={"All"}>
        <GlobalTemplateListing
          modeStatus={mode}
          templates={templates}
          loading={loading}
          templateId={templateId}
          all={true}
          fromTab={fromTab}
        />
      </Tab>
      {categories?.map((item) => {
        return (
          <Tab className="capitalize" key={item._id} title={item.name}>
            <GlobalTemplateListing
              modeStatus={mode}
              templates={templates}
              loading={loading}
              templateId={templateId}
              fromTab={fromTab}
            />
          </Tab>
        );
      })}
    </Tabs> */}


    </div>
  );
};

export default GlobalTemplateTabs;
