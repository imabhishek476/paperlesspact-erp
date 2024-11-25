import React, { useEffect, useState } from "react";
import ItemWrapper from "./ItemWrapper";
import { getSVG } from "../../Template/shapes/shapeSvgConstants";
import { useItemStore } from "../stores/useItemStore";
import { usePageStore } from "../stores/usePageStore";
const ShapeField = ({ item, fromOverlay, fromPreview, fromImport }) => {
  const { setSelectedItem, updateItem } = useItemStore();
  const { selectedPage, pagePercent , pageSetup} = usePageStore();
  const [itemSVG, setItemSVG] = useState(null);
  useEffect(() => {
    if (true) {
      updateItem({
        ...item,
        itemSvg: getSVG(item.title, item.options, item.size, item?.orientation,false, pageSetup?.size),
      });
    }
  }, []);
  useEffect(() => {
    if (!fromPreview) {
      updateItem({
        ...item,
        itemSvg: getSVG(item.title, item.options, item.size, item?.orientation,false, pageSetup?.size),
      });
     
    }
  }, [selectedPage, fromOverlay, pagePercent]);
  useEffect(() => {
    setItemSVG(
      getSVG(item.title, item.options, item.size, item?.orientation,false, pageSetup?.size)
    );
  
  }, [item])
  
  return (
    <ItemWrapper
      item={item}
      fromOverlay={fromOverlay}
      fromPreview={fromPreview}
    >
 <div
  className="w-full h-full"
  style={{ opacity: item?.options?.opacity }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
  }}
  // onBlur={() => setSelectedItem(null)}
>
  {itemSVG}
</div>
    </ItemWrapper>
  );
};

export default ShapeField;
