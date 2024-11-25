import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableContainer = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} style={{}} className="w-full h-full droppable">
      {props.children}
    </div>
  );
};

export default DroppableContainer;
