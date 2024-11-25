import React, { useEffect, useState } from "react";
import { useDocItemStore } from "@/components/Template/stores/useDocItemStore";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getSVG } from "../shapes/shapeSvgConstants";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { $getRoot } from "lexical";
import {$generateHtmlFromNodes} from '@lexical/html';
import { $getElementForTableNode } from "@lexical/table";



const LayerItemRenderer = ({
  item,
}) => {
  const {
    updateItem,
    deleteItem,
    setSelectedFieldItem,
    items,
    setSelectedItem,
    selectedItem,
  } = useDocItemStore();

  switch (item?.type) {
    // case "text":
    //   return <TextFillableField key={item.id} item={item} items={items} />;
    // case "image":
    //   return <ImageFillableField key={item.id} item={item} items={items} />;
    // case "radio":
    //   return (
    //     <RadioButtonFillableField key={item.id} item={item} items={items} />
    //   );
    // case "checkbox":
    //   return <CheckboxFillableField key={item.id} item={item} items={items} />;
    // case "dropdown":
    //   return <DropdownFillableField key={item.id} item={item} items={items} />;
    // case "file":
    //   return <FileFillableField key={item.id} item={item} items={items} />;
    // case "payment":
    //   return <PaymentFillableField key={item.id} item={item} items={items} />;
    case "video":
      return <VideoFillableField key={item.id} item={item} items={items} />;
    case "inEditorImage":
      return <InEditorImage key={item.id} item={item} items={items} />;
    case "textArea":
      return <TextAreaField key={item.id} item={item} items={items} />;
    case "shape":
      return <ShapeField key={item.id} item={item} items={items} />;
    case "table":
      return <TableField key={item.id} item={item} items={items} />;
      case "background":
        return <Background item={item}/>
    default:
      return <></>;
  }
};

export default LayerItemRenderer;

export function Background({item}){
  console.log(item);
  const [size, setSize] = useState(item.size);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: item.id });
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};

  return (
    <div ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    draggable={true} className="flex items-center justify-center w-full">
                      <div className="h-[50px] w-full flex justify-center max-w-[180px] flex-2 items-center ">
                          <div className="h-[25px] bg-white w-full">

                          </div>
                        </div>
                        <div className="justify-end flex items-center">
                          <GripVertical />
                        </div>
                        
                      </div>
  )
}

export function ShapeField({ item }) {
  console.log(item);
  const [size, setSize] = useState(item.size);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: item.id });
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};
  const [svg, setSvg] = useState(
    getSVG(
      item.title,
      item.options,
      item.size,
      item?.orientation,
      false,
      null,
      item.id
    )
  );
  const [options, setOptions] = useState(item.options);

  useEffect(() => {
    setSvg(
      getSVG(item.title, options, size, item?.orientation, false, null, item.id)
    );
    // if (sharedItems) {
    //   updateSharedItem(sharedItems, {
    //     ...item,
    //     svg: renderToString(
    //       getSVG(item.title, options, size, item?.orientation,false,null,item.id)
    //     ),
    //     size: size,
    //     options: options,
    //   });
    // } else {
    //   updateItem({...item,
    //     svg: renderToString(
    //       getSVG(
    //         item.title,
    //         options,
    //         { height: size.height, width: size.width },
    //         item?.orientation,
    //         false,
    //         null,
    //         item.id
    //       )
    //     ),
    //     size: size,
    //     options: options,
    //   })
    //   // setItems((prev) => {
    //   //   const index = prev.findIndex((el) => el.id === item.id);
    //   //   if (index !== -1) {
    //   //     const removed = prev.splice(index, 1);
    //   //   }
    //   //   prev.push({
    //   //     ...item,
    //   //     svg: renderToString(
    //   //       getSVG(
    //   //         item.title,
    //   //         options,
    //   //         { height: size.height, width: size.width },
    //   //         item?.orientation
    //   //       )
    //   //     ),
    //   //     size: size,
    //   //     options: options,
    //   //   });
    //   //   //   console.log(text, item);
    //   //   return prev;
    //   // });
    // }
  }, [size, options]);
  return (
    <>
      <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      draggable={true}
      className="w-full flex"
      >
      <div className="flex items-center w-full">
      <div className='justify-start flex items-center'>
            <GripVertical />
          </div>
        <div
          style={{
            transform: `scale(0.25) rotate(${options?.rotation || 0}deg)`,
            height: "50px",
            width:'150px',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex:'2',
          }}
        >
          {svg}
        </div>
        
        </div>
      </div>
    </>
  );
}
export function InEditorImage({ item }) {
  console.log(item);
  const [isDraggable, setIsDraggable] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: item.id });
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};

  const [options, setOptions] = useState(item.options);

  return (
    <>
     <div
     ref={setNodeRef}
     style={style}
     {...attributes}
     {...listeners}
     draggable={true}
     className="w-full flex"
     >
     <div className="flex w-full">
        <div className='justify-start flex items-center'>
            <GripVertical />
          </div>
        
        <div style={{
            transform: ` rotate(${options?.rotation || 0}deg)`,
            height: "50px",
          }}
          className="flex justify-center flex-2 w-full">
        <img
            src={item?.link ? item?.link : URL.createObjectURL(item?.file)}
            alt=""
            style={{
              height: "100%",
              // width: "100%",
            }}
            className="block cursor-move"
          />
        </div>
        
        </div>
        
     </div>
    </>
  );
}
export function TextAreaField({item}){
let html = item.ref.getEditorState().read(() => $getRoot().getTextContent())

const { attributes, listeners, setNodeRef, transform, transition } =
useSortable({ id: item.id });
const style = {
transform: CSS.Transform.toString(transform),
transition,
};

  return(
      <>
      <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    draggable={true}
    className="w-full flex"
    >
    <div className="flex items-center w-full">
        <div className='justify-start flex items-center'>
          <GripVertical />
        </div>
        <div className="h-[50px] w-full flex justify-center max-w-[180px] flex-2 items-center">
          <div className="truncate">

        {html}
          </div>
        </div>
      </div>
    </div>
      </>
  )
}
export function VideoFillableField({item}){
  console.log("item",item.ref)
  
  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: item.id });
  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  };
  
    return(
        <>
        <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      draggable={true}
      className="w-full flex"
      >
      <div className="flex items-center">
      <div className='flex h-full items-center'>
            <GripVertical />
          </div>
          <div className="h-[50px]">
            
          </div>
        </div>
      </div>
        </>
    )
}
export function TableField({item}){
console.log("item",item)
// let temp;
// const html =  item.ref.getEditorState().read(() => {
//    temp = $generateHtmlFromNodes(item.ref,null);
//   console.log(temp);
// })
// temp = temp.replace('<table', '<table style="transform: translate(-200px, -80px) scale(0.5); width:auto"')
// let html = item.ref.getEditorState().toJSON()
// console.log(temp)
// const ans= $generateHtmlFromNodes(item.ref, null);
// console.log(ans)
// console.log(item)

// const parser = new DOMParser();
// const doc = parser.parseFromString(temp, 'text/html');
// const rowCount = doc.querySelectorAll('tbody tr').length;
// const columnCount = doc.querySelector('tr').childElementCount;

// const rowCount=4;
// const columnCount=5;

// let demoTableHTML = '<table style="border-collapse: collapse; transform:scale(0.7); position:absolute;top:-60%;">';
// demoTableHTML += '<thead><tr>';
// for (let i = 0; i < columnCount; i++) {
//     demoTableHTML += `<th style="border: 1px solid black; width: 30px;
//     padding:10px;"></th>`;
// }
// demoTableHTML += '</tr></thead>';
// demoTableHTML += '<tbody>';
// for (let i = 0; i < rowCount; i++) {
//     demoTableHTML += '<tr>';
//     for (let j = 0; j < columnCount; j++) {
//         demoTableHTML += `<td style="border: 1px solid black; width:10px; padding:10px;"></td>`;
//     }
//     demoTableHTML += '</tr>';
// }
// demoTableHTML += '</tbody></table>';


const { attributes, listeners, setNodeRef, transform, transition } =
useSortable({ id: item.id });
const style = {
transform: CSS.Transform.toString(transform),
transition,
};

  return(
      <>
      <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    draggable={true}
    className="w-full flex"
    >
    <div className="flex w-full">
    <div className='justify-start flex items-center'>
          <GripVertical />
        </div>
        <div className="h-[50px] scale-50 relative">
        <table style={{ borderCollapse: 'collapse', transform: 'translate(20%,-30%) scale(0.5)' }}>
                <thead>
                  <tr>
                    {[...Array(5)].map((_, index) => (
                      <th key={index} style={{ border: '1px solid black', width: '30px', padding: '10px' }}></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...Array(5)].map((_, colIndex) => (
                        <td key={colIndex} style={{ border: '1px solid black', width: '10px', padding: '10px' }}></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
      </div>
    </div>
      </>
  )
}
// export function ImageFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function RadioButtonFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function CheckboxFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function FileFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function PaymentFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function DropdownFillableField({item}){
// console.log("item",item.ref)

// const { attributes, listeners, setNodeRef, transform, transition } =
// useSortable({ id: item.id });
// const style = {
// transform: CSS.Transform.toString(transform),
// transition,
// };

//   return(
//       <>
//       <div
//     ref={setNodeRef}
//     style={style}
//     {...attributes}
//     {...listeners}
//     draggable={true}
//     className="w-full flex"
//     >
//     <div className="flex items-center">
//     <div className='flex h-full items-center'>
//           <GripVertical />
//         </div>
//         <div className="h-[50px]">
          
//         </div>
//       </div>
//     </div>
//       </>
//   )
// }
// export function TextFillableField({item}){
//   console.log(item)
  
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: item.id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
  
//       return(
//           <>
//           <div
//         ref={setNodeRef}
//         style={style}
//         {...attributes}
//         {...listeners}
//         draggable={true}
//         className="w-full flex"
//         >
//         <div className="flex items-center">
//         <div className='flex h-full items-center'>
//               <GripVertical />
//           </div>
//           <div className="h-[50px]">
            
//           </div>
//           </div>
//         </div>
//           </>
//       )
//   }