import React, { useEffect, useMemo, useState } from "react";
import SideNav from "../Navbar/SideNav/Dashboard/SideNav";
// import NewComponent from "./NewComponent";
import dynamic from "next/dynamic";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SettingsContext } from "../LexicalTemplatePlayground/lexical-playground/src/context/SettingsContext";
import PlaygroundNodes from "../LexicalTemplatePlayground/lexical-playground/src/nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "../LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import { Edit } from "lucide-react";
import { EditorProvider } from '../LexicalTemplatePlayground/lexical-playground/src/context/EditorProvider';
import { getRentalAgreementById } from "../../Apis/legalAgreement";
import Cookies from "js-cookie";
import EditorTheme from "../../components/LexicalTemplatePlayground/lexical-playground/src/themes/PlaygroundEditorTheme";
import { useDocItemStore } from "./stores/useDocItemStore";
import { useRouter } from "next/router";
import { usePageDataStore } from "./stores/usePageDataStore";
import { getPageHeight, pixelToNumber, updateBorderFromPosition } from "../../lib/helpers/templateHelpers";
import { useTabsStore } from "./stores/useDocTabsStore";
import { pageSetupOptions } from "../../lib/constants/page";

const NavBar = dynamic(() => import('./Navbar'), {
  ssr: false, loading: () => {
    return (<div className="w-full h-[65px]"></div>)
  }
});
const NewComponent = dynamic(() => import('./NewComponent'), {
  ssr: false, loading: () => {
    return (<div className="w-full h-[65px]"></div>)
  }
});
const pagesetupOptions = [
  {
    title: "Letter",
    size: {
      height: '1056px',
      width: '816px'
    }
  },
  {
    title: "A4",
    size: {
      height: '1080px',
      width: '768px'
    }
  },
  {
    title: "Legal",
    size: {
      height: '1346px',
      width: '816px'
    }
  },
];


const getSize = (size) => {
  if (!size) {
    return pagesetupOptions[1]?.size;
  }
  const item = pagesetupOptions.find((ele) => ele.size.height === size.height);
  if (item) {
    return item?.size;
  }
  return pagesetupOptions[1]?.size;
}


const NewTemplateComponent = ({ document, roomId, data, ancestors, user,userRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(data);
    const [approverSelection, setApproverSelection] = useState(data?.approvers?.length > 0)
  const [currentApprover, setCurrentApprover] = useState(false)
  const [approverSequence, setApproverSequence] = useState(false)
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [updateDb, setUpdateDb] = useState(true);
  const [stampFile, setStampFile] = useState();
  const { serverData, setServerData,setPageHeader,setHeaderActive,setFooterActive,setPageFooter,setActiveHeaderFooterPageHeight,setShowPageNo } = usePageDataStore();
  const {setPageSetup} = useTabsStore();
  const [pageOreintation, setPageOreintation] = useState(data?.pageSetup ? data?.pageSetup?.orientation : 'portrait');
  const [pageSize, setPageSize] = useState(
    data?.pageSetup ? getSize(data?.pageSetup?.size) : {
      height: '1080px',
      width: '768px'
    }
  );
  let parsedData;
  try {
    if (typeof data?.editorState === "string") {
      parsedData = JSON.parse(data?.editorState);
    } else {
      parsedData = data?.editorState
    }

  } catch (error) {
    parsedData = [];
  }
  const [isContactSave, setIsContactSave] = useState(false);
  console.log(data?.editorState?.length)
  const [pagesData, setPagesData] = useState(
    parsedData && parsedData?.length > 0
      ? parsedData?.map((ele, index) => {
        { console.log(ele?.pageBg) }
        return {
          pageNo: index + 1,
          ref: null,
          isPageEmpty: false,
          isDbInit: false,
          bgColor: ele?.pageBg || "#fff",
        }
      })
      : [
        {
          pageNo: 1,
          ref: null,
          isPageEmpty: true,
          isDbInit: false,
          bgColor: "#FFF",
          id: crypto.randomUUID()
        }
      ])

  const [disabledApprover] = useState(!(data?.approvers?.every(el => el?.status === "approved" || el?.status === "rejected")) && data?.approverStatus === 'sent');
  // console.log(parsedData[0]?.editorHeader)
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
  const getIsEditable = ()=>{
    let edit = true;
    if(disabledApprover){
      edit = false;
    }
    switch (userRole){
      case 'approver':
        edit = false;
        break;
      case 'owner':
        if(data?.approverStatus === 'approved'){
            edit = false;
        }  
        if(data?.approverStatus === 'sent'){
          edit = false;
        }
        if(data?.scope === "global" && data?.published === "1"){
          edit = false;
        }
    }
    return edit;
  }
  const initialConfig = {
    // editorState:  '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Start Writing Here .......","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    editorState:null,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    // editable:getIsEditable(),
    editable:getIsEditable(),
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };


  // const [items, setItems] = useState(data?.items || []);
  const { items, addItem, setItems } = useDocItemStore()
  const { setPages, pages,setIsEditable } = usePageDataStore();
  const [globalEditorState, setGlobalEditorState] = useState({});
  // console.log(globalEditorState)


  const [docId, setDocId] = useState()

  const updateItemsWithCorrectPage = (items, document) => {
    const tempItems = items?.length > 0 ? [...items] : []
    console.log(tempItems[0])
    const pageBreakElements = document.querySelectorAll('[type="page-break"]');
    console.log(pageBreakElements);
    let pageIndex = 0
    for (let j = 0; j < tempItems?.length; j++) {
      const itemDiv = document.getElementById(tempItems[j].id)
      const itemRect = itemDiv?.getBoundingClientRect()
      const rectTop = itemRect.y
      if (rectTop) {
        if (!(pageBreakElements?.length > 0)) {
          pageIndex = 0;
        } else {
          for (let i = 0; i < pageBreakElements.length; i++) {
            const pageBreakElement = pageBreakElements[i];
            const nextPageBreakElement = pageBreakElements[i + 1];
            const rect = pageBreakElement?.getBoundingClientRect();
            const nextRect = nextPageBreakElement?.getBoundingClientRect();
            console.log(rectTop >= rect.top &&
              (nextRect ? rectTop <= nextRect.top : true))
            // Check if the dropped block is within the bounds of the current and next pageBreakElements
            if (
              rectTop >= rect.top &&
              (nextRect ? rectTop <= nextRect.top : true)
            ) {
              pageIndex = i + 1;
              break;
            } else if (
              i === pageBreakElements.length - 1 &&
              nextRect &&
              rectTop > nextRect.top
            ) {
              // If the element is dropped after the last page break
              pageIndex = pageBreakElements.length;
            }
          }
        }
      }
      if (pageIndex > 0) {
        const refPageBreak = pageBreakElements[pageIndex - 1]
        const refRect = refPageBreak.getBoundingClientRect()
        const top = itemRect.y - refRect.y
        const left = itemRect.left - refRect.x
        console.log(Math.floor(((top) / 1080) * 100) + '%')
        console.log(Math.floor(((left) / 764) * 100) + '%')
        tempItems[j] = {
          ...tempItems[j],
          top: Math.floor(((top) / 1080) * 100) + '%',
          left: Math.floor(((left) / 764) * 100) + '%'
        }
      }
      if (pageIndex === 0) {
        tempItems[j] = {
          ...tempItems[j],
          top: tempItems[j].position.y,
          left: tempItems[j].position.x
        }

      }
    }
    console.log(tempItems)
    return tempItems
  };
  const [showComments, setShowComments] = useState(false);
  const [participants, setParticipants] = useState(data?.participants);
  const [isSigningOrder, setIsSigningOrder] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState('');
  const [editorRefs, setEditorRefs] = useState([]);
  const [docImg, setDocImg] = useState(null)
  const [isActiveUpload, setIsActiveUpload] = useState(false);
  // const {isActiveUpload,setIsActiveUpload}=useTabsStore()
  const [docDetails, setDocDetails] = useState({
    documents: {},
    emailTemplate: {
      title: "Signature Requested on Document Added with Link",
      message: `${user?.fullname ? user.fullname : "User"
        } has requested your signature on document & it's ready for review and signing.\n\nKindly go through it and complete the signing process.\n\nClick on the link below to sign the document. Once all parties finish signing, You will receive a copy of the executed document`,
    },
    clientFile: null,
    participantType: '',
    settings: {
      autoReminder: true,
      requiredAllSigners: true,
      expires: "1d",
    }
  })

  // console.log(data)
  console.log(pagesData)

  useEffect(() => {
    const getEnvelope = async (id, accessToken) => {
      const res = await getRentalAgreementById(accessToken, id)
      console.log(res)
      if (res) {
        setDocDetails((prev) => {
          return {
            ...prev,
            documents: res
          }
        })
        setDocId(res._id)
        setDocImg(res)
        setIsActiveUpload(true)
        setPagesData(null)
        setPages([])
        if(data?.items?.length>0){
          setItems(data?.items)
        }
      }
    }
    if (data?.envelopeId) {
      const accessToken = Cookies.get("accessToken")
      getEnvelope(data?.envelopeId, accessToken)
    }

  }, [data])
  const router = useRouter()
  const templateId = router.query.id;
  useEffect(() => {
    console.log(pagesData);
    setPages(pagesData)
    const newItems = []
    data?.items?.map((item, index) => {
      console.log(item)
      newItems.push({
        ...item, position: updateBorderFromPosition(false, pageSize, {
          x: item?.left ? item?.left : item?.position?.x ? item?.position.x : '10%',
          y: item?.top ? item?.top : item?.position?.y ? item?.position.y : '10%'
        }, {x:3,y:3}),
      })
    })
    if(newItems.length>0){
      const backgroundItemWithPageIndex = {
        id: `backgroundItem0`,
        type: "background",
        pageIndex: 0,
      };
      
      if(!(newItems.some((item)=>item.type==='background' && item.pageIndex===0)))
      newItems.unshift(backgroundItemWithPageIndex);

      setItems(newItems)
    } else{
      const backgroundItemWithPageIndex = {
        id: `backgroundItem0`,
        type: "background",
        pageIndex: 0,
      };
      newItems.unshift(backgroundItemWithPageIndex);
      setItems(newItems)
    
    }
    setServerData(data);
    setDocDetails({...docDetails,settings:data?.settings})
    setShowPageNo(data?.showPageNo)
    if(data?.pageSetup?.orientation && data?.pageSetup?.size){
      setPageSetup(data?.pageSetup);
    }
    if(data?.approverStatus){
      setIsEditable(getIsEditable());
    }
    if(data?.scope==="global"){
      setIsEditable(getIsEditable());
    }
    if(parsedData?.length>0){
      let tempHeight = pixelToNumber(getPageHeight(data?.pageSetup));
      if(parsedData[0].editorHeader || newItems?.some((el)=>el?.from==="EditorHeader") ){
        setHeaderActive(true)
        // const obj=JSON.stringify(parsedData[0].editorHeader)
        tempHeight -=128; 
        setPageHeader({editorStateDb:parsedData[0].editorHeader,pageNo:null})
      }
      if(parsedData[0].editorFooter || newItems?.some((el)=>el?.from==="EditorFooter") ){
        setFooterActive(true);
        tempHeight -=128;
        // const obj=JSON.stringify(parsedData[0].editorFooter)
        setPageFooter({editorStateDb:parsedData[0].editorFooter,pageNo:null})
      }
      setActiveHeaderFooterPageHeight(`${tempHeight}px`)
      }
      else{
        setActiveHeaderFooterPageHeight(getPageHeight(data?.pageSetup));
      }
  }, [templateId])

  console.log(serverData)


  if (isPreparing) {
    return (<LoadingPage />)
  }
  // console.log(items);
  return (
    <>
      <SideNav />
      <NavBar
        updateDb={updateDb}
        setServerData={setServerData}
        isActiveUpload={isActiveUpload}
        setIsActiveUpload={setIsActiveUpload}
        docDetails={docDetails}
        setDocDetails={setDocDetails}
        title={
          <div className="flex gap-2 items-center" onDoubleClick={() => {
            if(!getIsEditable()) return;
            if (name === '') {
              setName(data?.name);
            }
            setEditable(true);
          }}>
            {/* <p className="text-[10px] text-[#05686e] truncate max-w-[40vw] ">{ancetsorString}</p> */}
            {
              editable
                ? <input
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      if (event.currentTarget.value === "") {
                        return;
                      }
                      setName(event.currentTarget.value);
                      setEditable(false);
                    }
                  }}
                  tabIndex={0}
                  onBlur={(event) => {
                    if (event.currentTarget.value === "") {
                      return;
                    }
                    setName(event.currentTarget.value);
                    setEditable(false);
                  }
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoFocus={true}
                  className="p-3 max-w-[40vw] w-auto h-full text-[16px] text-[#05686e] font-medium bg-transparent active:border-none border-[#05686e] border-1"
                  placeholder="Rename"
                /> :
                (<>
                  <p className="font-bold text-[16px] text-[#05686E] truncate max-w-[40vw] ">{ancetsorString} {name ? name : data?.name}</p>
                  <Edit size={18} color="#05686e" onClick={() => {
                    if(!getIsEditable()) return;
                    if (name === '') {
                      setName(data?.name);
                    }
                    setEditable((prev) => !prev)
                  }} />
                </>)
            }
          </div>}
        cta={"Save"}
        // templateUseTitle={approverSelection && data.approverStatus !== "approved" ? ((currentApprover && data?.approverStatus === "sent")?"Approve":"Send for approval") : 'Prepare for sign'}
        items={items}
        setItems={addItem}
        name={name}
        pagesData={pagesData}
        showComments={showComments}
        setShowComments={setShowComments}
        participants={participants}
        isSigningOrder={isSigningOrder}
        isPreparing={isPreparing}
        setIsPreparing={setIsPreparing}
        disabledApprover={disabledApprover}
        approverSelection={approverSelection}
        updateItemsWithCorrectPage={updateItemsWithCorrectPage}
        currentApprover={currentApprover}
        setCurrentApprover={setCurrentApprover}
        approverSequence={approverSequence}
        setApproverSequence={setApproverSequence}
        setApproverSelection={setApproverSelection}
        setIsSigningOrder={setIsSigningOrder}
        data={data}
        stampFile={stampFile}
        setStampFile={setStampFile}
        pageSize={pageSize}
        pageOreintation={pageOreintation}
        isContactSave={isContactSave}
        setIsContactSave={setIsContactSave}
      />
      <SettingsContext>
        <NewComponent
          setUpdateDb={setUpdateDb}
          setServerData={setServerData}
          docDetails={docDetails}
          setDocDetails={setDocDetails}
          isActiveUpload={isActiveUpload}
          setIsActiveUpload={setIsActiveUpload}
          pagesData={pagesData}
          setPagesData={setPagesData}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setEditorRefs={setEditorRefs}
          initialConfig={initialConfig}
          setGlobalEditorState={setGlobalEditorState}
          editorRefs={editorRefs}
          roomId={roomId}
          serverData={serverData}
          items={items}
          setItems={addItem}
          showComments={showComments}
          participants={participants}
          setParticipants={setParticipants}
          disabledApprover={disabledApprover}
          approverSequence={approverSequence}
          setApproverSequence={setApproverSequence}
          approverSelection={approverSelection}
          setApproverSelection={setApproverSelection}
          currentApprover={currentApprover}
          setCurrentApprover={setCurrentApprover}
          isSigningOrder={isSigningOrder}
          setIsSigningOrder={setIsSigningOrder}
          docId={docId}
          setDocId={setDocId}
          docImg={docImg}
          setDocImg={setDocImg}
          stampFile={stampFile}
          setStampFile={setStampFile}
          pageOreintation={pageOreintation}
          setPageOreintation={setPageOreintation}
          pageSize={pageSize}
          setPageSize={setPageSize}
          isContactSave={isContactSave}
          setIsContactSave={setIsContactSave}
        // setDocDetails={setDocDetails}
        />

      </SettingsContext>
    </>
  );
};

export default NewTemplateComponent;
