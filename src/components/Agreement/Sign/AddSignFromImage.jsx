import { TextField } from '@mui/material';
import { Button, Card, CardBody, ModalFooter, Switch } from '@nextui-org/react';
// import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getUserSignature } from '@/Apis/legalAgreement';

const fontArray = [
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
    "sans",
]

const AddSignFromImage = ({onSign, field,fromDashboard}) => {
    const [image, setImage] = useState(null)
    const fileInput = useRef(null);
    const [all, setAll] = useState(true) 
    async function getUserSignatureData () {
      const data = await getUserSignature()
      console.log(data)
      if(data){
        setImage(
          field === "Signature"? data.signUrl : data.initialsUrl
          )
      }
    }
    useEffect(()=>{
      getUserSignatureData()
    } ,[])
    const handleFileInputChange = (e) => {
        if(e.target.files && e.target.files.length > 0){
          const img = new Image();
        img.onload = async function () {
        console.log("yay")
        const canvas2 = document.createElement('canvas');
        canvas2.setAttribute("width", 250);
        canvas2.setAttribute("height", 71);
        const ctx2 = canvas2.getContext('2d');  
        // ctx2.drawImage(img, 5, 10, 200,61);
        ctx2.drawImage(img, 10,10,200,61)
        ctx2.beginPath(); 
        ctx2.strokeStyle = '#151513'; 
        ctx2.lineWidth = 4; 
        ctx2.moveTo(0, 10);
        ctx2.lineTo(30,  10);
        ctx2.font = "20px Ariel"
        ctx2.fillText("Signed using EaseDraft", 45, 15);
        ctx2.moveTo(0, 10);
        ctx2.lineTo(0, ctx2.canvas.height );
        ctx2.moveTo(0, ctx2.canvas.height );
        ctx2.lineTo(200 , ctx2.canvas.height);
        ctx2.stroke(); // Or at whatever offset you like
        // if(!fromDashboard){
        // }
        const dataUrl2 = canvas2.toDataURL();
        await fetch(dataUrl2)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "sample.png", { type: blob.type });
          console.log(file)
          // onSign(file, all);
          setImage(file)
        });
      };
      img.src = URL.createObjectURL(e.target.files[0]);
        }
    };
    const handleClick = () => {
        fileInput.current.click();
      };
  return (
    <>
      <Card className="min-h-[100px] ">
        <CardBody className="w-full flex items-center justify-center">
          {image && <img src={typeof image === "string" ? image : URL.createObjectURL(image)} width={"100%"} />}
        </CardBody>
      </Card>
      <div className="min-h-[120px]">
        <div className="w-full border border-dotted border-[#d3d3d3] mt-3 p-3">
          <input
            // accept={accept}
            // multiple={multiple}
            type="file"
            ref={fileInput}
            onChange={handleFileInputChange}
            accept=".png"
            hidden
          />
          <UploadFileIcon sx={{ fontSize: "40px" }} onClick={handleClick} />
          Upload Signature in PNG format.
        </div>        
      </div>
      { !fromDashboard &&
      <div className='block'>
        <Switch color="secondary" isSelected={all} onValueChange={setAll}>
          Insert {field} in all places.
        </Switch>
      </div>}
      <span className="text-xs text-[#000]">
        By clicking the button below I understand and agree that this is a legal
        representation of my signature .
      </span>
      <ModalFooter className="px-0">
        <Button
          color="secondary"
          variant="shadow"
          isDisabled={image? false : true}
          onPress={() => onSign(image,all)}
        >
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
}

export default AddSignFromImage