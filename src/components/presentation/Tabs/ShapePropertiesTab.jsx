import React, { useEffect, useState } from 'react'

import {
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignHorizontalJustifyCenter,
    AlignHorizontalJustifyEnd,
    AlignHorizontalJustifyStart,
    AlignStartHorizontal,
    AlignVerticalJustifyStart,
    BringToFront,
    ChevronsDown,
    ChevronsUp,
    Circle,
    Dot,
    Minus,
    Plus,
    RefreshCw,
    SendToBack,
    Settings,
    Slash,
    Square,
    X,
    } from "lucide-react";
  import { Button, Input, Slider } from "@nextui-org/react";
  import { useItemStore } from '../stores/useItemStore';
import { getSVG } from '../../Template/shapes/shapeSvgConstants';
import { usePresHistory } from '../stores/usePresHistoryStore';

  const colors = [
    "#000000",
    "#ff3131",
    "#004aad",
    "#00bf63",
    "#ff914d",
    "#05686E",
  ];
  
  const angles = ["0", "90", "180", "270"];

const ShapePropertiesTab = () => {
    const {items, selectedItem,setSelectedItem , updateItem} = useItemStore()
    const {addHistory} =usePresHistory()

    const [updatedSelectedItem, setUpdatedSelectedItem] = useState(items.find(el=>el.id === selectedItem?.id))
    const [options, setOptions] = useState(items?.find(el=>el.id === selectedItem?.id)?.options)
    useEffect(()=> {
      const item =items.find(el=>el.id === selectedItem?.id)
      if(item){
        setUpdatedSelectedItem(item)
        setOptions(item?.options)
        console.log(item?.options?.radius)
      }
    },[items,selectedItem])
    useEffect(() => {
      const item = items.find((el) => el.id === selectedItem?.id);
      console.log(item)
      if (item) {
        updateItem({ ...item, options: options, itemSvg : item.type === "image" && getSVG(item.title, options, item.size, item?.orientation) });
        addHistory({ ...item, options: options, itemSvg : item.type === "image" && getSVG(item.title, options, item.size, item?.orientation) },"item","update",item)
        // setUpdatedSelectedItem({ ...item, options: options })
      }
    }, [options]);
  return (
    <div className="flex flex-col">
       <div className="p-4 border-b-2 ">
        <p className="text-[14px] text-[#05686e]">Properties</p>
      </div>
    { options && options?.bgColor && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2 mt-2">
        <div className="flex">
          <Input
            variant="underlined"
            label={"Background Color"}
            labelPlacement="outside-left"
            size="md"
            className="!bg-transparent relative w-full m-0 !p-0"
            radius="none"
            maxLength={9}
            classNames={{
              inputWrapper: "h-full shadow-none",
              innerWrapper: "p-0 m-0",
            }}
            defaultValue={options?.bgColor}
            value={options?.bgColor}
            onChange={(e) => {
              if(e.target.value !== ""){
                setOptions(prev=>({...prev,bgColor: e.target.value}))
              }                   
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
            }}
          />
        </div>
        <div className="flex w-full justify-around gap-2">
          <Button
            variant="flat"
            size="sm"
            // style={{ backgroundColor: clr }}
            radius="sm"
            onPress={(e) => {
              setOptions(prev=>({...prev,bgColor:"#00000000"}))

            }}
            // key={`bgClr-${index}`}
            isIconOnly
          >
            <Slash size={24} className="font-red" />
          </Button>
          {colors.map((clr, index) => {
            return (
              <Button
                variant="flat"
                size="sm"
                style={{ backgroundColor: clr }}
                radius="sm"
                onPress={(e) => setOptions(prev=>({...prev,bgColor:clr}))}
                key={`bgClr-${index}`}
                isIconOnly
              ></Button>
            );
          })}
        </div>
      </div>
    )}
    {options?.borderColor && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
        <div className="flex">
          <Input
            variant="underlined"
            label={"Border Color"}
            labelPlacement="outside-left"
            size="md"
            className="!bg-transparent relative w-full m-0 !p-0"
            radius="none"
            maxLength={9}
            classNames={{
              inputWrapper: "h-full shadow-none",
              innerWrapper: "p-0 m-0",
            }}
            // autoFocus
            defaultValue={options?.borderColor}
            value={options?.borderColor}
            onChange={(e) => {
              if(e.target.value){
                  setOptions((prev) => {
                    return {
                      ...prev,
                      borderColor: e.target.value,
                    };
                  });

              }
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
            }}
          />
        </div>

        <div className="flex w-full justify-around gap-2">
          <Button
            variant="flat"
            size="sm"
            // style={{ backgroundColor: clr }}
            radius="sm"
            onPress={(e) => {
              setOptions((prev) => {
                return {
                  ...prev,
                  borderColor: "#00000000",
                };
              });
            }}
            // key={`bgClr-${index}`}
            isIconOnly
          >
            <Slash size={24} className="font-red" />
          </Button>
          {colors.map((clr, index) => {
            return (
              <Button
                variant="flat"
                size="sm"
                style={{ backgroundColor: clr }}
                radius="sm"
                onPress={(e) => {
                  setOptions((prev) => {
                    return {
                      ...prev,
                      borderColor: clr,
                    };
                  });
                }}
                key={`bgClr-${index}`}
                isIconOnly
              ></Button>
            );
          })}
        </div>
      </div>
    )}
    {options?.borderWeight && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
        <Slider
          label="Border Weight"
          size="sm"
          color="secondary"
          maxValue={
            parseInt(options.maxBorderWeight) || 13
          }
          value={parseInt(options.borderWeight)}
          onChange={(e) =>
            setOptions((prev) => {
              return {
                ...prev,
                borderWeight: e.toString(),
              };
            })
          }
          startContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    borderWeight: (
                      parseInt(prev.borderWeight) - 1
                    ).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={10} />
            </Button>
          }
          endContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    borderWeight: (
                      parseInt(prev.borderWeight) + 1
                    ).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={30} />
            </Button>
          }
          className="max-w-md"
        />
      </div>
    )}
    {options?.dotWidth && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
        <Slider
          label="Dot Width"
          size="sm"
          color="secondary"
          maxValue={parseInt(updatedSelectedItem?.size?.width)}
          minValue={options.dotWidth ? 1 : 0}
          value={parseInt(options.dotWidth)}
          onChange={(e) =>
            setOptions((prev) => {
              return { ...prev, dotWidth: e.toString() };
            })
          }
          startContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    dotWidth: (parseInt(prev.dotWidth) - 1).toString(),
                  };
                })
              }
            >
              <Minus fill="#000" size={24} />
            </Button>
          }
          endContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    dotWidth: (parseInt(prev.dotWidth) + 1).toString(),
                  };
                })
              }
            >
              <Plus fill="#000" size={24} />
            </Button>
          }
          className="max-w-md"
        />
      </div>
    )}
    {options?.dotGap && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
        <Slider
          label="Dot Gap"
          size="sm"
          color="secondary"
          maxValue={
            parseInt(options.maxBorderWeight) || 26
          }
          value={parseInt(options.dotGap)}
          onChange={(e) =>
            setOptions((prev) => {
              return { ...prev, dotGap: e.toString() };
            })
          }
          startContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    dotGap: (parseInt(prev.dotGap) - 1).toString(),
                  };
                })
              }
            >
              <Minus fill="#000" size={24} />
            </Button>
          }
          endContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    dotGap: (parseInt(prev.dotGap) + 1).toString(),
                  };
                })
              }
            >
              <Plus fill="#000" size={24} />
            </Button>
          }
          className="max-w-md"
        />
      </div>
    )}
    {updatedSelectedItem?.options?.radius && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 my-2">
        <Slider
          label="Border Radius"
          size="sm"
          color="secondary"
          maxValue={150}
          value={parseInt(options?.radius)}
          onChange={(e) =>{
            console.log(e)
            setOptions((prev) => {
              return { ...prev, radius: e.toString() };
            })
          }}
          startContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    radius: (parseInt(prev.radius) - 1).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={10} />
            </Button>
          }
          endContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    radius: (parseInt(prev.radius) + 1).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={30} />
            </Button>
          }
          className="max-w-md"
        />
      </div>
    )}
    {(updatedSelectedItem?.options?.opacity ||updatedSelectedItem?.options?.opacity === 0) && (
      <div className="flex flex-col gap-2 border-b-2 pb-2 mb-2">
        <Slider
          label="Opacity"
          size="sm"
          color="secondary"
          maxValue={1}
          minValue={0}
          
          step={0.01}
          value={parseFloat(options?.opacity)}
          onChange={(e) =>{
            setOptions((prev) => {
              return { ...prev, opacity: e.toString() };
            })
          }}
          startContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    opacity: (parseInt(prev.opacity) - 0.01).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={10} />
            </Button>
          }
          endContent={
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() =>
                setOptions((prev) => {
                  return {
                    ...prev,
                    opacity: (parseInt(prev.opacity) + 0.01).toString(),
                  };
                })
              }
            >
              <Circle fill="#000" size={30} />
            </Button>
          }
          className="max-w-md"
        />
      </div>
    )}
  </div>
  )
}

export default ShapePropertiesTab