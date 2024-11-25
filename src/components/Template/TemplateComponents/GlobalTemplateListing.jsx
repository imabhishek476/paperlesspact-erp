import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TemplateViewModel from "./TemplateViewModel";

const GlobalTemplateListing = ({
  modeStatus,
  templates,
  loading,
  templateId,
  all,
  fromTab
}) => {
  const [openModel, setOpenModel] = useState(false);
  const [newData, setNewData] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState(null);
  const handleModelOpen = (tempData) => {
    setSelectedTemp(tempData);
    setOpenModel(true);
  };
  useEffect(() => {
    setNewData(modeStatus === "portrait");
  }, [modeStatus]);
  const classNames = templateId
    ? fromTab ? "grid grid-cols-2 gap-5":"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 flex-wrap w-full"
    :  fromTab ? "grid grid-cols-2 gap-5":"grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5 flex-wrap w-full ";
  return (
    <div className={fromTab && "h-[calc(100vh-395px)] overflow-auto"}>
      <TemplateViewModel
        isOpen={openModel}
        onClose={setOpenModel}
        selectedTemp={selectedTemp}
        setSelectedTemp={setSelectedTemp}
        mode={modeStatus}
        templateId={templateId}
      />
      {loading && (
        <div className="flex w-full gap-4 justify-start">
          {Array.from({ length: fromTab?2:5}, (_, i) => (
            <div key={i} className={`flex flex-col gap-2 ${fromTab? "w-full":"w-full lg:w-[10%]"} justify-start`}>
              <div className={`${newData ? "aspect-[3/4]" : "aspect-video"}`}>
                <Skeleton className="w-full h-full rounded-lg">
                  <div className="h-full w-full rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>
              <div className="w-[80px]">
                <Skeleton className="w-full rounded-lg">
                  <div className="h-3 w-full rounded-lg bg-secondary"></div>
                </Skeleton>
              </div>
            </div>
          ))}
        </div>
      )}
        {!loading && templates && templates?.ref && templates?.ref?.length > 0
          ?
            <div className={classNames}>
                {templates?.ref?.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="py-1 px-1 shadow-none rounded-md bg-[#eee]"
                >
                  <CardBody
                    onClick={() => handleModelOpen(item)}
                    className={`overflow-visible cursor-pointer ${
                      newData ? "aspect-[3/4]" : "aspect-video"
                    } p-2 max-h-[200px]`}
                  >
                    <Image
                      alt="Card background"
                      className="object-contain px-2"
                      src={item?.thumbnail || "/images/tSample.svg"}
                      fill
                    />
                  </CardBody>
                  <CardFooter className="pb-0 pt-2 px-4 flex-col">
                    <h4 className="text-sm text-md">{item?.name}</h4>
                    {all && (
                      <span className="text-[10px] text-[#15151390] text-md">
                        {item?.categoryId?.name?item?.categoryId?.name:"Category"}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            </div>
           :
          !loading && <div className="flex h-32 w-full px-5 justify-center items-center">
                    <span className='text-xs text-[#15151360]'>
                    No Template Available

                    </span>
            </div>
           }
    </div>
  );
};

export default GlobalTemplateListing;
