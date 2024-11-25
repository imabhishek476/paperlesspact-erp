import {
  Button,
  Card,
  CardBody,
  Divider,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GestureIcon from "@mui/icons-material/Gesture";
import { InputAdornment, TextField } from "@mui/material";
import dynamic from 'next/dynamic';
const AddSignFromText = dynamic(()=>import('./AddSignFromText'));
const AddSignFromImage = dynamic(()=>import('./AddSignFromImage'));
const AddSignFromDraw = dynamic(()=>import('./AddSignFromDraw'));
// import AddSignFromText from "./AddSignFromText";
// import AddSignFromImage from "./AddSignFromImage";
// import AddSignFromDraw from "./AddSignFromDraw";
import Otp from "@/components/Auth/Aadhar/OTP";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { requestAadharOTP } from "@/Apis/aadhar";
import { useRouter } from "next/router";
import { Dancing_Script } from "next/font/google";
import { formatDate } from "@/Utils/dateTimeHelpers";


const dancingScript = Dancing_Script({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dancingScript",
});

const SignModal = ({
  onClose,
  selectedFieldItem,
  selectedSignee,
  setItems,
  auth, setAuth
  
}) => {
  const [field, setField] = useState(
    selectedFieldItem ? selectedFieldItem?.field : "Signature"
  );
  const [image, setImage] = useState(null);
  const [aadharStatus, setAadharStatus] = useState(false);
  const [aadhar, setAadhar] = useState(null);
  const [aadharRequestId,setAadharRequestId] = useState(null);
  const [taskId , setTaskId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aadharData, setAadharData] = useState(null);
  const [tab, setTab] = useState("image");
  const {id} = useRouter().query
  const index = id && id.includes("-") ? id.split("-")[1] : -1;
  const extractedId = id && id.includes("-") ? id.split("-")[0] : id;
  // useEffect(()=>{
  //   if(aadharStatus === "verified"){
  //     setAuth(false)
  //   }
  // },[aadharStatus])
  const verifyAadhar = () => {
    const requestAadhar = async(aadharNumber, taskId) => {
      setIsSubmitting(true)
      const res = await requestAadharOTP(aadharNumber, taskId)
      if(res?.response_message === "Valid Authentication" && res?.result?.is_otp_sent){
        setAadharRequestId(res?.request_id)
        setTaskId(res?.task_id)
        setAadharStatus("requested")
      }
      setIsSubmitting(false)
    }
    const taskId = `${extractedId}-${index}`
    requestAadhar(aadhar,taskId)
  };
  const onSign = (bigImage, signAll, width) => {
    console.log("SIGN", bigImage);
    if(typeof bigImage === "string"){
      if (selectedFieldItem?.id) {
        if (signAll) {
          setItems((prev) => {
            console.log
            const all = prev.filter(
              (el) =>
                el.signee?.fullname === selectedSignee?.fullname
            );
            // console.log(el.field === selectedFieldItem?.field)
            let temp = prev;
            for (const item of all) {
              // const index = temp.findIndex((el) => el.id === item.id);
              if ((item.field === "Signature" && selectedFieldItem.field === "Signature") || (item.field === "Initials" && selectedFieldItem.field === "Initials")){
                temp = temp.filter((currItem) => item.id !== currItem.id);
                temp.push({
                  ...item,
                  image: bigImage,
                });
              } 
              if(selectedFieldItem.field === "Signature" && item.field === "Date Signed"){
                temp = temp.filter((currItem) => item.id !== currItem.id);
                temp.push({
                  ...item,
                  text: formatDate(new Date()),
                });
              }
            }
            console.log(all);
            return temp;
          });
        } else {
          setItems((prev) => {
            if (prev.some((el) => el.id === selectedFieldItem.id)) {
              const index = prev.findIndex(
                (el) => el.id === selectedFieldItem.id
              );
              console.log(index);
              const temp = prev.filter(
                (item) => item.id !== selectedFieldItem.id
              );
              console.log(temp);
              console.log(bigImage);
              temp.push({
                ...selectedFieldItem,
                image: bigImage,
              });
              console.log(temp);
              return temp;
            } else {
              return prev;
            }
          });
        }
        // setItems((prev) => {
        //   const index = prev.findIndex((el) => el.id === selectedFieldItem.id);
        //   const removed = prev.splice(index, 1);
        //   prev.push({
        //     ...selectedFieldItem,
        //     image: image,
        //   });
        //   return prev
        // });
        onClose();
      }
    } else {
      const img = new Image();
      console.log(bigImage)
      img.onload = async function () {
        const canvas2 = document.createElement('canvas');
        canvas2.setAttribute("width", width ? width:250 );
        canvas2.setAttribute("height", 51);
        const ctx2 = canvas2.getContext('2d');  
        ctx2.drawImage(img, 0, 0,width ? width: 250 ,51); // Or at whatever offset you like
        const dataUrl2 = canvas2.toDataURL();
        await fetch(dataUrl2)
        .then((response) => response.blob())
        .then((blob) => {
          const image = new File([blob], "sample.png", { type: blob.type });
          console.log(signAll)
          if (selectedFieldItem?.id) {
            if (signAll) {
              setItems((prev) => {
                const all = prev.filter(
                  (el) =>
                    el.signee?.fullname === selectedSignee?.fullname
                );
                let temp = prev;
                console.log(temp)
                for (const item of all) {
                  // const index = temp.findIndex((el) => el.id === item.id);
                  if ((item.field === "Signature" && selectedFieldItem.field === "Signature") || (item.field === "Initials" && selectedFieldItem.field === "Initials")){
                    temp = temp.filter((currItem) => item.id !== currItem.id);
                    temp.push({
                      ...item,
                      image: image,
                    });
                  } 
                  if(selectedFieldItem.field === "Signature" && item.field === "Date Signed"){
                    temp = temp.filter((currItem) => item.id !== currItem.id);
                    temp.push({
                      ...item,
                      text: formatDate(new Date()),
                    });
                  }
                }
                console.log(all);
                return temp;
              });
            } else {
              setItems((prev) => {
                console.log(prev)
                if (prev.some((el) => el.id === selectedFieldItem.id)) {
                  const index = prev.findIndex(
                    (el) => el.id === selectedFieldItem.id
                  );
                  console.log(index);
                  const temp = prev.filter(
                    (item) => item.id !== selectedFieldItem.id
                  );
                  console.log(temp);
                  console.log(image);
                  temp.push({
                    ...selectedFieldItem,
                    image: image,
                  });
                  console.log(temp);
                  return temp;
                } else {
                  return prev;
                }
              });
            }
            // setItems((prev) => {
            //   const index = prev.findIndex((el) => el.id === selectedFieldItem.id);
            //   const removed = prev.splice(index, 1);
            //   prev.push({
            //     ...selectedFieldItem,
            //     image: image,
            //   });
            //   return prev
            // });
            onClose();
          }
        });
      };
      img.src = URL.createObjectURL(bigImage);
    }
    
  };
  const onAadharSign = async() => {
    const {user_full_name} = aadharData?.result
    setAuth(false)
    const canvas = document.createElement('canvas');
      canvas.setAttribute("width", 300);
      canvas.setAttribute("height", 50);
      const ctx = canvas.getContext('2d');
      ctx.font = `30px ${dancingScript.style.fontFamily}`;
      let width
      if(field === "Initials"){
        const matches = user_full_name.match(/\b(\w)/g); // ['J','S','O','N']
        const acronym = matches.join("");
        ctx.fillText(acronym, 10, 30);
        width = ctx.measureText(acronym)
        // ctx.scale(0.1,0.1)
      } else {
        ctx.fillText(user_full_name, 10, 30);
        width = ctx.measureText(user_full_name)
      }
      const dataUrl = canvas.toDataURL();
      await fetch(dataUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "sample.png", { type: blob.type });
        console.log(file)
        onSign(file, true);
      });
  }
  return (
    <ModalContent>
      {(onClose) => (
        <>
          {auth ? (
            <div className="__variable_598ead font-sans">
              <ModalHeader className="flex flex-col gap-1">
                <span className="__variable_598ead font-sans">
                  Aadhar Verification
                </span>
              </ModalHeader>
              <Divider />
              <ModalBody>
                {aadharStatus === "requested" ? (
                  <Otp
                    aadharNumber={aadhar}
                    setAadharStatus={setAadharStatus}
                    fromSigning={true}
                    aadharRequestId={aadharRequestId}
                    taskId={taskId}
                    setAadharRequestId={setAadharRequestId}
                    setAadharData={setAadharData}
                  />
                ) : (
                  <>
                    <TextField
                      sx={{ mb: 0, mt: 2, width: "100%" }}
                      id="outlined-basic"
                      autoComplete="false"
                      label="Aadhar Number"
                      required
                      variant="outlined"
                      value={aadhar}
                      onChange={(event) => {
                        setAadhar(event.target.value);
                      }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        if (e.target.value.length > 0) {
                          e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .slice(0, 12);
                        }
                      }}
                      disabled={aadharStatus === "verified"}
                      InputProps={{
                        maxLength: 12,
                        endAdornment: (
                          <InputAdornment position="end">
                            {aadharStatus === "verified" ? (
                              <CheckCircleOutlineIcon className="text-success" />
                            ) : (
                              <Button
                                type="button"
                                size="md"
                                radius="sm"
                                className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                                onClick={verifyAadhar}
                                isLoading={isSubmitting}
                              >
                                Verify
                              </Button>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
              {aadharStatus === "verified" && 
                <Button
                  color="secondary"
                  variant="shadow"
                  onPress={() => onAadharSign()}
                >
                  Confirm
                </Button>}
              </ModalFooter>
            </div>
          ) : (
            <div className="__variable_598ead font-sans">
              <ModalHeader className="flex flex-col gap-1 text-[#05686E] text-[20px]">
                Add {field}
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col">
                  <Tabs
                    // aria-label="Dynamic tabs"
                    selectedKey={tab}
                    onSelectionChange={setTab}
                    classNames={{
                      tabList: "w-full",
                      cursor: "w-full bg-[#05686E]",
                      //   tab: "w-full",
                      tabContent: "group-data-[selected=true]:text-[#FFFFFF]",
                    }}
                    // items={tabs}
                  >
                    <Tab
                      title={
                        <>
                          <TextFieldsIcon className="pe-1" />
                          Type {field}
                        </>
                      }
                      key={"text"}
                    >
                      <AddSignFromText
                        onSign={onSign}
                        field={field}
                        selectedFieldItem={selectedFieldItem}
                        setImage={setImage}
                      />
                    </Tab>
                    <Tab
                      title={
                        <>
                          <FileUploadIcon className="pe-1" />
                          Upload {field}
                        </>
                      }
                      key={"image"}

                    >
                      <AddSignFromImage
                        onSign={onSign}
                        field={field}
                        setImage={setImage}
                      />
                    </Tab>
                    <Tab
                      title={
                        <>
                          <GestureIcon className="pe-1" />
                          Draw {field}
                        </>
                      }
                      key={"draw"}

                    >
                      <AddSignFromDraw
                        field={field}
                        onSign={onSign}
                        setImage={setImage}
                      />
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
            </div>
          )}
        </>
      )}
    </ModalContent>
  );
};

export default SignModal;
