import { Hexagon, Octagon, Pentagon } from "lucide-react";
import { cloneElement } from "react";

export const SQUARE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="lucide lucide-square"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);
export const RECTANGLE_HORIZONTAL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-rectangle-horizontal"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </svg>
);
export const CIRCLE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="lucide lucide-circle"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

function createRoundedPathString(pathCoords, curveRadius) {
  const path = [];
  // Reset indexes, so there are no gaps
  pathCoords = pathCoords.slice();

  for (let i = 0; i < pathCoords.length; i++) {
    // 1. Get current coord and the next two (startpoint, cornerpoint, endpoint) to calculate rounded curve
    const c2Index =
      i + 1 > pathCoords.length - 1 ? (i + 1) % pathCoords.length : i + 1;
    const c3Index =
      i + 2 > pathCoords.length - 1 ? (i + 2) % pathCoords.length : i + 2;

    const c1 = pathCoords[i];
    const c2 = pathCoords[c2Index];
    const c3 = pathCoords[c3Index];

    // 2. For each 3 coords, enter two new path commands: Line to start of curve, bezier curve around corner.

    // Calculate curvePoint c1 -> c2
    const c1c2Distance = Math.sqrt(
      Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)
    );
    const c1c2DistanceRatio = (c1c2Distance - curveRadius) / c1c2Distance;
    const c1c2CurvePoint = [
      ((1 - c1c2DistanceRatio) * c1.x + c1c2DistanceRatio * c2.x).toFixed(1),
      ((1 - c1c2DistanceRatio) * c1.y + c1c2DistanceRatio * c2.y).toFixed(1),
    ];

    // Calculate curvePoint c2 -> c3
    const c2c3Distance = Math.sqrt(
      Math.pow(c2.x - c3.x, 2) + Math.pow(c2.y - c3.y, 2)
    );
    const c2c3DistanceRatio = curveRadius / c2c3Distance;
    const c2c3CurvePoint = [
      ((1 - c2c3DistanceRatio) * c2.x + c2c3DistanceRatio * c3.x).toFixed(1),
      ((1 - c2c3DistanceRatio) * c2.y + c2c3DistanceRatio * c3.y).toFixed(1),
    ];

    // If at last coord of polygon, also save that as starting point
    if (i === pathCoords.length - 1) {
      path.unshift("M" + c2c3CurvePoint.join(","));
    }

    // Line to start of curve (L endcoord)
    path.push("L" + c1c2CurvePoint.join(","));
    // Bezier line around curve (Q controlcoord endcoord)
    path.push("Q" + c2.x + "," + c2.y + "," + c2c3CurvePoint.join(","));
  }
  // Logically connect path to starting point again (shouldn't be necessary as path ends there anyway, but seems cleaner)
  path.push("Z");

  return path.join(" ");
}

function polygonVertices(sideLength, numSides) {
  const vertices = [];
  const angleIncrement = (360 / numSides);
  const angleOffset = 90 - angleIncrement / 2;
  const angle = (angleIncrement * Math.PI) / 180;
  for (let i = 0; i < numSides; i++) {
      const x = sideLength * Math.cos(i * angle + angleOffset * Math.PI / 180);
      const y = sideLength * Math.sin(i * angle + angleOffset * Math.PI / 180);
      vertices.push({ x: x + sideLength, y: y + sideLength });
  }
  return vertices;
}

export const ARROW_BLOCK_RIGHT = () => {
  const points = [
    { x: 0, y: 0 },
    { x: 24 - (24 / 3), y: 0 },
    { x: 24, y: 12},
    {
      x: 16,
      y: 24,
    },
    { x: 0, y: 24 },
  ]
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW_BLOCK_LEFT = () => {
  const points = [
    { x: 0 + 24 / 3, y: 24 - 0 },
    { x: 0, y: (24 - 0 / 2) / 2 },
    { x: 0 + 24 / 3, y: 0 },
    { x: 24 - 0, y: 0 },
    { x: 24 - 0, y: 24 - 0 },
  ]
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW_BLOCK2_LEFT = () => {
  const points = [
    { x: 0 + 24 / 3, y: 24 - 0 },
    { x: 0, y: (24 - 0 / 2) / 2 },
    { x: 0 + 24 / 3, y: 0 },
    { x: 24 - 0, y: 0 },
    {
      x: 24 - 0 - 24 / 3,
      y: (24 - 0 / 2) / 2,
    },
    { x: 24 - 0, y: 24 - 0 },
  ]
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW_BLOCK2_RIGHT = () => {
  const points = [
    { x: 0 + 24 / 3, y: 24 - 0 },
    { x: 0, y: (24 - 0 / 2) / 2 },
    { x: 0 + 24 / 3, y: 0 },
    { x: 24 - 0, y: 0 },
    {
      x: 24 - 0 - 24 / 3,
      y: (24 - 0 / 2) / 2,
    },
    { x: 24 - 0, y: 24 - 0 },
  ]
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle rotate-180"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}

export const ARROW_CONCAVE = () => {
  const points = [
    { x: 0 + 24 / 4, y: (24 - 0 / 4) / 2 },
    { x: 0, y: 0 },
    { x: 24 - 0, y: 0 },
    {
      x: 24 - 0 - 24 / 4,
      y: (24 - 0 / 4) / 2,
    },
    { x: 24 - 0, y: 24 - 0 },
    { x: 0, y: 24 - 0 },
  ];
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle rotate-180"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW_CONVEX = () => {
  const points = [
    { x: 0, y: (24 - 0 / 4) / 2 },
    { x: 0 + 24 / 4, y: 0 },
    { x: 24 - 0 - 24 / 4, y: 0 },
    {
      x: 24 - 0 ,
      y: (24 - 0 / 4) / 2,
    },
    { x: 24 - 0 - 24 / 4, y: 24 - 0 },
    { x: 0 + 24 / 4, y: 24 - 0 },
  ];
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle rotate-180"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW = () => {
  const points = [
    { x: 0, y: (24 - 0 / 4) / 2 },
    { x: 0 + 24 / 3, y: 0 },
    { x: 0 + 24 / 3, y: (24/4) + 0 },
    { x: 24 - 0, y: (24/4)+ 0 },
    {
      x: 24 - 0 ,
      y: (24 - 0 / 4) / 2,
    },
    { x: 24 - 0, y: 24 - (24/4) - 0 },
    { x: 0 + (24 / 3) , y: 24 - (24/4) - 0 },

    { x: 0 + 24 / 3, y: 24 - 0 },
  ];
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle rotate-180"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}
export const ARROW_DOUBLE = () => {
  const points = [
    { x: 0, y: (24 - 0 / 4) / 2 },
    { x: 0 + 24 / 3, y: 0 },
    { x: 0 + 24 / 3, y: 24 / 4 + 0 },
    { x: 24 - ( 24 / 3)- 0, y: 24 / 4 + 0 },
    { x: 24 - ( 24 / 3)- 0, y: 0 },
    
    { x: 24 - 0, y: (24 - 0 / 4) / 2 },
    { x: 24 - ( 24 / 3) - 0, y: 24 - 0 },
    { x: 24 - ( 24 / 3) - 0, y: 24 - (24 / 4 ) - 0 },

    {
      x: 0 + 24 / 3,
      y: 24 - 24 / 4 - 0,
    },

    { x: 0 + 24 / 3, y: 24 - 0 },
  ];
  const path = createRoundedPathString(points, 0);
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  // stroke-linecap="round"
  // stroke-linejoin="round"
  className="lucide lucide-triangle rotate-180"
>
  <path
    d={path}
    stroke-linejoin="round"
    width={24}
  height={24}
  viewBox={`0 0 24 24`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
</svg>
}





export const getSVG = (shape, options, size, orientation,isLock,pageSize,id) => {
  console.log(size)
  let svg = <></>;
  if(typeof size.height === "string"){
    const container = document.getElementById("currentPage");
    let height = container?.scrollHeight;
    let width = container?.scrollWidth;
    if(container){
      // if(height > width){
      //   height = 1024
      //   width = 576
      // } else {
      //   height = 576
      //   width = 1024
      // }
      height = pageSize?.height && parseInt(pageSize?.height?.split("px")[0])
      width = pageSize?.width && parseInt(pageSize?.width?.split("px")[0])
    } else {
      height = pageSize?.height && parseInt(pageSize?.height?.split("px")[0])
      width = pageSize?.width && parseInt(pageSize?.width?.split("px")[0])
    }
     let itemHeightInPx = (size?.height?.split("%")[0] * height) / 100;
    let itemWidthInPx = (size?.width?.split("%")[0] * width) / 100;
    if(isLock || shape === "Circle" || shape === "Square" || shape === "Pentagon" || shape === "Hexagon"|| shape === "Octagon"){
      itemHeightInPx = itemWidthInPx >  itemHeightInPx ? itemHeightInPx: itemWidthInPx
      itemWidthInPx = itemWidthInPx <  itemHeightInPx ? itemWidthInPx: itemHeightInPx
    }
    size = {
        height:itemHeightInPx,
        width:itemWidthInPx
    }
  }
  // let offset = parseInt(options?.borderWeight || "10");
  let offset = 0;
  console.log(offset);
  if (offset < 10) {
    offset = 10;
  }






  
  switch (shape) {
    case "Circle":
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          className="lucide lucide-circle"
        >
          <circle
            cx={size.width / 2}
            cy={size.height / 2}
            r={
              size.width > size.height
                ? size.height / 2 - offset
                : size.width / 2 - offset
            }
          />
        </svg>
      );
      break;
    case "Square":
      const edgeSize =
        size.width > size.height ? size.height : size.width;
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            paintOrder: "fill"
          }}
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={parseInt(options.borderWeight)*2}
          stroke-linecap="round"
          stroke-linejoin="round"
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          className="lucide lucide-square"
        >
          <rect
            width={parseInt(options.borderWeight)>1 ? edgeSize-3 : edgeSize}
            height={parseInt(options.borderWeight)>1 ? edgeSize-3 : edgeSize}
            x={parseInt(options.borderWeight)>1 ? 2 : 0}
            y={parseInt(options.borderWeight)>1 ? 2 : 0}
            rx={options.radius}
          />
        </svg>
      );
      break;
    case "Rectangle":
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            paintOrder: "fill"
          }}
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={parseInt(options.borderWeight)*2}
          stroke-linecap="round"
          stroke-linejoin="round"
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          className="lucide lucide-rectangle-horizontal"
        >
          <rect
            width={size.width -3}
            height={size.height -3}
            x={parseInt(options.borderWeight)>1 ? 2 : 0}
            y={parseInt(options.borderWeight)>1 ? 2 : 0}
            rx={options?.radius}
          />
        </svg>
      );
      break;
    case "Triangle": {
      console.log(size)
      const points = orientation
        ? [
            { x: offset, y: offset },
            { x: size.width - offset, y: offset },
            { x: size.width / 2, y: size.height - offset },
          ]
        : [
            { x: size.width / 2, y: offset },
            { x: offset, y: size.height - offset },
            { x: size.width - offset, y: size.height - offset },
          ];
      const path = createRoundedPathString(points, options.radius||0);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            // stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
            // stroke-linecap="round"

          />
        </svg>
      );
      break;
    }
    case "Arrow Block": {
      const points = orientation
        ? [
            { x: offset + size.width / 3, y: size.height - offset },
            { x: offset, y: (size.height - offset / 2) / 2 },
            { x: offset + size.width / 3, y: offset },
            { x: size.width - offset, y: offset },
            { x: size.width - offset, y: size.height - offset },
          ]
        : [
            { x: offset, y: offset },
            { x: size.width - offset - size.width / 3, y: offset },
            { x: size.width - offset, y: (size.height - offset / 2) / 2 },
            {
              x: size.width - offset - size.width / 3,
              y: size.height - offset,
            },
            { x: offset, y: size.height - offset },
          ];
      const path = createRoundedPathString(points, options.radius);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          // stroke-linecap="round"
          // stroke-linejoin="round"
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Arrow Block 2": {
      const points = orientation
        ? [
            { x: offset + size.width / 3, y: size.height - offset },
            { x: offset, y: (size.height - offset / 2) / 2 },
            { x: offset + size.width / 3, y: offset },
            { x: size.width - offset, y: offset },
            {
              x: size.width - offset - size.width / 3,
              y: (size.height - offset / 2) / 2,
            },
            { x: size.width - offset, y: size.height - offset },
          ]
        : [
            { x: offset + size.width / 3, y: (size.height - offset / 2) / 2 },
            { x: offset, y: offset },
            { x: size.width - offset - size.width / 3, y: offset },
            { x: size.width - offset, y: (size.height - offset / 2) / 2 },
            {
              x: size.width - offset - size.width / 3,
              y: size.height - offset,
            },
            { x: offset, y: size.height - offset },
          ];
      const path = createRoundedPathString(points, options.radius);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          // stroke-linecap="round"
          // stroke-linejoin="round"
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Arrow Block Concave": {
      const points = [
        { x: offset + size.width / 4, y: (size.height - offset / 4) / 2 },
        { x: offset, y: offset },
        { x: size.width - offset, y: offset },
        {
          x: size.width - offset - size.width / 4,
          y: (size.height - offset / 4) / 2,
        },
        { x: size.width - offset, y: size.height - offset },
        { x: offset, y: size.height - offset },
      ];
      const path = createRoundedPathString(points, options.radius);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          // stroke-linecap="round"
          // stroke-linejoin="round"
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Arrow Block Convex": {
      const points = [
        { x: offset, y: (size.height - offset / 4) / 2 },
        { x: offset + size.width / 4, y: offset },
        { x: size.width - offset - size.width / 4, y: offset },
        {
          x: size.width - offset ,
          y: (size.height - offset / 4) / 2,
        },
        { x: size.width - offset - size.width / 4, y: size.height - offset },
        { x: offset + size.width / 4, y: size.height - offset },
      ];
      const path = createRoundedPathString(points, options.radius);
      console.log(orientation)
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Arrow": {
      const points = [
        { x: offset, y: (size.height - offset / 4) / 2 },
        { x: offset + size.width / 3, y: offset },
        { x: offset + size.width / 3, y: (size.height/4) + offset },
        { x: size.width - offset, y: (size.height/4)+ offset },
        {
          x: size.width - offset ,
          y: (size.height - offset / 4) / 2,
        },
        { x: size.width - offset, y: size.height - (size.height/4) - offset },
        { x: offset + (size.width / 3) , y: size.height - (size.height/4) - offset },

        { x: offset + size.width / 3, y: size.height - offset },
      ];
      const path = createRoundedPathString(points, options.radius);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          style={{
            transform: `rotate(${180}deg)`
          }}
          class="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Line": {
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          strokeLinecap="rounded"
          className="lucide lucide-triangle"
        >
          <line
            x1={10} y1={(size.height ) / 2} x2={size.width - 10} y2={(size.height) / 2}
            stroke-linejoin="round"
            stroke-dasharray={`${options?.dotWidth},${options?.dotGap}`}
            fill={options?.bgColor}
            stroke={options.borderColor}
            
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Arrow Double": {
      const points = [
        { x: offset, y: (size.height - offset / 4) / 2 },
        { x: offset + size.width / 3, y: offset },
        { x: offset + size.width / 3, y: size.height / 4 + offset },
        { x: size.width - ( size.width / 3)- offset, y: size.height / 4 + offset },
        { x: size.width - ( size.width / 3)- offset, y: offset },
        
        { x: size.width - offset, y: (size.height - offset / 4) / 2 },
        { x: size.width - ( size.width / 3) - offset, y: size.height - offset },
        { x: size.width - ( size.width / 3) - offset, y: size.height - (size.height / 4 ) - offset },

        {
          x: offset + size.width / 3,
          y: size.height - size.height / 4 - offset,
        },

        { x: offset + size.width / 3, y: size.height - offset },
      ];

      const path = createRoundedPathString(points, options.radius);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          className="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Pentagon": {
      const points = polygonVertices(size.width > size.height ? size.height/2 :size.width/2,5);      
      const path = createRoundedPathString(points, options?.radius||0);
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          class="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Hexagon": {
      const points = polygonVertices(size.width > size.height ? size.height/2 :size.width/2,6);      
      const path = createRoundedPathString(points, options?.radius||0);
      console.log(path)
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          class="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
    case "Octagon": {
      const points = polygonVertices(size.width > size.height ? size.height/2 :size.width/2,8);      
      const path = createRoundedPathString(points, options?.radius||0);
      console.log(path)
      svg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill={options?.bgColor}
          stroke={options.borderColor}
          strokeWidth={options.borderWeight}
          // style={{
          //   transform: `rotate(${options?.rotation || 0}deg)`
          // }}
          class="lucide lucide-triangle"
        >
          <path
            d={path}
            stroke-linejoin="round"
            fill={options?.bgColor}
            stroke={options.borderColor}
            strokeWidth={options.borderWeight}
          />
        </svg>
      );
      break;
    }
  }
  if(id){
    svg = cloneElement(svg,{id:`shape-${id}`});
  }
  return svg;
};
