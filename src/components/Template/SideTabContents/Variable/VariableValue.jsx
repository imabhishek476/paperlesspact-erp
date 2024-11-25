import { TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { updateVariableWithTemplate } from "../../../../Apis/variable";
import { useTabsStore } from "../../stores/useDocTabsStore";
import { usePageDataStore } from "../../stores/usePageDataStore";
import {
  $createMentionNode,
  MentionNode,
} from "../../../LexicalTemplatePlayground/lexical-playground/src/nodes/VariableNode";
import { $getNodeByKey, $isElementNode, $nodesOfType } from "lexical";
import { formatDate } from "@/Utils/dateTimeHelpers";
import { useDocItemStore } from "../../stores/useDocItemStore";

// import { replaceNode } from "../../../../lib/helpers/templateHelpers";

const VariableValue = ({ item }) => {
  const [value, setValue] = useState(item.value);
  const { update, setUpdate } = useState();
  const router = useRouter();
  const { updateVariables } = useTabsStore();
  const { id } = router.query;
  const TemplateId = id;
  const { pages,isEditable } = usePageDataStore();
  const { items } = useDocItemStore();
  console.log(item);

  const handleVariableValue = async (e) => {
    if (e.target.value) {
      console.log(e.target.value);
      setValue(e.target.value);
    }
  };



  return (
    // <div className="">
    <TextField
      type={item.type}
      fullWidth
      disabled={!isEditable}
      value={value}
      onChange={(e) => handleVariableValue(e)}
      hiddenLabel
      id="filled-hidden-label-small"
      // onKeyDown={async (event) => {
      //   if (event.key === "Enter") {
      //     if (event.currentTarget.value === "") {
      //       return;
      //     }
      //     const obj = {
      //       id: item?.id,
      //       templateId: TemplateId,
      //       value: event.target.value,
      //     };
      //     console.log(obj);
      //     setValue(event.target.value);
      //     const response = await updateVariableWithTemplate(obj);
      //     for(const page of pages){
      //       if(!page?.ref?.current){
      //         throw Error(`Page: ${page} has no ref`);
      //       }
      //       page?.ref?.current?.update(()=>{
      //         const variableNodes = $nodesOfType(MentionNode);
      //         for(const variableNode of variableNodes){
      //           // debugger;
      //           if(variableNode.__varName === item.name){
      //             const newVarNode = $createMentionNode(event.target.value,item.name);
      //           const replacedNode = variableNode.replace(newVarNode);
      //           console.log(replacedNode);
      //           }
      //         }
      //       })
      //     }
      //     updateVariables();
      //   }
      // }}
      onBlur={async (event) => {
        if (event.currentTarget.value) {
          // debugger;
          const obj = {
            id: item?.id,
            templateId: TemplateId,
            value: event.target.value,
          };
          console.log(obj);
          setValue(event.target.value);
          const response = await updateVariableWithTemplate(obj);
          for (const page of pages) {
            if (!page?.ref?.current) {
              throw Error(`Page: ${page} has no ref`);
            }
            page?.ref?.current?.update(() => {
              const variableNodes = $nodesOfType(MentionNode);
              for (const variableNode of variableNodes) {
                // debugger;
                console.log(variableNode);
                if (variableNode.__varName === item.name) {
                  // const newVarNode = $createMentionNode(event.target.value,item.name);
                  // console.log(newVarNode);
                  // if(!newVarNode.__parent){
                  //   const parentNode = $getNodeByKey(variableNode.__parent);
                  //   // debugger;
                  //   replaceNode(newVarNode,false,parentNode,variableNode,page?.ref?.current);
                  // }else{
                  //   const replacedNode = variableNode.replace(newVarNode);
                  //   console.log(replacedNode);
                  // }
                  let value = event.target.value;
                  if (item.type === "date") {
                    const date = event.target.value;
                    const formattedDate = date.split("-");
                    value = `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
                  }
                  console.log(value);
                  const writable = variableNode.getWritable();
                  writable.__mention = value;
                  writable.setTextContent(value);
                  console.log(writable);
                }
              }
            });
          }
          for (const textItems of items) {
            // debugger;
            if (
              (textItems?.type === "textArea" ||
              textItems?.type === "table") && textItems?.ref
            ) {
              textItems?.ref?.update(() => {
                const variableNodes = $nodesOfType(MentionNode);
                for (const variableNode of variableNodes) {
                  // debugger;
                  console.log(variableNode);
                  if (variableNode.__varName === item.name) {
                    // const newVarNode = $createMentionNode(event.target.value,item.name);
                    // console.log(newVarNode);
                    // if(!newVarNode.__parent){
                    //   const parentNode = $getNodeByKey(variableNode.__parent);
                    //   // debugger;
                    //   replaceNode(newVarNode,false,parentNode,variableNode,page?.ref?.current);
                    // }else{
                    //   const replacedNode = variableNode.replace(newVarNode);
                    //   console.log(replacedNode);
                    // }
                    let value = event.target.value;
                    if (item.type === "date") {
                      const date = event.target.value;
                      const formattedDate = date.split("-");
                      value = `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
                    }
                    console.log(value);
                    const writable = variableNode.getWritable();
                    writable.__mention = value;
                    writable.setTextContent(value);
                    console.log(writable);
                  }
                }
              });
            }
          }
          updateVariables();
        }
      }}
      // color="secondary"
      variant="outlined"
      size="small"
      placeholder="none"
    />
    // </div>
  );
};

export default VariableValue;
