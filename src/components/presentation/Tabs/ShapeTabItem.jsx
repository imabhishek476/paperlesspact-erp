import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React, { useEffect } from "react";

const ShapeTabItem = ({ shape, index, setIsDragging }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${shape.title}-${index}`,
      data: shape,
    });
  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging]);

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        overflow: "hidden",
        cursor: "grab",
      }}
      draggable={true}
      className=" flex justify-between items-center  bg-white  shadow-none h-[42px]  capitalize text-[10px]  hover:cursor-move rounded border border-[#05686e]"
    >
      <div className="flex items-center py-[10px] px-[2px]">
        <GripVertical size={12} />
        <p className="text-[10px]">{shape.title}</p>
      </div>
      <div className="flex items-center justify-center min-w-[24px] px-[9px] h-full bg-[#05686e] text-white rounded-r">
        {shape.icon}
      </div>
    </div>
  );
};

export default ShapeTabItem;
