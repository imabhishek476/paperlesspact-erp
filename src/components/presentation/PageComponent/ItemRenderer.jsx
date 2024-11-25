import React from "react";
import Textfield from "../Items/Textfield";
import ShapeField from "../Items/ShapeField";
import ImageField from "../Items/ImageField";
import VideoField from "../Items/VideoField";
import AvatarField from "../Items/AvatarField";

const ItemRenderer = ({ item, fromOverlay, fromPreview,container }) => {
  switch (item?.type) {
    case "text":
      return (
        <Textfield
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          container={container}          
        />
      );
    case "shape":
      return (
        <ShapeField
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          container={container}          
        />
      );
    case "image":
      return (
        <ImageField
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          container={container}          
        />
      );
    case "video":
      return (
        <VideoField
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          container={container}          
        />
      );
    case "avatar":
      return (
        <AvatarField
          item={item}
          fromOverlay={fromOverlay}
          fromPreview={fromPreview}
          container={container}          
        />
      );

    default:
      return <></>;
  }
};

export default ItemRenderer;
