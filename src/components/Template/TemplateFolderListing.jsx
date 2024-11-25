import { formatDate } from "@/Utils/dateTimeHelpers";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeft,
  CornerUpRight,
  Edit,
  File,
  Folder,
  Home,
  LayoutGrid,
  Link,
  List,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useState } from "react";
import FileItemAccordion from "./FileItemAccordion";
import { useEffect } from "react";
import {
  addToFav,
  createFile,
  createFolder,
  deleteNode,
  getFolderStructure,
  moveFile,
  renameFolder,
} from "@/Apis/folderStructure";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import {
  Box,
  Divider,
  TextField,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import RenameAction from "./actions/RenameAction";
import AddFolder from "./actions/AddFolder";
import MoveTo from "./actions/MoveTo";
import FavFolderList from "./FavFolderList";
import RecentFolderList from "./RecentFolderList";
import ActiveFolderList from "./ActiveFolderList";
import {
  getAncestors,
  getFavourite,
  getRecent,
  getShared,
} from "../../Apis/folderStructure";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomTreeView from "./CustomTreeView/CustomTreeView";
import TemporaryDrawer from "../Drawer/CustomDrawer";
import ActionsModal from "./CustomTreeView/ActionsModal";
import SharedFolderList from "./SharedFolderList";
import FolderListingTabs from "./TemplateComponents/FolderListingTabs";
import GlobalTemplateTabs from "./TemplateComponents/GlobalTemplateTabs";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    // paddingRight: "10px",
    padding: "5px",
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      fontWeight: theme.typography.fontWeightBold,
      borderRadius: "none",
      color: "var(--tree-view-color)",
    },
    "&.MuiTreeItem-iconContainer": {
      marginRight: "0px",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      // paddingLeft: theme.spacing(2),
    },
  },
}));

const TemplateFolderListing = () => {
  const [currentPage, setCurrentPage] = useState("root");
  const [allPath, setAllPath] = useState(null);
  const [FavouriteList, setFavouriteList] = useState(null);
  const [sharedList, setSharedList] = useState(null);
  const [recentList, setRecentList] = useState(null);
  const [viewLayout, setViewLayout] = useState("grid");
  const [folder, setFolder] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [toolClosed, setToolClosed] = useState(false);
  const [update, setUpdate] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [parentId, setParentId] = useState("root");
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState({});
  const [activeFolderContent, setActiveFolderContent] = useState({});
  const [activeNodeId, setActiveNodeId] = useState("");
  const [templateType, setTemplateType] = useState("all");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [node, setNode] = useState(null);
  const queryParameters = useSearchParams();
  const actionaModalDiscl = useDisclosure();

  const [drawer, setDrawer] = React.useState({
    left: false,
  });
  const toggleDrawer = (open) => (event) => {
    console.log(open);
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer({ ...drawer, left: open });
  };
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };
  const handleRowClick = (row) => {
    if (row.isFile) {
      if(row.type === "presentation"){
        router.push(`/presentation/new?id=${row?._id}`);
        
      } else {
        
        router.push(`/template/new?id=${row?._id}`);
      }
    } else {
      router.push(`/template/${row?.name}`);
    }
  };
  const actionList = [
    {
      title: "Rename",
      comp: (
        <RenameAction
          setUpdate={setUpdate}
          node={node}
          onClose={onClose}
          fetchfolderStructureByPath={fetchfolderStructureByPath}
        />
      ),
    },
    {
      title: "AddFolder",
      comp: <></>,
    },
  ];
  const [actions, setActions] = useState({
    title: "Rename",
    comp: (
      <RenameAction
        setUpdate={setUpdate}
        node={node}
        onClose={onClose}
        fetchfolderStructureByPath={fetchfolderStructureByPath}
      />
    ),
  });
  function handleCopyClick(link) {
    // Get the URL or link that you want to copy
    console.log(link);
    const linkToCopy = link;

    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = linkToCopy;

    // Append the input element to the DOM (making it invisible)
    document.body.appendChild(tempInput);

    // Select the input's content
    tempInput.select();
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);
  }
  async function fetchfolderStructure() {
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["ancestors"] = true;
      return temp;
    });
    setLoading(true);
    const folderStructure = await getFolderStructure();
    // console.log(folderStructure);
    setFolder(folderStructure);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["ancestors"] = false;
      return temp;
    });
    setLoading(false);
  }
  async function fetchFavourite() {
    setLoading(true);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["fav"] = true;
      return temp;
    });
    const fevList = await getFavourite(templateType);
    console.log(fevList);
    setFavouriteList(fevList);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["fav"] = false;
      return temp;
    });
    setLoading(false);
  }
  async function fetchShared() {
    setLoading(true);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["shared"] = true;
      return temp;
    });
    const newList = await getShared(templateType);
    console.log("sharedList", newList);
    setSharedList(newList);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["shared"] = false;
      return temp;
    });
    setLoading(false);
  }
  async function fetchRecent() {
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["recent"] = true;
      return temp;
    });
    const newRecentList = await getRecent(templateType);
    console.log(newRecentList);
    setRecentList(newRecentList);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp["recent"] = false;
      return temp;
    });
  }
  const refreshParent = async (node) => {
    setUpdate((prev) => !prev);
    setLoading(true);
    if (node?.parent !== "root") {
      await fetchfolderStructureByPath(node?.parent);
    }
    setLoading(false);
  };
  const refreshFolder = async (id) => {
    setLoading(true);
    await fetchfolderStructureByPath(id);
    setLoading(false);
  };
  const refreshRoot = async () => {
    setLoading(true);
    await getFolderStructure();
    setLoading(false);
  };
  async function fetchfolderStructureByPath(id) {
    // setCurrentPage('folder')
    setLoading(true);
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp[id] = true;
      return temp;
    });
    const folderStructure = await getFolderStructure(id);
    console.log(folderStructure);
    console.log(id);
    setActiveFolderContent((prev) => {
      const temp = { ...prev };
      temp[id] = folderStructure;
      return temp;
    });
    setIsActiveLoading((prev) => {
      const temp = { ...prev };
      temp[id] = false;
      return temp;
    });
    setLoading(false);
  }
  async function fetchfPath() {
    setLoading(true);
    if (parentId != "root") {
      setIsActiveLoading((prev) => {
        const temp = { ...prev };
        temp["ancestors"] = true;
        return temp;
      });
      // console.log(parentId)
      const newPath = await getAncestors(parentId);
      if (newPath) {
        const newState = [...newPath];
        const lastObject = newState.pop();
        setCurrentPage(lastObject?.name);
        console.log(newPath);
        setAllPath(newPath);
      }
      setIsActiveLoading((prev) => {
        const temp = { ...prev };
        temp["ancestors"] = false;
        return temp;
      });
    }
    setLoading(false);
  }
  const renderTree = (nodes) =>
    nodes?.map((node) => {
      if (node?.isActive === "0") {
        return;
      }
      // console.log();
      return (
        <StyledTreeItem
          key={node && node._id ? node?._id : node}
          nodeId={node && node._id ? node?._id : node}
          node={node}
          labelText={node && node.name ? node.name : "file"}
          onOpen={onOpen}
          setActions={setActions}
          onClick={() => {
            fetchfolderStructureByPath(node && node._id ? node?._id : node);
            setParentId(node && node._id ? node?._id : node);
          }}
          labelClick={() => {
            setParentId(node && node._id ? node?._id : node);
            setActions(actionList[1]);
            onOpen();
          }}
          labelIcon={node.isFile === "0" ? Folder : File}
        >
          {Array.isArray(node.children) && node.children.length > 0 ? (
            expanded.some((ele) => ele === node?._id) ? (
              isActiveLoading[node?._id] ? (
                <Spinner size="sm" />
              ) : (
                renderTree(activeFolderContent[node?._id])
              )
            ) : (
              node.children.map((ele, index) => {
                return <StyledTreeItem key={ele}>{index}</StyledTreeItem>;
              })
            )
          ) : null}
          {/* {Array.isArray(node.children) && node.children.length > 0 ? 
            !isActiveLoading ? (
				Array.isArray(activeFolderContent) &&
            activeFolderContent.length > 0?
              renderTree(activeFolderContent):null
            ) : (
              <Spinner />
            )
           : 
		//    (
        //     node.children.map((ele, index) => {
        //       return <StyledTreeItem key={ele}>{index}</StyledTreeItem>;
        //     })
        //   )
		null
		  } */}
        </StyledTreeItem>
      );
    });
  async function createFolderr() {
    console.log(parentId);
    setLoading(true);
    const folder = await createFolder(folderName, parentId, "0");
    console.log(folder);
    if (folder) {
      await fetchfolderStructure();
      if (parentId !== "root") {
        await fetchfolderStructureByPath(parentId);
      }
      setFolderName("");
      setUpdate((prev) => !prev);
    }
    setLoading(false);
  }
  async function deleteNodeee(node) {
    // console.log(folderName, levels);
    console.log(node._id);
    setLoading(true);
    const folder = await deleteNode(node._id);
    console.log(folder);
    if (folder) {
      await fetchfolderStructure();
      if (node?.parent !== "root") {
        await fetchfolderStructureByPath(node?.parent);
      }
      setFolderName("");
      setUpdate((prev) => !prev);
    }
    setLoading(false);
  }
  async function addToFavvv(node, isFavourite) {
    // console.log(folderName, levels);
    console.log(node._id);
    setLoading(true);
    const folder = await addToFav(node._id, isFavourite);
    console.log(folder);
    if (folder) {
      // await fetchfolderStructure();
      if (node?.parent !== "root") {
        await fetchfolderStructureByPath(node?.parent);
      }
      setUpdate((prev) => !prev);
    }
    setLoading(false);
  }

  async function createFilee() {
    // console.log(folderName, levels);
    setLoading(true);
    const folder = await createFolder(folderName, parentId, "1");
    if (folder) {
      await fetchfolderStructure();
      setFolderName("");
      setUpdate((prev) => !prev);
    }
    setLoading(false);
  }
  const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const [isOpenPop, setIsOpenPop] = React.useState(false);
    const theme = useTheme();
    const [folderName, setFolderName] = useState("");

    const [editable, setEditable] = useState(false);

    const {
      bgColor,
      color,
      node,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
      setActions,
      labelClick,
      onOpen,
      colorForDarkMode,
      bgColorForDarkMode,
      ...other
    } = props;

    const styleProps = {
      "--tree-view-color":
        theme.palette.mode !== "dark" ? color : colorForDarkMode,
      "--tree-view-bg-color":
        theme.palette.mode !== "dark" ? bgColor : bgColorForDarkMode,
    };

    async function handleRename(value) {
      const rename = await renameFolder(
        node?.relativePath,
        node?.relativePath
          .split("/")
          .slice(0, node?.relativePath.split("/").length - 1)
          .join("/") +
        "/" +
        value
      );

      fetchfolderStructure();
    }

    return (
      <StyledTreeItemRoot
        label={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
              // p: 0.5,
              p: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // p: 0.5,
                p: 0,
              }}
            >
              <LabelIcon size={18} className="mr-1.5" />
              <Box
                sx={{
                  position: "relative",
                }}
              >
                {editable ? (
                  <input
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (event.currentTarget.value === "") {
                          return;
                        }
                        handleRename(event.currentTarget.value);
                      }
                    }}
                    type="text"
                    autoFocus={true}
                    className="p-0 w-[100px] text-sm font-medium bg-transparent active:border-none"
                    placeholder="Rename"
                  ></input>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "inherit", flexGrow: 1 }}
                  >
                    {labelText}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // p: 0.5,
                p: 0,
                gap: "10px",
              }}
            >
              <Popover
                placement="right"
                showArrow={true}
                isOpen={isOpenPop}
                onOpenChange={(open) => setIsOpenPop(open)}
              >
                <PopoverTrigger>
                  <MoreHorizontal
                    size={18}
                    onClick={() => setIsOpenPop(true)}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <ul className="min-w-[200px] py-1 border-b">
                    <li
                      onClick={() => {
                        deleteNodeee(node);
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <Trash size={18} /> Delete
                    </li>
                    <li
                      onClick={() => {
                        addToFavvv(node, node?.isFavourite === "0" ? "1" : "0");
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      {node?.isFavourite === "0" ? (
                        <>
                          <Star size={18} /> Add to Favorites
                        </>
                      ) : (
                        <>
                          <Star size={18} color="#05686e" strokeWidth={3} />
                          Remove from Favorites
                        </>
                      )}
                    </li>
                    <li
                      onClick={() => {
                        navigator.clipboard.writeText(node?.url);
                        setIsOpenPop(false);
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <Link size={18} /> Copy link
                    </li>
                    <li
                      onClick={() => {
                        setNode(node);
                        setActions(actionList[0]);
                        onOpen();
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <Edit size={18} /> Rename
                    </li>
                    <li
                      onClick={() => {
                        setNode(node);
                        setActions({
                          title: "MoveTo",
                        });
                        onOpen();
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <CornerUpRight size={18} /> Move to
                    </li>
                  </ul>
                  <div className="py-2 w-full">
                    <h2 className="text-xs">
                      Last edited by {node.createdByUser?.fullname}
                    </h2>
                    <h2 className="text-xs">
                      Created at {dayjs(node.createdAt).format("DD/MM/YYYY")}
                    </h2>
                  </div>
                </PopoverContent>
              </Popover>
              {LabelIcon === Folder && <Plus size={18} onClick={labelClick} />}
            </Box>

            {/* <Typography variant="caption" color="inherit">
							{labelInfo}
						</Typography> */}
          </Box>
        }
        style={styleProps}
        {...other}
        ref={ref}
      />
    );
  });

  useEffect(() => {
    fetchRecent();
    fetchFavourite();
    fetchfolderStructure();
    fetchfPath();
    fetchShared();
    console.log(parentId);
    if (node && node?.parent !== "root") {
      console.log(node?.name);
      fetchfolderStructureByPath(node?.parent);
    }
    fetchfolderStructureByPath(parentId);
  }, [update, parentId,templateType]);
  // console.log(currentPage)
  return (
    <div className="lg:px-[35px] relative lg:pl-[72px] pr-0 lg:pr-4 w-full h-full">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) =>
            actions.title === "AddFolder" ? (
              <AddFolder
                addFile={createFilee}
                onClose={onClose}
                addFolder={createFolderr}
                setFolderName={setFolderName}
                folderName={folderName}
              />
            ) : actions.title === "Rename" ? (
              <RenameAction
                setUpdate={setUpdate}
                node={node}
                onClose={onClose}
                fetchfolderStructureByPath={fetchfolderStructureByPath}
              />
            ) : (
              <MoveTo
                setParentId={setParentId}
                node={node}
                onClose={onClose}
                setUpdate={setUpdate}
                folder={folder}
                activeFolderContent={activeFolderContent}
                setActiveFolderContent={setActiveFolderContent}
              />
            )
          }
        </ModalContent>
      </Modal>
      <TemporaryDrawer
        toggleDrawer={toggleDrawer}
        drawerOpen={drawer}
        content={
          <CustomTreeView
            sharedList={sharedList}
            fetchShared={fetchShared}
            setParentId={setParentId}
            rootFolders={folder}
            toggleDrawer={toggleDrawer}
            activeFolderContent={activeFolderContent}
            setActiveFolderContent={setActiveFolderContent}
            fetchRootContent={fetchfolderStructureByPath}
            isActiveLoading={isActiveLoading}
            setUpdate={setUpdate}
            actionaModalDiscl={actionaModalDiscl}
            fetchRootfolders={fetchfolderStructure}
            setDrawer={setDrawer}
            actions={actions}
            setActions={setActions}
            setNode={setNode}
            allPath={allPath}
            setCurrentPage={setCurrentPage}
            setAllPath={setAllPath}
          />
        }
      />
      <ActionsModal
        discl={actionaModalDiscl}
        actions={actions}
        currentNode={node}
        refreshParent={refreshParent}
        refreshFolder={refreshFolder}
        refreshRoot={refreshRoot}
        fetchRootContent={fetchfolderStructureByPath}
        setUpdate={setUpdate}
        rootFolder={folder}
        activeFolderContent={activeFolderContent}
        setActiveFolderContent={setActiveFolderContent}
        setParentId={setParentId}
      />
      <div className="block md:hidden bg-[#d7d7d9] border rounded-sm w-full py-1 mb-3 mt-5 px-5">
        <div className="flex flex-row gap-5">
          <button onClick={toggleDrawer(true)}>
            <Menu color="#05686E" strokeWidth={3} />
          </button>{" "}
          Templates
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div
          className={`hidden lg:flex flex-col border-r h-[calc(100vh-65px)] transition-all duration-700 ${!toolClosed ? "w-[270px] pr-4 pl-7" : "pr-0 w-0"
            } relative overflow-y-scroll overflow-x-hidden`}
        >
          <div className={!toolClosed ? "" : "hidden"}>
            <div className="hidden lg:block">
              <CustomTreeView
                fetchShared={fetchShared}
                sharedList={sharedList}
                setParentId={setParentId}
                rootFolders={folder}
                toggleDrawer={toggleDrawer}
                activeFolderContent={activeFolderContent}
                setActiveFolderContent={setActiveFolderContent}
                fetchRootContent={fetchfolderStructureByPath}
                isActiveLoading={isActiveLoading}
                setUpdate={setUpdate}
                actionaModalDiscl={actionaModalDiscl}
                fetchRootfolders={fetchfolderStructure}
                setDrawer={setDrawer}
                actions={actions}
                setActions={setActions}
                setNode={setNode}
                allPath={allPath}
                setCurrentPage={setCurrentPage}
                setAllPath={setAllPath}
              />
            </div>
          </div>
          <div
            onClick={() => setToolClosed(!toolClosed)}
            className="absolute left-full top-1/2 -translate-y-1/2 px-.5 rounded-r-3xl cursor-pointer py-5 border"
          >
            <ChevronLeft
              size={12}
              className={`transition-all duration-1000 ${toolClosed ? "rotate-180" : "rotate-0"
                }`}
            />
          </div>
        </div>
        <div
          className={`${toolClosed ? "ml-0" : "ml-0"
            } px-5 lg:pl-10 transition-all duration-100 w-full`}
        >
          <div className="flex justify-around lg:justify-end md:justify-end items-center mt-0 mb-2 lg:mt-4 md:mt-4 ">
            {
              currentPage === "root" &&
            
              <ButtonGroup className={"rounded-md bg-transparent border w-full md:w-[296px] lg:w-[296px] gap-0s"}>
                <Button className={`rounded-none bg-transparent ${templateType === "all" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("all")} >
                  All
                </Button>
                <Button className={`rounded-none bg-transparent ${templateType === "document" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("document")}>
                  Documents
                </Button>
                <Button className={`rounded-none bg-transparent ${templateType === "presentation" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("presentation")}>
                  Presentation
                </Button>
              </ButtonGroup>
            }
              <div
              className={`${currentPage === "root" ? "hidden" : "flex"
                }  flex-row gap-5 mt-0  border-[2px] rounded-full border-[#05686E] px-3 py-2 lg:py-1 md:py-1 h-full ml-4`}
            >
              <Tooltip title="List Layout" arrow>
                <button
                  onClick={() => setViewLayout("list")}
                  className="flex flex-row gap-2"
                >
                  <List
                    className="hidden lg:inline-flex"
                    color={viewLayout === "list" ? "#E8713C" : "#000000"}
                  />
                  <List
                    size={15}
                    className="inline-flex lg:hidden"
                    color={viewLayout === "list" ? "#E8713C" : "#000000"}
                  />
                </button>
              </Tooltip>
              <Tooltip title="Grid Layout" arrow>
                <button
                  onClick={() => setViewLayout("grid")}
                  className="flex flex-row gap-2"
                >
                  <LayoutGrid
                    className="hidden lg:inline-flex"
                    color={viewLayout === "grid" ? "#E8713C" : "#000000"}
                  />
                  <LayoutGrid
                    size={15}
                    className="inline-flex lg:hidden"
                    color={viewLayout === "grid" ? "#E8713C" : "#000000"}
                  />
                </button>
              </Tooltip>
            </div>
            </div>
          <div
            className={`${currentPage === "root" ? "justify-start" : "justify-between"
              } flex`}
          >
            <div className="flex mt-1 w-fit">
              <Breadcrumbs
                underline="active"
                onAction={(key) => {
                  setCurrentPage(key);
                }}
              >
                {allPath && allPath?.length > 0 ? (
                  allPath?.map((path) => {
                    // { console.log(path) }
                    return (
                      <BreadcrumbItem
                        onClick={() => {
                          if (path.name === "root") {
                            setAllPath({ name: "root", path: "root" });
                          }
                          fetchfolderStructureByPath(
                            path && path.id ? path?.id : path
                          );
                          setParentId(path && path.id ? path?.id : path);
                          setCurrentPage(path.name);
                        }}
                        key={path?.name}
                        isCurrent={currentPage === path?.name}
                      >
                        {path?.name === "root" ? "Home" : path?.name}
                      </BreadcrumbItem>
                    );
                  })
                ) : (
                  <BreadcrumbItem
                    className="hidden"
                    onClick={() => setCurrentPage("root")}
                    key={"root"}
                    isCurrent={currentPage === "root"}
                  >
                    Homes
                  </BreadcrumbItem>
                )}
              </Breadcrumbs>
            </div>
            {/* <div className="mt-0 lg:mt-2 pl-3 py-4">
              <ButtonGroup className={"rounded-md bg-transparent border"} >
                <Button className={`rounded-none bg-transparent ${templateType === "all" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("all")} >
                  All
                </Button>
                <Button className={`rounded-none bg-transparent ${templateType === "document" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("document")}>
                  Documents
                </Button>
                <Button className={`rounded-none bg-transparent ${templateType === "presentation" ? "text-[#05686E]" : "text-black"
                  }`} onPress={() => setTemplateType("presentation")}>
                  Presentation
                </Button>
              </ButtonGroup>
            </div> */}
            {/* <div
              className={`${currentPage === "root" ? "hidden" : "flex"
                }  flex-row gap-5 mt-0 lg:mt-2 border-[2px] rounded-full border-[#05686E] px-3 py-1 h-max`}
            >
              <Tooltip title="List Layout" arrow>
                <button
                  onClick={() => setViewLayout("list")}
                  className="flex flex-row gap-2"
                >
                  <List
                    className="hidden lg:inline-flex"
                    color={viewLayout === "list" ? "#E8713C" : "#000000"}
                  />
                  <List
                    size={15}
                    className="inline-flex lg:hidden"
                    color={viewLayout === "list" ? "#E8713C" : "#000000"}
                  />
                </button>
              </Tooltip>
              <Tooltip title="Grid Layout" arrow>
                <button
                  onClick={() => setViewLayout("grid")}
                  className="flex flex-row gap-2"
                >
                  <LayoutGrid
                    className="hidden lg:inline-flex"
                    color={viewLayout === "grid" ? "#E8713C" : "#000000"}
                  />
                  <LayoutGrid
                    size={15}
                    className="inline-flex lg:hidden"
                    color={viewLayout === "grid" ? "#E8713C" : "#000000"}
                  />
                </button>
              </Tooltip>
            </div> */}
          </div>
          <div className="w-full">
            {currentPage === "root" ? (
              <>
                <div className="flex w-full flex-col">
                  <FolderListingTabs
                    sharedFolder={
                      <SharedFolderList
                        Loading={Loading}
                        nodes={sharedList}
                        setParentId={setParentId}
                        fetchfolderStructureByPath={fetchfolderStructureByPath}
                        setCurrentPage={setCurrentPage}
                        parentId={parentId}
                        isActiveLoading={isActiveLoading}
                        setActions={setActions}
                        onOpen={onOpen}
                        actionList={actionList}
                        addToFavvv={addToFavvv}
                        deleteNodeee={deleteNodeee}
                        setNode={setNode}
                      />
                    }
                    recentFolder={
                      <RecentFolderList
                        setNode={setNode}
                        nodes={recentList}
                        Loading={Loading}
                        setParentId={setParentId}
                        fetchfolderStructureByPath={fetchfolderStructureByPath}
                        setCurrentPage={setCurrentPage}
                        parentId={parentId}
                        isActiveLoading={isActiveLoading}
                        setActions={setActions}
                        onOpen={onOpen}
                        actionList={actionList}
                        addToFavvv={addToFavvv}
                        deleteNodeee={deleteNodeee}
                      />
                    }
                    favFolder={
                      <FavFolderList
                        Loading={Loading}
                        nodes={FavouriteList}
                        setParentId={setParentId}
                        fetchfolderStructureByPath={fetchfolderStructureByPath}
                        setCurrentPage={setCurrentPage}
                        parentId={parentId}
                        isActiveLoading={isActiveLoading}
                        setActions={setActions}
                        onOpen={onOpen}
                        actionList={actionList}
                        addToFavvv={addToFavvv}
                        deleteNodeee={deleteNodeee}
                        setNode={setNode}
                      />
                    }
                  />
                  {/* <Tabs
										aria-label="Options"
										color="primary"
										variant="underlined"
										classNames={{
											tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
											cursor: "w-full bg-[#05686E]",
											tab: "max-w-fit px-0 h-12",
											tabContent: "group-data-[selected=true]:text-[#05686E]"
										}}
									>
										<Tab
											key="photos"
											title={
												<div className="flex items-center space-x-2">
													
													<span>Recents</span>
												
												</div>
											}
										/>
										<Tab
											key="music"
											title={
												<div className="flex items-center space-x-2">
												
													<span>Favroites</span>
												
												</div>
											}
										/>
										<Tab
											key="videos"
											title={
												<div className="flex items-center space-x-2">
											
													<span>Shared with me</span>
													
												</div>
											}
										/>
									</Tabs> */}
                </div>
                {/* <div className="flex flex-col gap-2 pt-4">
									<h1 className="text-[15px] font-[600]">Shared with me</h1>
									<SharedFolderList Loading={Loading} nodes={sharedList} setParentId={setParentId} fetchfolderStructureByPath={fetchfolderStructureByPath} setCurrentPage={setCurrentPage} parentId={parentId} isActiveLoading={isActiveLoading} setActions={setActions} onOpen={onOpen} actionList={actionList} addToFavvv={addToFavvv} deleteNodeee={deleteNodeee} setNode={setNode} />
								</div>
								<Divider sx={{ fontSize: 1, marginY: 1 }} />
								<div className="flex flex-col gap-2 pt-4">
									<h1 className="text-[15px] font-[600]">Recents</h1>
									<RecentFolderList setNode={setNode} nodes={recentList} Loading={Loading} setParentId={setParentId} fetchfolderStructureByPath={fetchfolderStructureByPath} setCurrentPage={setCurrentPage} parentId={parentId} isActiveLoading={isActiveLoading} setActions={setActions} onOpen={onOpen} actionList={actionList} addToFavvv={addToFavvv} deleteNodeee={deleteNodeee} />
								</div>
								<Divider sx={{ fontSize: 1, marginY: 1 }} />
								<div className="flex flex-col gap-2 pt-4">
									<h1 className="text-[15px] font-[600]">Favorites</h1>
									<FavFolderList Loading={Loading} nodes={FavouriteList} setParentId={setParentId} fetchfolderStructureByPath={fetchfolderStructureByPath} setCurrentPage={setCurrentPage} parentId={parentId} isActiveLoading={isActiveLoading} setActions={setActions} onOpen={onOpen} actionList={actionList} addToFavvv={addToFavvv} deleteNodeee={deleteNodeee} setNode={setNode} />
								</div> */}
                <GlobalTemplateTabs templateType={templateType} />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 pt-2">
                    <ActiveFolderList
                      setParentId={setParentId}
                      fetchfolderStructureByPath={fetchfolderStructureByPath}
                      nodes={folder}
                      activeNode={activeFolderContent}
                      viewLayout={viewLayout}
                      parentId={parentId}
                      isActiveLoading={isActiveLoading}
                      setActions={setActions}
                      onOpen={onOpen}
                      actionList={actionList}
                      setCurrentPage={setCurrentPage}
                      addToFavvv={addToFavvv}
                      deleteNodeee={deleteNodeee}
                      setNode={setNode}
                      Loading={Loading}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFolderListing;
