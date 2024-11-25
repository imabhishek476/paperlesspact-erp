import Image from "next/image";
import React, { useEffect, useState } from "react";
import PagesPreviewPane from "./PagesPreviewPane";
import PagePreview from "./PagePreview";
import ActionBar from "./ActionBar";
import Cookies from "js-cookie";
import { getRentalAgreementById, prepareDocument } from "@/Apis/legalAgreement";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import Footer from "./Footer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getUserProfile } from "@/Apis/login";
import WestIcon from "@mui/icons-material/West";
import { useRouter } from "next/router";
import { Alert, Snackbar } from "@mui/material";
import LoadingPage from "@/components/LoadingPage/loadingPage";

const colors = [
  {
    color: "rgba(0, 112, 240,0.2)",
    variant: "primary",
  },
  {
    color: "rgba(245, 165, 36,0.2)",
    variant: "warning",
  },
  {
    color: "rgba(243, 83, 96,0.2)",
    variant: "danger",
  },
];


const PrepareDocumentPage = ({ id }) => {
  const [agreement, setAgreement] = useState(null);
  const [isPageLoading,setIsPageLoading] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(null);
  const [offsetY, setOffsetY] = useState(null);
  const [items, setItems] = useState([]);
  const [signees,setSignees] = useState(null);
  const [selectedFieldItem, setSelectedFieldItem] = useState(null);
  const [selectedSignee, setSelectedSignee] = useState(null);
  const [isLoading,setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [snackbarOpen,setSnackbarOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const index = id && id.includes("-") ? id.split("-")[1] : -1;
  const extractedId = id && id.includes("-") ? id.split("-")[0] : id;
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  const getAgreement = async () => {
    // console.log(id);

    // console.log(extractedId);
    setIsPageLoading(true);
    try {
      if (!id || !accessToken) {
        throw Error("No id or accessToken provided");
      }
      const response = await getRentalAgreementById(accessToken, extractedId);
      console.log(response?.agreements[currentDocumentIndex]?.items);
      if(response?.isExpired==="1"||response?.isExpired===1){
        router.push("/expired");
      }
      setAgreement(response);
      setSignees(response?.signees.map((signee,index)=>{
        return {
          ...signee,
          color: colors[index%3].color,
          variant: colors[index%3].variant,
        }
      }));
      if(response?.agreements[currentDocumentIndex]?.items){
        console.log(response?.agreements[currentDocumentIndex]?.items);
        setItems(response?.agreements[currentDocumentIndex]?.items);
      }
      console.log(response.agreements[0]);
      setIsPageLoading(false);
      return response;

    } catch (err) {
      console.log(err);
    setIsPageLoading(false);

    }
  };

  const handlePageIndexChange = (index) => {
    setCurrentPageIndex(index);
  };
  console.log(items);
  const handleAdditem = (selectedFieldItem, pageIndex, posX, posY) => {
    if (selectedFieldItem?.id) {
      setItems((prev) => {
        const index = prev?.findIndex((el) => el.id === selectedFieldItem.id);
        if (index !== -1) {
          const removed = prev?.splice(index, 1);
        }
        // console.log(index)
        // prev[index] = {
        //   ...selectedFieldItem,
        //   left:posX,
        //   top:posY,
        //   pageIndex,
        // }
        prev.push({
          ...selectedFieldItem,
          left: posX,
          top: posY,
          pageIndex,
          isSigned:"0",
        });
        setSelectedFieldItem(null);

        return prev;
      });

      //   if(items.some(el => el.id === selectedFieldItem.id)){
      //   } else {
      // console.log(items.length);

      //     setItems((prev)=>{
      //       prev.push({
      //         ...selectedFieldItem,
      //         left:posX,
      //         top:posY,
      //         pageIndex,
      //       });
      //       setSelectedFieldItem(null)
      //       return prev;
      //     });
      //   }
    }
  };

  const handleRemoveItem = (item) => {
    if (item?.id) {
      setSelectedFieldItem(item);
      setItems((prev) => {
        const index = prev.findIndex((exist) => exist?.id === item?.id);
        if (index !== -1) {
          prev.splice(index, 1);
        }
        setUpdate((prev) => !prev);
        return prev;
      });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
      setDetails(userProfile);
      // console.log("User profile data fetched:", userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = () =>{
    setIsLoading(true);
    const prepare = async(documentId,items,accessToken)=>{
      const response = await prepareDocument(documentId,items,agreement?._id,accessToken)
      if(response){
       router.push(`/document/preview?id=${id}`) 
      setIsLoading(false);
      }
    }
    console.log(items);
    const documentId = agreement?.agreements[currentDocumentIndex]?._id;
    let temp = true;
    if(!items||(items&&!items.length>0)){
      temp =  false;
    }
    if(agreement&&agreement?.signees&&agreement?.signees.length>0&&items){
      for(let i=0;i<agreement?.signees.length;i++){
        console.log(items.some((item)=>item.signee.fullname===agreement?.signees[i].fullname));
        if(agreement?.signees[i].signerRole==="Signer"&&!items.some((item)=>item.signee.fullname===agreement?.signees[i].fullname)){
          temp =  false;
        }
      }
    }
    if(temp){
      prepare(documentId,items,accessToken);
    }else{
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  }

  const isItemsValidated = () => {
    if(!items||(items&&!items.length>0)){
      return false;
    }
    if(agreement&&agreement?.signees&&agreement?.signees.length>0&&items){
      for(let i=0;i<agreement?.signees.length;i++){
        console.log(items.some((item)=>item.signee.fullname===agreement?.signees[i].fullname));
        if(!items.some((item)=>item.signee.fullname===agreement?.signees[i].fullname)){
          return false;
        }
      }
    }
    return true;
  }  

  const handleDocumentBack = () => {
    if (agreement?._id) {
      router.push(`/document/new?id=${agreement?._id}`);
    }
  };

  useEffect(() => {
    getAgreement();
    fetchUserProfile();
  }, [id]);
  console.log(items);


  useEffect(()=>{
    if(currentDocumentIndex>-1&&agreement?.agreements[currentDocumentIndex]?.items){
      setItems(agreement?.agreements[currentDocumentIndex]?.items);
    }else{
      setItems([]);
    }
  },[currentDocumentIndex])

  // console.log(items);
  // console.log(details?.data?.fullname);

  if(isPageLoading){
    return (
      <LoadingPage/>
    )
  }

  return (
    <>
    <Snackbar
    open={snackbarOpen}
    onClose={()=>setSnackbarOpen(false)}
    autoHideDuration={4000}
    >
    <Alert severity="error">Add atleast one field of each signee</Alert>
    </Snackbar>
    <div className=" relative flex flex-col ">
      <div className="flex justify-between items-center h-[7vh] px-2">
        <div className="flex items-center gap-4">
          <Button
            // variant="bordered"
            radius="sm"
            className="hidden lg:flex bg-[#fda178]  text-[10px] lg:text-[14px]"
            // startContent={<ArrowBackIosIcon/>}
            onPress={() => handleDocumentBack()}
          >
            <WestIcon className="text-[14px]" />
            <p className="hidden lg:block">{"Document Settings"}</p>
          </Button>
          <Button isIconOnly className="lg:hidden bg-white" onPress={() => handleDocumentBack()}>
            <WestIcon className="text-[24px]" />
          </Button>
          <p className="hidden lg:block text-[16px] lg:text-[20px] font-semibold text-[#151513]">
            Prepare Document
          </p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="capitalize text-[16px]"
              endContent={<KeyboardArrowDownIcon />}
              isDisabled={!agreement?._id}
            >
              {agreement?.agreements[currentDocumentIndex]?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            onAction={(index) => setCurrentDocumentIndex(index)}
          >
            {agreement &&
              agreement?.agreements.length > 0 &&
              agreement?.agreements.map((document, index) => {
                return (
                  <DropdownItem key={index}>{document?.name}</DropdownItem>
                );
              })}
          </DropdownMenu>
        </Dropdown>
        <div className="flex flex-col items-end text-[9px] ">
          <p>Powered By</p>
          <Image
            height={30}
            width={130}
            src={"/images/logo-light.png"}
            alt="laiwnzo logo"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 h-[93vh]">
        <PagesPreviewPane
          document={
            agreement?.agreements &&
            agreement?.agreements.length > 0 &&
            currentDocumentIndex !== -1
              ? agreement?.agreements[currentDocumentIndex]
              : null
          }
          currentDocumentIndex={currentDocumentIndex}
          handlePageIndexChange={handlePageIndexChange}
          currentPageIndex={currentPageIndex}
        />
        <PagePreview
          documentPages={
            agreement?.agreements
              ? agreement?.agreements[currentDocumentIndex]?.imageUrls
              : null
          }
          currentPageIndex={currentPageIndex}
          items={items}
          handleAdditem={handleAdditem}
          handleRemoveItem={handleRemoveItem}
          offsetX={offsetX}
          offsetY={offsetY}
          setOffsetX={setOffsetX}
          setOffsetY={setOffsetY}
          selectedFieldItem={selectedFieldItem}
          setSelectedFieldItem={setSelectedFieldItem}
          onOpen={onOpen}
          selectedSignee={selectedSignee}
          setUpdate={setUpdate}
          update={update}
          signees={signees}
          setSelectedSignee={setSelectedSignee}
          allowedName={
            details && details?.data && details?.data?.fullname
              ? details?.data?.fullname
              : null
          }
        />
        <ActionBar
          setOffsetX={setOffsetX}
          setOffsetY={setOffsetY}
          setSelectedFieldItem={setSelectedFieldItem}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          selectedFieldItem={selectedFieldItem}
          setItems={setItems}
          selectedSignee={selectedSignee}
          setSelectedSignee={setSelectedSignee}
          signees={signees}
          allowedName={
            details && details?.data && details?.data?.fullname
              ? details?.data?.fullname
              : null
          }
        />
        <Footer
          selectedSignee={selectedSignee}
          setSelectedSignee={setSelectedSignee}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          signees={signees}
        />
      </div>
    </div>
    </>
  );
};

export default PrepareDocumentPage;
