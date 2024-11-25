import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ItemRenderer from "../../presentation/PageComponent/ItemRenderer";

const PresentationModalView = ({ data }) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(data.items?.filter((item) => item?.pageIndex === selectedPage));
    console.log(selectedPage);
  }, [selectedPage]);
  return (
    <div className=" w-full flex flex-col items-center justify-start">
      <div className="max-h-[60vh] w-full flex items-center justify-center">
        <div
          className="border-2 scale-[0.7] relative"
          style={{
            minHeight:
              data.pageSetup.orientation === "landscape"
                ? data.pageSetup?.size?.height
                : data.pageSetup?.size?.width,
            minWidth:
              data.pageSetup.orientation === "landscape"
                ? data.pageSetup?.size?.width
                : data.pageSetup?.size?.height,
          }}
        >
          {items?.map((item, index) => {
            return (
              <ItemRenderer
                key={index}
                item={item}
                fromOverlay={true}
                fromPreview={true}
              />
            );
          })}
        </div>
      </div>
      <div className="max-w-[90%] overflow-x-auto  customScrollBar">
        <div className="flex gap-2">
          {data.pages.map((page, index) => {
            return (
              <Card
                key={index}
                className="cursor-pointer   min-w-[150px] max-w-[150px] aspect-video"
                style={{
                  border:
                    selectedPage === index
                      ? "2px solid #05686E"
                      : "2px solid #05686E70",
                }}
                isPressable
                onPress={() => {
                  setSelectedPage(index);
                }}
              >
                <CardBody className="overflow-hidden py-2">
                  <div >
                    <div
                      className=" origin-top-left scale-[0.1] relative"
                      style={{
                        minHeight:
                          data.pageSetup.orientation === "landscape"
                            ? data.pageSetup?.size?.height
                            : data.pageSetup?.size?.width,
                        minWidth:
                          data.pageSetup.orientation === "landscape"
                            ? data.pageSetup?.size?.width
                            : data.pageSetup?.size?.height,
                      }}
                    >
                      {data.items?.filter((item) => item?.pageIndex === index)?.map((item, index) => {
                        return (
                          <ItemRenderer
                            key={index}
                            item={item}
                            fromOverlay={true}
                            fromPreview={true}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PresentationModalView;
