import React, { useEffect, useState } from "react";
import {
  GripVertical,
  Hexagon,
  Minus,
  Octagon,
  Pentagon,
  Triangle,
} from "lucide-react";
import {
  ARROW,
  ARROW_BLOCK2_LEFT,
  ARROW_BLOCK2_RIGHT,
  ARROW_BLOCK_LEFT,
  ARROW_BLOCK_RIGHT,
  ARROW_CONCAVE,
  ARROW_CONVEX,
  ARROW_DOUBLE,
  CIRCLE,
  RECTANGLE_HORIZONTAL,
  SQUARE,
} from "../../Template/shapes/shapeSvgConstants";
import { useDraggable } from "@dnd-kit/core";
import ShapeTabItem from "./ShapeTabItem";
import { usePageStore } from "../stores/usePageStore";

const shapes = [
  {
    title: "Line",
    field: "Line",
    type: "shape",
    icon: <Minus />,
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      // bgColor: "#c2c2c2",
      borderColor: "#4A9B9F",
      borderWeight: "2",
      maxBorderWeight: "100",
      dotGap: "0",
      dotWidth: "0",
      rotation: "0",
    },
    layer: 1,
  },
  {
    title: "Circle",
    field: "Circle",
    type: "shape",
    icon: CIRCLE,
    lockAspect: true,
    size: { height: 250, width: 250 },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
    },
    layer: 1,
  },
  {
    title: "Square",
    field: "Square",
    type: "shape",
    icon: SQUARE,
    lockAspect: true,
    size: { height: 250, width: 250},
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      radius: "0",
      rotation: "0",
    },
    layer: 1,
  },
  {
    title: "Rectangle",
    field: "Rectangle",
    type: "shape",
    icon: RECTANGLE_HORIZONTAL,
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Triangle",
    field: "Triangle",
    type: "shape",
    icon: <Triangle />,
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Triangle",
    field: "Triangle",
    orientation: "inverted",
    type: "shape",
    icon: <Triangle className="rotate-180" />,
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK_RIGHT(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block",
    field: "Arrow",
    orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK_LEFT(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block 2",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK2_RIGHT(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block 2",
    field: "Arrow",
    orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK2_LEFT(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block Concave",
    field: "Arrow",
    orientation: "inverted",
    type: "shape",
    icon: ARROW_CONCAVE(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Block Convex",
    field: "Arrow",
    orientation: "90",
    type: "shape",
    icon: ARROW_CONVEX(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Arrow Double",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_DOUBLE(),
    size: { height: "30%", width: "30%" },
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer: 1,
  },
  {
    title: "Pentagon",
    field: "Pentagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Pentagon />,
    size: { height: 250, width: 250 },
    lockAspect: true,
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      scale: 0.9,
    },
    layer: 1,
  },
  {
    title: "Hexagon",
    field: "Hexagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Hexagon />,
    size: { height: 250, width: 250 },
    lockAspect: true,
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      scale: 1,
    },
    layer: 1,
  },
  {
    title: "Octagon",
    field: "Octagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Octagon />,
    size: { height: 250, width: 250},
    lockAspect: true,
    options: {
      opacity: 1,

      bgColor: "#4A9B9F",
      borderColor: "#4A9B9F",
      borderWeight: "3",
      rotation: "0",
      scale: 0.9,
    },
    layer: 1,
  },
];

const ShapesTab = () => {
  const [isDragging, setIsDragging] = useState(false)
  const {setIsDragginginStore} = usePageStore()
  useEffect(()=>{
    setIsDragginginStore(isDragging)
  },[isDragging])
  return (
    <div className="flex-col">
      <div className="p-4 border-b-2">
        <p className="text-[14px] text-[#05686e]">Shapes Tab</p>
      </div>
      <div
      style={{
        overflowY: !isDragging && "auto"
      }}
      className='h-[calc(100vh-120px)]'
      >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full justify-between items-center mt-4">
        {shapes.map((shape, index) => {
          return (
            <ShapeTabItem
              shape={shape}
              index={index}
              setIsDragging={setIsDragging}
              key={`${shape.title}-${index}`}
            />
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default ShapesTab;
