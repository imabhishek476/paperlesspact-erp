import { Button } from "@nextui-org/react";
import React from "react";
import { usePageStore } from "../stores/usePageStore";
import { useItemStore } from "../stores/useItemStore";
import ShapeConfigTab from "./ShapeConfigTab";
import { Divider } from "@mui/material";
import { usePresHistory } from "../stores/usePresHistoryStore";

const heading = {
  editorState:"{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":1,\"mode\":\"normal\",\"style\":\"font-size: 60px;\",\"text\":\"Add a heading\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
  html :"<p class=\"PlaygroundEditorTheme__paragraph\" dir=\"ltr\"><b><strong class=\"PlaygroundEditorTheme__textBold\" style=\"font-size: 60px; white-space: pre-wrap;\">Add a heading</strong></b></p>",
  size: {
    height: "20%",
    width: "50%",
  }
}
const subheading = {
  editorState:"{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":1,\"mode\":\"normal\",\"style\":\"font-size: 40px;\",\"text\":\"Add a subheading\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
  html :"<p class=\"PlaygroundEditorTheme__paragraph\" dir=\"ltr\"><b><strong class=\"PlaygroundEditorTheme__textBold\" style=\"font-size: 40px; white-space: pre-wrap;\">Add a subheading</strong></b></p>",
  size: {
    height: "20%",
    width: "50%",
  }
}
const body = {
  editorState:"{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"font-size: 24px;\",\"text\":\"Add a little bit of body text\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
  html :"<p class=\"PlaygroundEditorTheme__paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"font-size: 28px; white-space: pre-wrap;\">Add a little bit of body text</span></p>",
  size: {
    height: "20%",
    width: "50%",
  }
}
const baseItem = {
  editorState:"{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"font-size: 18px;\",\"text\":\"Your Paragraph Text\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"center\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
  html :"<p class=\"PlaygroundEditorTheme__paragraph\" dir=\"ltr\" style=\"text-align: center;\"><span style=\"font-size: 18px; white-space: pre-wrap;\">Your Paragraph Text</span></p>",
  size: {
    height: "20%",
    width: "50%",
  }
}




const getBasicTextItem = (pageIndex, variant, container,items) => {
  let transformStr
  if(container){
    const {height, width,x,y} = container.getBoundingClientRect()
    transformStr = {translate:[width/2, height/2,0],rotate:0}
  }
  let highestLayer = -Infinity;
        items.forEach((obj) => {
          if (obj.layer > highestLayer) {
            highestLayer = obj.layer;
          }
        });
  let base = {
    id: crypto.randomUUID(),
    type: "text",
    position: {
      posX: "50%",
      posY: "50%",
    },
    size: {
      height: "20%",
    width: "50%",
    },
    transformObject:transformStr,
    pageIndex: pageIndex,
    options: {
      opacity:1
    },
    layer: 2
  }
  if(variant === "heading"){
    base = {...base, ...heading }
  }if(variant === "subHeading"){
    base = {...base, ...subheading }
  }
  if(variant === "body"){
    base = {...base, ...body }
  }
  if(variant === "base"){
    base = {...base, ...baseItem }
  }
  const {height, width } = container?.getBoundingClientRect();
  const posX = 50 - (Math.floor(((base?.size?.width?.split("%")[0])))/2) + "%";
  const posY = 50 - (Math.floor(((base?.size?.height?.split("%")[0])))/2) + "%";
  console.log(base.size)
  base={...base, position:{
    posX,posY
  }}
  return base;
};

const TextTab = () => {
  const { selectedPage , setIsDragginginStore} = usePageStore();
  const { addItem, items } = useItemStore();
  const {addHistory} = usePresHistory()
  return (
    <div className="flex-col gap-2">
      <div className="p-4 border-b-2">
        <p className="text-[14px] text-[#05686e]">Text</p>
      </div>
      <div className="h-[calc(100vh-120px)] overflow-scroll ">
      <Button
        size="lg"
        radius="sm"
        color="primary"
        className="w-full mt-2"
        onPress={() => {
          setIsDragginginStore((prev)=>!prev)
          const text =getBasicTextItem(selectedPage?.pageIndex || 0,"base",document.getElementById("currentPage"),items)
          addItem(text)
          addHistory(text,"item","add")
        }}
      >
        Add Text Box
      </Button>
      <Divider className="my-4" />
      <Button
        size="lg"
        radius="sm"
        variant="bordered"
        color="primary"
        className="w-full mt-2 text-2xl  font-bold"
        onPress={() => {
          setIsDragginginStore((prev)=>!prev)
          const text=getBasicTextItem(selectedPage?.pageIndex || 0, "heading",document.getElementById("currentPage"),items)
          addItem(text)
          addHistory(text,"item","add")
        }}
      >
        Add a heading
      </Button>
      <Button
        size="lg"
        radius="sm"
        variant="bordered"
        color="primary"
        className="w-full mt-2 text-md  font-bold"
        onPress={() => {
          setIsDragginginStore((prev)=>!prev)
          const text = getBasicTextItem(selectedPage?.pageIndex || 0,"subHeading",document.getElementById("currentPage"),items)
          addItem(text)
          addHistory(text,"item","add")
        }}
      >
        Add a subheading
      </Button>
      <Button
        size="lg"
        radius="sm"
        variant="bordered"
        color="primary"
        className="w-full mt-2 text-sm"
        onPress={() => {
          setIsDragginginStore((prev)=>!prev)
          const text =getBasicTextItem(selectedPage?.pageIndex || 0,"body",document.getElementById("currentPage"),items)
          addItem(text)
          addHistory(text,"item","add")
        }}
      >
        Add a little bit of body text
      </Button>
      </div>
      {/* {selectedItem?.type === 'text' &&
        <ShapeConfigTab />
      } */}
    </div>
  );
};

export default TextTab;
