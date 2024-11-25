import { useEffect, useMemo, useRef, useState } from "react";
import { getUserProfile } from "@/Apis/login";
import dynamic from "next/dynamic";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getRoot,
  $getSelection,
  createEditor,
} from "lexical";
import { $createStickyNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/StickyNode";
import { $createCollapsibleTitleNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { $createCollapsibleContainerNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { $createCollapsibleContentNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode";
import InsertLayoutDialog from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog";
import { InsertTableDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createPageBreakNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PageBreakNode";
import useModal from "@/components/LexicalTemplatePlayground/lexical-playground/src/hooks/useModal";
import { InsertImageDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin";
// const InsertImageDialog = dynamic(() =>import("@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin"),{ ssr: false,loading:'loading' });
const DraggableItems = dynamic(() => import("./DraggableItems"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex  items-center justify-center"></div>
  ),
});
const EnvelopeDocument = dynamic(() => import("./EnvelopeDocument"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex  items-center justify-center">
      {/* <Spinner color="#05686e"/> */}
    </div>
  ),
});
// import Sidebar from "./Sidebar";
import { MousePointer2 } from "lucide-react";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import Cookies from "js-cookie";
import { getColorPreset } from "../../Utils/Collaboration/colorHelper";
import { Alert } from "@mui/material";
import EditorPage from "./EditorPage";
import ToolbarPlugin from "../LexicalTemplatePlayground/lexical-playground/src/plugins/ToolbarPlugin/index";
import VerticalTabs from "./SideTabs";
import { Modal, ModalContent, Spinner, useDisclosure } from "@nextui-org/react";
import { getRentalAgreementById } from "../../Apis/legalAgreement";
import { saveEnvelopeInTemplate } from "../../Apis/template";
import QuoteModal from "./QuoteBuilder/QuoteModal";
import { CommentStore } from "../LexicalTemplatePlayground/lexical-playground/src/commenting";
import ShapesTab from "./shapes/shapes";
import PlaygroundNodes from "../LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import EditorTheme from "../../components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { usePageDataStore } from "./stores/usePageDataStore";
import { useDocItemStore } from "./stores/useDocItemStore";
import { useTabsStore } from "./stores/useDocTabsStore";
import { getPageHeight, getPageWidth } from "../../lib/helpers/templateHelpers";
import { useDocHistory } from "./stores/useDocHistoryStore";

const updateSharedItem = (sharedItems, item) => {
  let index = -1;
  const array = sharedItems.getArray("fillableFields");
  if (array) {
    array.map((ele, idx) => {
      if (ele?.id === item?.id) {
        index = idx;
      }
    });
  }
  // console.log(index,item);
  if (index !== -1) {
    sharedItems.transact(() => {
      array.delete(index);
      array.push([item]);
    });
  }
};

const NewComponent = ({
  isActiveUpload,
  setIsActiveUpload,
  roomId,
  serverData,
  editorRefs,
  initialConfig,
  items,
  setItems,
  showComments,
  participants,
  setParticipants,
  isSigningOrder,
  setIsSigningOrder,
  approverSelection,
  approverSequence,
  disabledApprover,
  setApproverSelection,
  setApproverSequence,
  setGlobalEditorState,
  setEditorRefs,
  activePageIndex,
  setActivePageIndex,
  pagesData,
  setPagesData,
  docDetails,
  docId,
  setDocId,
  setDocDetails,
  docImg,
  setDocImg,
  setServerData,
  setUpdateDb,
  stampFile,
  setStampFile,
  pageOreintation,
  setPageOreintation,
  pageSize,
  setPageSize,
  setIsContactSave,
  isContactSave
}) => {
  // console.log('in new compoent');
  const [data, setData] = useState();
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  // const [selectedFieldItem, setSelectedFieldItem] = useState(null);
  const [sharedItems, setSharedItems] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [details, setDetails] = useState();
  const [pointers, setPointers] = useState([]);
  const [awarenessProvider, setAwarenessProvider] = useState(null);
  const [localClientId, setLocalClientId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [isCollabFailed, setIsCollabFailed] = useState(false);
  const [index, setIndex] = useState(0);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editorStates, setEditorStates] = useState([]);
  const [addedIndex, setAddedIndex] = useState(false);
  let item = null
  let handleRemoveItem2 = null
  const [modal, showModal] = useModal(item, handleRemoveItem2);
  const [commentData, setCommentData] = useState([]);
  const [doc, setDoc] = useState(null);
  const [copyItem, setCopiedItem] = useState(null)
  const [menuItem, setMenuItem] = useState(null)
  const [itemClicked, setItemClicked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
console.log(points)
  const { deleteItem, duplicateItem,addItem} = useDocItemStore()

  const { pages, updatePage ,isEditable} = usePageDataStore();
  const {pageSetup} = useTabsStore();
  const {addHistory}=useDocHistory()

  const handlePaste = () => {
    if (copyItem) {
      const height = getPageHeight(pageSetup);
      const width = getPageWidth(pageSetup);
      const left= `${Number(((points.x -160)/Number(width.split('px')[0]))*100)}%`
      const top=`${Number(((points.y )/Number(height.split('px')[0]))*100)}%`
      const newItem = { ...copyItem, position: { x:left, y: top}, left:left,top:top, pageIndex: activePageIndex, id: crypto.randomUUID() };
      if (newItem.type === "textArea" || newItem.type === "table") {
        const initialConfig = {
          namespace: "FreeTextfield",
          nodes: [...PlaygroundNodes],
          editorState: null,
          onError: (error) => {
            throw error;
          },
          theme: EditorTheme,
          editable: false
        }
        const newEditor = createEditor({
          ...initialConfig,
          editorState: copyItem.ref.getEditorState(),
        })
        newItem.ref = newEditor
      }
      addHistory(newItem,"item", "add")
      addItem(newItem)

      // if (!sharedItems) {
      //   setItems((prevItems) => {
      //     console.log(copyItem)
      //     if (copyItem) {
      //       const newItem = { ...copyItem, position: { x: points.x - 160, y: points.y }, pageIndex: activePageIndex, id: crypto.randomUUID() };
      //       if (newItem.type === "textArea" || newItem.type === "table") {
      //         const initialConfig = {
      //           namespace: "FreeTextfield",
      //           nodes: [...PlaygroundNodes],
      //           editorState: null,
      //           onError: (error) => {
      //             throw error;
      //           },
      //           theme: EditorTheme,
      //           editable: false
      //         }
      //         const newEditor = createEditor({
      //           ...initialConfig,
      //           editorState: copyItem.ref.getEditorState(),
      //         })
      //         newItem.ref = newEditor
      //       }
      //       return [...prevItems, newItem];
      //     }
      //     return prevItems;
      //   });
      // } else {
      //   const array = sharedItems.getArray("fillableFields");
      //   if (copyItem) {
      //     const newItem = { ...copyItem, position: { x: points.x - 160, y: points.y }, pageIndex: activePageIndex, id: crypto.randomUUID() };
      //     array.push(newItem);
      //   }
      // }
      // setMenuItem(null)
    }
  }
  const handleRemoveItem = () => {
    if (menuItem?.id) {
      deleteItem(menuItem)
      addHistory(menuItem,"item", "delete")
      // setSelectedFieldItem(menuItem);
      // if (!sharedItems) {
      //   setItems((prev) => {
      //     const index = prev.findIndex((exist) => exist?.id === menuItem?.id);
      //     if (index !== -1) {
      //       prev.splice(index, 1);
      //     }
      //     setUpdate((prev) => !prev);
      //     return prev.map((ele) => ele);
      //   });
      // } else {
      //   const array = sharedItems.getArray("fillableFields");
      //   let index = -1;
      //   array.map((ele, idx) => {
      //     if (ele?.id === item?.id) {
      //       index = idx;
      //     }
      //   });
      //   if (index !== -1) {
      //     array.delete(index);
      //   }
      // }
    }
  };

  const handleDuplicate = () => {
    if (menuItem?.id) {
     const newId= crypto.randomUUID()
      addHistory({...menuItem,id:newId},"item", "add")
      duplicateItem(menuItem,newId)
      // if (!sharedItems) {
      //   setItems((prevItems) => {
      //     const itemToDuplicate = prevItems.find((existingItem) => existingItem?.id === menuItem?.id);
      //     console.log(itemToDuplicate)
      //     const itemX = Number(itemToDuplicate.position.x.replace("%", "")) - 1
      //     const itemY = Number(itemToDuplicate.position.y.replace("%", "")) - 1
      //     if (itemToDuplicate) {
      //       const newItem = { ...itemToDuplicate, id: crypto.randomUUID() };
      //       if (newItem.type === "textArea" || newItem.type === "table") {
      //         const initialConfig = {
      //           namespace: newItem?.type,
      //           nodes: [...PlaygroundNodes],
      //           editorState: null,
      //           onError: (error) => {
      //             throw error;
      //           },
      //           theme: EditorTheme,
      //           editable: false
      //         }
      //         const newEditor = createEditor({
      //           ...initialConfig,
      //           editorState: itemToDuplicate.ref.getEditorState(),
      //         })
      //         console.log(newEditor)
      //         newItem.ref = newEditor
      //       }
      //       console.log(newItem)

      //       return [...prevItems, newItem];
      //     }

      //     return prevItems;
      //   });
      // } else {
      //   const array = sharedItems.getArray("fillableFields");
      //   const itemToDuplicate = array.find((ele) => ele?.id === item?.id);
      //   if (itemToDuplicate) {
      //     const newItem = { ...itemToDuplicate, id: crypto.randomUUID() };
      //     array.push(newItem);
      //   }
      // }
      // setMenuItem(null)
    }
  };
  const handleCopy = (item) => {
    console.log(item)
    setCopiedItem(item)
    // setMenuItem(null)
  }
  useEffect(() => {
    // console.log(commentData);
  }, [commentData]);

  const participantsIndex = useMemo(() => {
    if (
      participants &&
      participants.collaborators &&
      participants.collaborators.length > 0
    ) {
      const index = participants.collaborators.findIndex(
        (ele) => ele?.email === userDetails?.data?.email
      );
      // console.log(index);
      if (index !== -1) {
        return index;
      } else {
        return participants.collaborators.length - 1;
      }
    }
    return 0;
  }, [participants]);
  const fetchUserProfile = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
      setUserDetails(userProfile);
      // console.log("User profile data fetched:", userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const quoteBuilderModal = useDisclosure();
  const [quoteEditorRef, setQuoteEditorRef] = useState(null);
  const [quoteTargetNode, setQuoteTargetNode] = useState(null);

  const arePagesEmpty = () => {
    let isPagesEmpty = true;
    if (pages.some((ele) => ele?.isPageEmpty === false) || items.length > 0) {
      isPagesEmpty = false;
    }
    return isPagesEmpty;
  }
  const handleDragEnd = (e, editorRef) => {
    const editor = editorRef.current;
    const keys = editor
      .getEditorState()
      .read(() => $getRoot().getChildrenKeys());
    const elements = keys.map((key) => editor.getElementByKey(key));
    const distanceFromElements = elements.map((element) => {
      const { x, y } = element.getBoundingClientRect();
      const yC = (y - e.clientY) * (y - e.clientY);
      const xC = (x - e.clientX) * (x - e.clientX);
      // console.log(Math.sqrt(yC + xC));
      return Math.sqrt(yC + xC);
    });
    const minIndex = distanceFromElements.reduce(function (
      minIndex,
      currentValue,
      currentIndex,
      array
    ) {
      return currentValue < array[minIndex] ? currentIndex : minIndex;
    },
      0);
    const targetKey = keys[minIndex];
    let targetNode = null;
    let targetEle = null;
    editor.update(() => {
      targetEle = editorRef.current.getElementByKey(targetKey);
      targetNode = $getNearestNodeFromDOMNode(targetEle);
      if (targetNode) {
        const newNode = $createParagraphNode();
        switch (selectedFieldItem?.title) {
          case "text":
            newNode.append($createTextNode("Start Writing"));
            break;
          case "image":
            showModal("Insert Image", (onClose) => (
              <InsertImageDialog
                activeEditor={editorRef.current}
                onClose={onClose}
                fromEditor={true}
                targetNode={newNode}
              />
            ));
            break;
          case "table":
            showModal("Insert Table", (onClose) => (
              <InsertTableDialog
                activeEditor={editorRef.current}
                onClose={onClose}
                fromEditor={true}
                targetNode={newNode}
                setSize={null}
              />
            ));
            break;
          case "Columns Layout":
            // console.log("in image");
            showModal("Insert Columns Layout", (onClose) => (
              <InsertLayoutDialog
                activeEditor={editorRef.current}
                onClose={onClose}
                fromEditor={true}
                targetNode={targetNode}
              />
            ));
            break;
          case "Collapsible Container":
            const title = $createCollapsibleTitleNode();
            const paragraph = $createParagraphNode();
            newNode.insertAfter(
              $createCollapsibleContainerNode(true).append(
                title.append(paragraph),
                $createCollapsibleContentNode().append($createParagraphNode())
              )
            );
            break;
          case "Page-Break":
            newNode.append($createPageBreakNode());
            break;
          case "Horizontal Rule":
            newNode.append($createHorizontalRuleNode());
            break;
          case "Sticky Note":
            const root = $getRoot();
            const stickyNode = $createStickyNode(0, 0);
            // console.log(root);
            root.append(stickyNode);
            break;
          case "Quote Builder":
            setQuoteTargetNode(targetNode);
            setQuoteEditorRef(editorRef);
            quoteBuilderModal.onOpen();
            setSelectedFieldItem(null);
            break;
          default:
            newNode.append($createTextNode("Start Writing"));
            break;
        }

        targetNode.insertBefore(newNode);
        // console.log(newNode);
      }
    });
  };
  const { handleDropItem, selectedParticipant, setSelectedParticipant, setSelectedItem, selectedItem, selectedFieldItem, setSelectedFieldItem,resetItem } = useDocItemStore()
  console.log(items)
  const handleDrop = (
    e,
    pageIndex,
    editorRef,
    fromImage,
    position,
  ) => {
    // updatePage(pageIndex, { isPageEmpty: false, })
    // handleDropItem(e,pageIndex,editorRef,fromImage,position,sharedItems,updateSharedItem)

  };

  // const [selectedParticipant, setSelectedParticipant] = useState(null);
  const isAdded = useRef(false);

  useEffect(() => {
    // if(participants&&participants.collaborators&&participants.collaborators.length>0){
    const createWebsocketProvider = () => {
      const ydoc = new Doc();
      // console.log(ydoc.getArray("fillableFields").toArray());
      setLocalClientId(ydoc.clientID);
      const wsProvider = new WebsocketProvider(
        "ws://20.204.17.85:4001",
        // 'ws://localhost:4001',
        `fillable-${roomId}`,
        ydoc
      );
      // console.log(roomId);

      wsProvider.on("status", (event) => {
        if (event.status === "connected") {
          if (snackbarOpen) {
            setSnackbarOpen(false);
          }
          // console.log(event.status);
          setIsCollabFailed(false);
          setSharedItems(wsProvider.doc);
        } else {
          setIsCollabFailed(false);
        }
      });

      wsProvider.on("error", (error) => {
        // console.error("Websocket error:", error);
        if (!snackbarOpen) {
          setSnackbarMsg(
            "Our Collaboration server is not working, Retry later after sometime. Apologies for inconvenience. Contact support if problem persists. Thank you for your patience."
          );
          setSnackbarOpen(true);
        }
        setTimeout(() => {
          wsProvider.destroy();
          createWebsocketProvider();
        }, 3000);
      });

      return wsProvider;
    };
    const handleMouseMove = (e) => {
      // console.log(e.x,e.y);
      const { height, width } = document
        .getElementById("collabWrapperDiv")
        .getBoundingClientRect();
      // console.log(height,width);
      // console.log(Math.floor((Math.floor(e.x)/window.innerWidth)*100),
      // Math.floor((Math.floor(e.y)/window.innerHeight)*100))
      setMousePos({
        x: Math.floor((Math.floor(e.x) / Math.floor(width)) * 100),
        y: Math.floor(((Math.floor(e.y) - 73) / Math.floor(height)) * 100),
        // x:e.x,
        // y:e.y
      });
    };
    let awareness = null;
    let wsProvider = null;
    if (
      !sharedItems &&
      participants?.collaborators &&
      participants?.collaborators?.length > 0
    ) {
      wsProvider = createWebsocketProvider();
      awareness = wsProvider.awareness;
      setAwarenessProvider(awareness);
      // console.log('yayaya',Array.from(awareness.getStates().values()));
      // console.log(window.innerHeight, window.innerWidth);

      const clientId = awareness.clientID;
      // console.log(clientId);
      document.addEventListener("mousemove", handleMouseMove);
      const awarenessUpdateHandler = ({ added, updated, removed }) => {
        const awarenessStates = Array.from(awareness.getStates());
        // console.log(awarenessStates);
        // awarenessStates.findIndex((ele)=>)
        const index = awarenessStates.findIndex(
          (ele) => ele[0] === localClientId
        );
        if (index !== -1) {
          setIndex(index);
        }
        const filter = awarenessStates.filter(
          (ele) => ele[0] !== localClientId
        );
        setPointers(filter);
      };
      awareness.on("update", awarenessUpdateHandler);
    }

    return () => {
      if (wsProvider) {
        wsProvider.destroy();
      }
      if (awareness) {
        awareness.setLocalState(null);
        document.removeEventListener("mousemove", handleMouseMove);
      }
      // clearInterval(interval);
    };
    // }
  }, [participants?.collaborators]);

  useEffect(() => {
    // console.log(userDetails);
    if (awarenessProvider && userDetails) {
      // console.log(getColorPreset(index));
      awarenessProvider.setLocalState({
        name: userDetails?.data?.fullname,
        x: mousePos.x,
        y: mousePos.y,
        color: getColorPreset(participantsIndex),
      });
    }
  }, [mousePos, userDetails, awarenessProvider]);

  useEffect(() => {
    if (sharedItems) {
      const itemsArray = sharedItems.getArray("fillableFields");
      const updateItems = () => {
        setItems(itemsArray.toArray());
      };

      itemsArray.observe(updateItems);

      return () => {
        itemsArray.unobserve(updateItems);
      };
    }
  }, [sharedItems]);

  // useEffect(() => {
    console.log(pages);
  //   if (pages) {
  //     if (pages.some((ele) => ele?.ref === null)) {
  //       setIsLoading(true);
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }
  // }, [pages]);
  // console.log(docImg);

  const getDocDetails = async (files) => {
    setIsLoading(true);
    setIsActiveUpload(true);
    // console.log(files);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${Cookies.get("accessToken")}`);
    myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
    myHeaders.append("Cache-Control", "");
    const formdata = new FormData();
    formdata.append("participants", "me-only");
    formdata.append("signees", "[]");
    files.map((e, i) => {
      {
        // console.log(files);
      }
      if (e.type && !e.id) {
        formdata.append(`files`, files[i], `file${i}`);
      }
      // if (e.id) {
      //   formdata.append("googleDriveData", e.id);
      // }
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    let url = "https://api.lawinzo.com/node/legalAgreement/addAgreement";
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then(async (result) => {
        const data = JSON.parse(result);
        const id = data?.data?._id;
        // console.log(data);
        setDocId(id);
        setDocDetails({ ...docDetails, documents: data?.data });
        await saveEnvelopeInTemplate({
          templateId: serverData._id,
          envelopeId: id,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
    // setIsLoading(false);
  };
  const getDocImg = async (docId) => {
    // setIsLoading(true);
    const res = await getRentalAgreementById(Cookies.get("accessToken"), docId);
    if (res?.agreements[0]?.imageUrls[0] !== undefined) {
      // console.log(res);
      setDocImg(res);
      setPagesData(null);
    } else {
      setIsActiveUpload(false);
    }
    // setIsLoading(false);
  };
  function handleFileChange(event) {
    if (files.length > 0) {
      setSnackbarOpen(true);
      setSnackbarMsg("You can't select more than one document");
      return;
    }
    // console.log(event.target.files[0]);
    if (event.target.files[0]) {
      resetItem()
      setIsLoading(true);
      // console.log("in");
      if (window.FileReader && event.target.files[0]) {
        setPagesData(null);
        setFiles([...files, ...event.target.files]);
      }
    }
  }
  useEffect(() => {
    if (files && files.length > 0) {
      // console.log("in");
      getDocDetails(files);
    }
  }, [files]);
  useEffect(() => {
    if (docId) {
      // console.log(docId);
      // console.log(docDetails?._id)
      getDocImg(docId);
    }
  }, [docId]);
  const editorRef = useRef();
  const [activeRef, setActiveRef] = useState(null);
  useEffect(()=>{
    console.log(activeRef);
  },[activeRef])
  // const [selectedItem, setSelectedItem] = useState(null)

  console.log(isActiveUpload,update);
  return (
    <>
      {/* <Modal
        size="5xl"
        isOpen={quoteBuilderModal.isOpen}
        onOpenChange={quoteBuilderModal.onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent className="bg-[#eee]">
          {(onClose) => (
            <QuoteModal
              editor={quoteEditorRef}
              setEditorRef={setQuoteEditorRef}
              quoteTargetNode={quoteTargetNode}
              setQuoteTargetNode={setQuoteTargetNode}
              onClose={onClose}
            />
          )}
        </ModalContent>
      </Modal> */}
      {isCollabFailed && (
        <div className="fixed w-[calc(100vw-72px)] h-[100vh] top-0 left-[72px] flex justify-center items-start z-999 backdrop-blur-sm">
          <Alert severity="error">
            Our collaboration server is not working, Retry later after sometime.
            Apologies for inconvenience. Contact support if problem persists.
            Thank you for your patience.
          </Alert>
        </div>
      )}

      <div
        className="w-full h-[calc(100vh-65px)] flex justify-between pl-[72px] relative"
        id="collabWrapperDiv"
      >
        {pointers &&
          pointers.length > 0 &&
          pointers.map((ele, index) => {
            // console.log(ele);
            if (ele[0] !== localClientId) {
              return (
                <span
                  key={ele[0]}
                  style={{
                    position: "absolute",
                    top: `${ele[1].y}%`,
                    left: `${ele[1].x}%`,
                    transition: "all 650ms",
                    zIndex: 100,
                    color: ele[1]?.color,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MousePointer2 color={ele[1]?.color} fill={ele[1]?.color} />
                  <p
                    style={{ backgroundColor: ele[1]?.color }}
                    className="text-white text-[10px] bg-gray-200 p-[2px] rounded-lg font-semibold"
                  >
                    {ele[1].name ? ele[1]?.name : "collaborator"}
                  </p>
                </span>
              );
            }
          })}
        {/* {!disabledApprover ? (
          <></>
        ) : (
          <div className=""></div>
        )} */}
{/* {    console.log(activeRef)} */}
        <div
          className={`relative w-full flex justify-start  flex-col  ${!isActiveUpload && "mt-[35px] h-[calc(100vh-101px)]"
            } py-10 overflow-auto bg-[#eee]  ${pageOreintation === 'landscape' ? 'px-10' : 'px-0'}`}
            id='pages-scroller'
        >
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center ">
              <Spinner
                color="#05686e"
                label="Preparing Template..."
                size="lg"
                classNames={{
                  circle1: "border-b-[#05686e]",
                  circle2: "border-b-[#05686e]",
                  label: "text-[#05686e] text-[18px]",
                }}
              />
            </div>
          )}
          <>
            {isActiveUpload ? (
              <EnvelopeDocument
                handleRemoveItem={handleRemoveItem}
                handlePaste={handlePaste}
                handleCopy={handleCopy}
                handleDuplicate={handleDuplicate}
                setActiveRef={setActiveRef}
                handleDrop={handleDrop}
                participants={participants}
                serverData={serverData}
                setSelectedFieldItem={setSelectedFieldItem}
                updateSharedItem={updateSharedItem}
                sharedItems={sharedItems}
                items={items}
                setItems={setItems}
                docImg={docImg}
                update={update}
                setUpdate={setUpdate}
                menuItem={menuItem}
                setMenuOpen={setMenuOpen}
                setMenuItem={setMenuItem}
                setItemClicked={setItemClicked}
                itemClicked={itemClicked}
                setCopiedItem={setCopiedItem}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                pageOreintation={pageOreintation}
                setPoints={setPoints}
                menuOpen={menuOpen}
                points={points}
                copyItem={copyItem}
                setActivePageIndex={setActivePageIndex}
                selectedFieldItem={selectedFieldItem}
              />
            ) : (
          
              pages &&
              pages[activePageIndex] &&
              pages[activePageIndex]?.ref?.current && isEditable && (
                <>
                  {activeRef ? (
                    <ToolbarPlugin
                      activeEditorRef={activeRef}
                      setIsLinkEditMode={setIsLinkEditMode}
                      pageOreintation={pageOreintation}
                      setPageOreintation={setPageOreintation}
                    />
                  ) 
                  // : (
                  //   <>
                  //     <ToolbarPlugin
                  //       activeEditorRef={
                  //         pages[activePageIndex]?.ref?.current
                  //           ? pages[activePageIndex]?.ref?.current
                  //           : pages[0]?.ref?.current
                  //       }
                  //       setIsLinkEditMode={setIsLinkEditMode}
                  //       pageOreintation={pageOreintation}
                  //       setPageOreintation={setPageOreintation}
                  //     />
                  //   </>
                  // )
                  :null
                  }
                </>
              )
            )}
            {(update || !update) && !isActiveUpload &&
              pages?.map((ele, index) => {
                console.log(ele.id)
                return (
                  <EditorPage
                    setMenuOpen={setMenuOpen}
                    menuOpen={menuOpen}
                    setItemClicked={setItemClicked}
                    itemClicked={itemClicked}
                    handleCopy={handleCopy}
                    setMenuItem={setMenuItem}
                    menuItem={menuItem}
                    handleDuplicate={handleDuplicate}
                    handleRemoveItem={handleRemoveItem}
                    copyItem={copyItem}
                    setPoints={setPoints}
                    points={points}
                    handlePaste={handlePaste}
                    setCopiedItem={setCopiedItem}
                    setActiveRef={setActiveRef}
                    activeRef={activeRef}
                    files={files}
                    setFiles={setFiles}
                    setUpdateDb={setUpdateDb}
                    handleFileChange={handleFileChange}
                    docImg={docImg}
                    setDocImg={setDocImg}
                    docId={docId}
                    setDocId={setDocId}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    docDetails={docDetails}
                    setDocDetails={setDocDetails}
                    pageId={ele.id}
                    key={ele.id}
                    setUpdate={setUpdate}
                    pagesData={pagesData}
                    editorStates={editorStates}
                    setEditorStates={setEditorStates}
                    setAddedIndex={setAddedIndex}
                    addedIndex={addedIndex}
                    isAdded={isAdded}
                    pageIndex={index}
                    pageNo={ele?.pageNo}
                    initialConfig={initialConfig}
                    setGlobalEditorState={setGlobalEditorState}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    roomId={roomId}
                    handleDrop={handleDrop}
                    selectedFieldItem={selectedFieldItem}
                    showComments={showComments}
                    participants={participants}
                    serverData={serverData}
                    participantsIndex={participantsIndex}
                    setEditorRefs={setEditorRefs}
                    items={items}
                    setItems={setItems}
                    setSelectedFieldItem={setSelectedFieldItem}
                    sharedItems={sharedItems}
                    updateSharedItem={updateSharedItem}
                    setPagesData={setPagesData}
                    setActivePageIndex={setActivePageIndex}
                    activePageIndex={activePageIndex}
                    modal={modal}
                    // commentStore={commentStore}
                    commentData={commentData}
                    setCommentData={setCommentData}
                    selectedParticipant={selectedParticipant}
                    pageOreintation={pageOreintation}
                    setPageOreintation={setPageOreintation}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                  />
                );
              })}
          </>
        </div>
        <VerticalTabs
          handleFileChange={handleFileChange}
          isActiveUpload={isActiveUpload}
          DraggableItems={
            <DraggableItems
              isDisabled={isActiveUpload}
              setOffsetX={setOffsetX}
              setOffsetY={setOffsetY}
              setSelectedFieldItem={setSelectedFieldItem}
              selectedFieldItem={selectedFieldItem}
              selectedParticipant={selectedParticipant}
              setSelectedParticipant={setSelectedParticipant}
              editorRef={editorRefs}
              disabledApprover={disabledApprover}
              recipients={
                participants &&
                  participants.recipients &&
                  participants.recipients.length > 0
                  ? participants.recipients
                  : []
              }
              participants={participants}
              setParticipants={setParticipants}
              serverData={serverData}
              doc={doc}
            />
          }
          ShapeTab={
            <ShapesTab
              setSelectedFieldItem={setSelectedFieldItem}
              selectedFieldItem={selectedFieldItem}
              selectedParticipant={selectedParticipant}
              setSelectedParticipant={setSelectedParticipant}
            />
          }
          docDetails={docDetails}
          setDocDetails={setDocDetails}
          roomId={roomId}
          data={serverData}
          participants={participants}
          setParticipants={setParticipants}
          isSigningOrder={isSigningOrder}
          setIsSigningOrder={setIsSigningOrder}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          disabledApprover={disabledApprover}
          approverSequence={approverSequence}
          setApproverSequence={setApproverSequence}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          approverSelection={approverSelection}
          setApproverSelection={setApproverSelection}
          items={items}
          setItems={setItems}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          setUpdate={setUpdate}

          // selectedItem={selectedItem}
          doc={doc}
          setDoc={setDoc}
          stampFile={stampFile}
          setStampFile={setStampFile}
          pageOreintation={pageOreintation}
          setPageOreintation={setPageOreintation}
          pageSize={pageSize}
          setPageSize={setPageSize}
          arePagesEmpty={arePagesEmpty}
          isContactSave={isContactSave}
          setIsContactSave={setIsContactSave}
          setSelectedFieldItem={setSelectedFieldItem}
          setDocId={setDocId}
          setIsLoading={setIsLoading}
          setIsActiveUpload={setIsActiveUpload}
          serverData={serverData}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
        />
        {/* <Sidebar
          roomId={roomId}
          data={serverData}
          participants={participants}
          setParticipants={setParticipants}
          isSigningOrder={isSigningOrder}
          setIsSigningOrder={setIsSigningOrder}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          disabledApprover={disabledApprover}
          approverSequence={approverSequence}
          setApproverSequence={setApproverSequence}
          approverSelection={approverSelection}
          setApproverSelection={setApproverSelection}
        /> */}
      </div>

    </>
  );
};

export default NewComponent;
