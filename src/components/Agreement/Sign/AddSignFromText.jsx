import { TextField } from '@mui/material';
import { Button, Card, CardBody, ModalFooter, Switch } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { Dancing_Script, Caveat, Shadows_Into_Light, Indie_Flower } from "next/font/google";

const dancingScript = Dancing_Script({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dancingScript",
});
const caveatF = Caveat({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-caveatF",
});
const shadowsIntoLight = Shadows_Into_Light({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-shadowsIntoLight",
});
const indieFlower = Indie_Flower({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-shadowsIntoLight",
});
const fontArray = [
  dancingScript.style.fontFamily,
  caveatF.style.fontFamily,
  shadowsIntoLight.style.fontFamily,
  indieFlower.style.fontFamily,
]

const AddSignFromText = ({onSign, field,selectedFieldItem,fromDashboard}) => {
    const [text, setText] = useState(selectedFieldItem?.signee?.fullname ? selectedFieldItem?.signee?.fullname : "")
    const [all, setAll] = useState(true) 
    const [initials, setInitials] = useState(null)
    const [font, setFont] = useState(fontArray[0])
    const onSignHandler = async ()=>{
      const canvasWidth = field === "Initials"? 250 :( text.length * 24 < 300 ? 300 : text.length * 20)
      const canvas = document.createElement('canvas');
      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", 90);
      const ctx = canvas.getContext('2d');
      console.log(font)
      ctx.font = field === "Initials"?`40px ${font}`:`40px ${font}`;
      let width
      if(field === "Initials"){
        ctx.fillText(initials, 15, 70);
        width = ctx.measureText(initials)
        // ctx.scale(0.1,0.1)
      } else {
        ctx.fillText(text, 15, 70);
        width = ctx.measureText(text)
      }
      ctx.beginPath(); 
      ctx.strokeStyle = '#151513'; 
      ctx.lineWidth = 4; 
      ctx.moveTo(0, 10);
      ctx.lineTo(30,  10);
      ctx.font = "20px Ariel"
      ctx.fillText("Signed using EaseDraft", 45, 15);
      ctx.moveTo(0, 10);
      ctx.lineTo(0, ctx.canvas.height );
      ctx.moveTo(0, ctx.canvas.height );
      ctx.lineTo(field === "Initials"? 100 : ctx.measureText(text).width , ctx.canvas.height);
      ctx.stroke();
     
      console.log(ctx.canvas.height)
      const dataUrl = canvas.toDataURL();
      await fetch(dataUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "sample.png", { type: blob.type });
          console.log(dataUrl)
          onSign(file, all);
        });
    }
    useEffect(()=>{
      if(field === "Initials" && text.length > 0){
       const matches = text.match(/\b(\w)/g); // ['J','S','O','N']
       const acronym = matches.join("");
       setInitials(acronym);
      } else {
        setInitials("");
      }
    }, [text])
  return (
    <>
      <Card className="min-h-[100px] ">
        <CardBody className="w-full flex items-center justify-center mb-4">
          <span className="text-[26px]" style={{ fontFamily: font }}>
            {field === "Initials" ? initials : text}
          </span>
        </CardBody>
      </Card>
      <div className="min-h-[150px]">
        <TextField
          fullWidth
          autoComplete="off"
          id="outlined-basic"
          label="Name"
          placeholder="Enter Your Name"
          variant="outlined"
          className="mt-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div
          className="flex gap-2 overflow-x-auto flex-nowrap mt-4 mb-2 pb-2 customScrollBar"
          style={{
            scrollbarWidth: "5px",
          }}
        >
          {(initials || text) &&
            fontArray.map((item, index) => {
              return (
                <Button
                  onPress={() => setFont(item)}
                  radius="sm"
                  variant="flat"
                  className="p-3 px-4 min-w-fit"
                  key={index}
                  style={{
                    border: font === item && "1px solid #05686E",
                  }}
                >
                  <span className="text-[20px]" style={{ fontFamily: item }}>
                    {field === "Initials" ? initials : text}
                  </span>
                </Button>
              );
            })}
        </div>
      </div>
      { !fromDashboard &&
      <div className='block'>
        <Switch color="secondary" isSelected={all} onValueChange={setAll}>
          Insert {field} in all places.
        </Switch>
      </div> }
      <span className="text-xs text-[#000]">
        By clicking the button below I understand and agree that this is a legal
        representation of my signature .
      </span>
      <ModalFooter className="px-0">
        <Button
          color="secondary"
          variant="shadow"
          onPress={() => onSignHandler()}
        >
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
}

export default AddSignFromText