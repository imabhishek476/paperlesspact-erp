import { TextField } from "@mui/material";
import { Button, Card, CardBody, ModalFooter, Switch } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "@win11react/react-canvas-draw";

const AddSignFromDraw = ({ onSign, field, fromDashboard }) => {
  const canvas = useRef(null);
  const [all, setAll] = useState(true);
  const signHandler = async () => {
    const url = canvas.current.getDataURL("image/png");
    const img = new Image();
      img.onload = async function () {
        const canvas2 = document.createElement('canvas');
        canvas2.setAttribute("width", 250);
        canvas2.setAttribute("height", 71);
        const ctx2 = canvas2.getContext('2d');  
        ctx2.drawImage(img, 5, 10, 200,61);
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
        const dataUrl2 = canvas2.toDataURL();
        await fetch(dataUrl2)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "sample.png", { type: blob.type });
          console.log(file)
          onSign(file, all);
        });
      };
    img.src = url;
  };
  const clear = () => {
    canvas.current.clear();
  };
  return (
    <>
      <Card className="min-h-[100px] ">
        <CardBody className="w-full flex items-center justify-center">
          <CanvasDraw
            brushColor={"#000"}
            brushRadius={1}
            hideGrid={true}
            canvasHeight="150px"
            canvasWidth="350px"
            ref={canvas}
            hideInterface
            className="border-2"
          />
        </CardBody>
      </Card>
      <div className="min-h-[75px] flex justify-between items-center">
        <span className="text-[14px]">Sign Above</span>
        <Button size="sm" radius="sm" variant="flat" onPress={clear}>
          Clear
        </Button>
      </div>
      { !fromDashboard &&
      <div className="block">
        <Switch color="secondary" isSelected={all} onValueChange={setAll}>
          Insert {field} in all places.
        </Switch>
      </div>
      }
      <span className="text-xs text-[#000]">
        By clicking the button below I understand and agree that this is a legal
        representation of my signature .
      </span>
      <ModalFooter className="px-0">
        <Button
          color="secondary"
          variant="shadow"
          onPress={signHandler}
        >
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
};

export default AddSignFromDraw;
