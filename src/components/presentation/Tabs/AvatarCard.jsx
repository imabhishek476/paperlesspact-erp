import { Card, CardFooter, Tooltip } from "@nextui-org/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { usePageStore } from "../stores/usePageStore";

const AvatarCard = ({ item }) => {
  console.log(item?.category)
  const {setIsDragginginStore} = usePageStore();
  const [category, ...rest] = item?.category ? item?.category?.split(",") : []
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item?._id,
      data: {
        type: "avatar",
        image: item?.image,
        size: {
          height: "50%",
          width: "50%",
        },
        options:{
          radius: "0",
          opacity: "1",
      }
      },
    });
    useEffect(() => {
      setIsDragginginStore(isDragging);
    }, [isDragging]);
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div ref={setNodeRef}
    {...listeners}
    {...attributes}
    style={{
      ...style,
      overflow: "hidden",
      cursor: "grab",
    }}>
    <Card
      radius="lg"
      className="border-2 w-full h-full shadow-none"
      disableAnimation
    >
        <Image
          alt="Woman listing to music"
          className="object-contain aspect-square"
          src={item?.image}
          height={150}
          width={150}
        />
      <CardFooter className="pb-2 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-md">{item?.name}</h4>
        <div className="flex">
          <p className="text-[12px] uppercase font-semibold">{category?category:"Avator"}</p>
          {rest.length > 0 && (
            <Tooltip
              showArrow={true}
              content={
                <div className="flex flex-col">
                  {rest?.map((r, index) => (
                    <span className="text-[10px]" key={index}>
                      {r}
                    </span>
                  ))}
                </div>
              }
            >
              <span className="flex text-[12px] items-center">
                {" "}
                <Plus size={10} />
                {rest.length}
              </span>
            </Tooltip>
          )}
        </div>
      </CardFooter>
    </Card>
    </div>
  );
};

export default AvatarCard;
