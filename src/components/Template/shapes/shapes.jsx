import React from "react";
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
} from "./shapeSvgConstants";
import {
  GripVertical,
  Hexagon,
  Minus,
  Octagon,
  Pentagon,
  Triangle,
} from "lucide-react";

const shapes = [
  {
    title: "Line",
    field: "Line",
    type: "shape",
    icon: <Minus />,
    size: { height: 50, width: 150 },
    options: {
      // bgColor: "#c2c2c2",
      borderColor: "#151513",
      borderWeight: "2",
      maxBorderWeight: "100",
      dotGap: "0",
      dotWidth: "0",
      rotation: "0",
    },
    layer:1
  },
  {
    title: "Circle",
    field: "Circle",
    type: "shape",
    icon: CIRCLE,
    size: { height: 250, width: 250 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
    },
    layer:1

  },
  {
    title: "Square",
    field: "Square",
    type: "shape",
    icon: SQUARE,
    size: { height: 250, width: 250 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "2",
      radius: "0",
      rotation: "0",
    },
    layer:1

  },
  {
    title: "Rectangle",
    field: "Rectangle",
    type: "shape",
    icon: RECTANGLE_HORIZONTAL,
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "2",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  {
    title: "Triangle",
    field: "Triangle",
    type: "shape",
    icon: <Triangle />,
    size: { height: 200, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  // {
  //   title: "Triangle",
  //   field: "Triangle",
  //   orientation: "inverted",
  //   type: "shape",
  //   icon: <Triangle className="rotate-180" />,
  //   size: { height: 200, width: 200 },
  //   options: {
  //     bgColor: "#FFFFFF",
  //     borderColor: "#151513",
  //     borderWeight: "3",
  //     radius: "0",
  //   },
  //   layer:1

  // },
  {
    title: "Arrow Block",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK_RIGHT(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  // {
  //   title: "Arrow Block",
  //   field: "Arrow",
  //   orientation: "inverted",
  //   type: "shape",
  //   icon: ARROW_BLOCK_LEFT(),
  //   size: { height: 200, width: 200 },
  //   options: {
  //     bgColor: "#FFFFFF",
  //     borderColor: "#151513",
  //     borderWeight: "3",
  //     rotation: "0",
  //     radius: "0",
  //   },
  //   layer:1

  // },
  {
    title: "Arrow Block 2",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_BLOCK2_RIGHT(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  // {
  //   title: "Arrow Block 2",
  //   field: "Arrow",
  //   orientation: "inverted",
  //   type: "shape",
  //   icon: ARROW_BLOCK2_LEFT(),
  //   size: { height: 100, width: 200 },
  //   options: {
  //     bgColor: "#FFFFFF",
  //     borderColor:"#151513",
  //     borderWeight : "3",
  //     rotation: "0",
  //     radius: "0",
  //   },
  //   layer:1

  // },
  {
    title: "Arrow Block Concave",
    field: "Arrow",
    orientation: "inverted",
    type: "shape",
    icon: ARROW_CONCAVE(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  {
    title: "Arrow Block Convex",
    field: "Arrow",
    orientation: "90",
    type: "shape",
    icon: ARROW_CONVEX(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  {
    title: "Arrow",
    field: "Arrow",
    orientation: "180",
    type: "shape",
    icon: ARROW(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  {
    title: "Arrow Double",
    field: "Arrow",
    // orientation: "inverted",
    type: "shape",
    icon: ARROW_DOUBLE(),
    size: { height: 100, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "3",
      rotation: "0",
      radius: "0",
    },
    layer:1

  },
  {
    title: "Pentagon",
    field: "Pentagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Pentagon />,
    size: { height: 200, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "2",
      rotation: "0",
      scale : 0.9
    },
    layer:1

  },
  {
    title: "Hexagon",
    field: "Hexagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Hexagon />,
    size: { height: 200, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "2",
      rotation: "0",
      scale :0.9
    },
    layer:1

  },
  {
    title: "Octagon",
    field: "Octagon",
    // orientation: "inverted",
    type: "shape",
    icon: <Octagon />,
    size: { height: 200, width: 200 },
    options: {
      bgColor: "#FFFFFF",
      borderColor: "#151513",
      borderWeight: "2",
      rotation: "0",
      scale : 0.9
    },
    layer:1

  },
];

const ShapesTab = ({
  setSelectedFieldItem,
  selectedFieldItem,
  selectedParticipant,
  setSelectedParticipant,
}) => {
  const handleDragStart = (e, field, index) => {
    setSelectedFieldItem({
      id: crypto.randomUUID(),
      signee: selectedParticipant,
      ...field,
    });
  };
  return (
    <div className="w-full flex flex-col overflow-y-auto h-[calc(100vh-102px)]">
      <div className="h-full flex flex-col items-center">
        <div className="flex w-full border-b-2 p-4 justify-between items-center">
          <span className="text-[14px] text-[#05686E]">Shapes</span>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full justify-between items-center mt-4 px-2">
          {shapes.map((shape, index) => {
            return (
              <div
                key={`${shape.title}-${index}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, shape, index)}
                onDragEnd={() => setSelectedFieldItem(null)}
                className=" flex justify-between items-center  bg-white  shadow-none h-[42px]  capitalize text-[10px]  hover:cursor-move rounded border border-[#05686e]"
              >
                <div className="flex items-center py-[10px] px-[2px]">
                  <GripVertical size={12} />
                  <p>{shape.title}</p>
                </div>
                <div className="flex items-center justify-center min-w-[24px] px-[9px] h-full bg-[#05686e] text-white rounded-r">
                  {shape.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShapesTab;
