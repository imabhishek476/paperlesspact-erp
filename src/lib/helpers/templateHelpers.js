import { $getRoot } from "lexical";
import { uploadDocument } from "../../Apis/uploadDoc";

export const updateBorderFromPosition = (
  increase,
  pageSize,
  position,
  updateValue = { x: 3, y: 5 }
) => {
  const topDiff =
    (updateValue.y / Number(pageSize.height.split("px")[0])) * 100;
  const leftDiff =
    (updateValue.x / Number(pageSize.width.split("px")[0])) * 100;
  const actualTopPos = Number(position.y.split("%")[0]);
  const actualLeftPos = Number(position.x.split("%")[0]);
  console.log(actualTopPos, topDiff);
  console.log(actualLeftPos, leftDiff);
  if (increase) {
    return {
      y: `${actualTopPos + topDiff}%`,
      x: `${actualLeftPos + leftDiff}%`,
    };
  }
  return {
    y: `${actualTopPos - topDiff}%`,
    x: `${actualLeftPos - leftDiff}%`,
  };
};

export const convertImageFromFileToLink = async (item, pageSize) => {
  try {
    return new Promise((resolve, reject) => {
      let updatedItem = null;
      if (item.file && item.file.name) {
        const img = new Image();
        img.onload = async function () {
          console.log("yay");
          const imgWidth =
            (item?.imageSize?.width / 100) *
            Number(pageSize.width.split("px")[0]);
          const imgHeight =
            (item?.imageSize?.height / 100) *
            Number(pageSize.height.split("px")[0]);
          const canvas2 = document.createElement("canvas");
          canvas2.setAttribute("width", imgWidth);
          canvas2.setAttribute("height", imgHeight);
          const ctx2 = canvas2.getContext("2d");
          // ctx2.drawImage(img, 5, 10, 200,61);
          ctx2.drawImage(img, 0, 0, imgWidth, imgHeight);
          const dataUrl2 = canvas2.toDataURL();
          const fileImagePNG = await fetch(dataUrl2)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File([blob], item.file.name, {
                type: blob.type,
              });
              console.log(file);
              // onSign(file, all);
              return file;
            });
          const data = {
            documentFile: fileImagePNG,
            documentType: "image",
            documentName: fileImagePNG?.name,
            documentExtention: "png",
            documentDescription: "",
            isActive: 1,
          };
          const res = await uploadDocument(data);
          console.log(res);
          console.log({
            ...item,
            file: null,
            link: res?.documentUrl,
          });
          updatedItem = {
            ...item,
            file: null,
            link: res.documentUrl,
          };
          resolve(updatedItem);
        };
        img.src = URL.createObjectURL(item.file);
        console.log(updatedItem);
      } else {
        resolve(null);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const getShapeItemPreparedForPDFUpload = async (item) => {
  try {
    return new Promise((resolve, reject) => {
      const svg = document.getElementById(`shape-${item?.id}`);
      const svgAsXML = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = "data:image/svg+xml," + encodeURIComponent(svgAsXML);
      img.onload = async function () {
        const imgWidth = item?.size?.width;
        const imgHeight = item?.size?.height;
        const canvas2 = document.createElement("canvas");
        canvas2.setAttribute("width", imgWidth);
        canvas2.setAttribute("height", imgHeight);
        const ctx2 = canvas2.getContext("2d");
        // ctx2.drawImage(img, 5, 10, 200,61);
        ctx2.drawImage(img, 0, 0, imgWidth, imgHeight);
        const dataUrl2 = canvas2.toDataURL();
        // debugger;
        const res = await fetch(dataUrl2);
        const blob = await res.blob();
        const fileImagePNG = new File([blob], item.title, {
          type: blob.type,
        });
        if (fileImagePNG) {
          resolve({
            ...item,
            file: fileImagePNG,
          });
        } else {
          resolve({
            ...item,
          });
        }
      };
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateItemYPos = (
  isHeaderActive,
  yPos,
  prevRelHeight,
  newRelHeight,
  headerHeight = "128px"
) => {
  let actualHeightFromPageTop =
    (percentToNumber(yPos) / 100) * pixelToNumber(prevRelHeight);
  if (isHeaderActive) {
    actualHeightFromPageTop += pixelToNumber(headerHeight);
  }
  return `${(actualHeightFromPageTop / pixelToNumber(newRelHeight)) * 100}%`;
};

export const updateHeaderFooterItemYPosition = (
  isHeader,
  yPos,
  prevRelHeight,
  newRelHeight,
  contentHeight,
  headerHeight = "128px"
) => {
  if (isHeader) {
    const actualHeightFromPageTop =
      (percentToNumber(yPos) / 100) * pixelToNumber(prevRelHeight);
    console.log(actualHeightFromPageTop);
    return `${(actualHeightFromPageTop / pixelToNumber(newRelHeight)) * 100}%`;
  } else {
    const actualHeightFromPageTop =
      (percentToNumber(yPos) / 100) * pixelToNumber(prevRelHeight) +
      pixelToNumber(contentHeight) +
      pixelToNumber(headerHeight);
    return `${(actualHeightFromPageTop / pixelToNumber(newRelHeight)) * 100}%`;
  }
};

export const getPageHeightHeaderFooter = (
  pageSetup,
  headerActive,
  footerActive,
  activeHeaderFooterPageHeight
) => {
  console.log(headerActive, footerActive, activeHeaderFooterPageHeight);
  return headerActive || footerActive
    ? activeHeaderFooterPageHeight
    : getPageHeight(pageSetup);
};

export const getPageHeight = (pageSetup) => {
  return pageSetup?.orientation === "landscape"
    ? pageSetup?.size?.width
    : pageSetup?.size?.height;
};
export const getPageWidth = (pageSetup) => {
  return pageSetup?.orientation === "landscape"
    ? pageSetup?.size?.height
    : pageSetup?.size?.width;
};

export const pixelToNumber = (itemInPixel) => {
  return Number(itemInPixel.replace("px", ""));
};
export const percentToNumber = (inputValue) => {
  return Number(inputValue.replace("%", ""));
};
export const upadteposWithHeader = (
  pageSize,
  position,
  pageOreintation,
  option
) => {
  console.log(pageSize);
  const newPosY = percentToNumber(position);
  let newHeight;
  if (option) {
    if (pageOreintation === "landscape") {
      const newH = pixelToNumber(pageSize.width);
      newHeight = (128 / newH) * 100;
    } else {
      const newH = pixelToNumber(pageSize.height);
      newHeight = (128 / newH) * 100;
    }
    if (newHeight) {
      return `${newPosY + newHeight}%`;
    }
    return position;
  } else {
    if (pageOreintation === "landscape") {
      const newH = pixelToNumber(pageSize.width);
      newHeight = (128 / newH) * 100;
    } else {
      const newH = pixelToNumber(pageSize.height);
      newHeight = (128 / newH) * 100;
    }
    if (newHeight) {
      return `${newPosY - newHeight}%`;
    }
    return position;
  }
};
export const upadteposWithFooter = (
  pageSize,
  headerActive,
  position,
  pageOreintation,
  option
) => {
  console.log(pageSize);
  const newPosY = percentToNumber(position);
  let newHeight;
  if (option) {
    if (pageOreintation === "landscape") {
      let totalHeight;
      const curerentHeight = pixelToNumber(pageSize.width) - 128;
      if (headerActive) {
        totalHeight = pixelToNumber(pageSize.width) + 128;
      } else {
        totalHeight = pixelToNumber(pageSize.width);
      }
      return `${(curerentHeight / totalHeight) * 100}%`;
    } else {
      let totalHeight;
      const curerentHeight = pixelToNumber(pageSize.height);
      if (headerActive) {
        totalHeight = pixelToNumber(pageSize.height) + 128;
      } else {
        totalHeight = pixelToNumber(pageSize.height);
      }
      return `${(curerentHeight / totalHeight) * 100}%`;
    }
  } else {
    if (pageOreintation === "landscape") {
      const newH = pixelToNumber(pageSize.width);
      newHeight = (128 / newH) * 100;
    } else {
      const newH = pixelToNumber(pageSize.height);
      newHeight = (128 / newH) * 100;
    }
    if (newHeight) {
      return `${newPosY - newHeight}%`;
    }
    return position;
  }
};
export const getOrginalHeight = (
  pageSize,
  pageOreintation,
  headerActive,
  footerActive
) => {
  // debugger
  console.log(pageOreintation);
  if (pageOreintation === "landscape") {
    if (headerActive && footerActive) {
      const heightInNum = pixelToNumber(pageSize.width);
      return `${heightInNum + 256}px`;
    } else {
      if (headerActive) {
        const heightInNum = pixelToNumber(pageSize.width);
        return `${heightInNum + 128}px`;
      }
      if (footerActive) {
        const heightInNum = pixelToNumber(pageSize.width);
        return `${heightInNum + 128}px`;
      }
    }
  } else {
    console.log("in");
    if (headerActive && footerActive) {
      const heightInNum = pixelToNumber(pageSize.height);
      return `${heightInNum + 256}px`;
    } else {
      if (headerActive) {
        const heightInNum = pixelToNumber(pageSize.height);
        return `${heightInNum + 128}px`;
      }
      if (footerActive) {
        const heightInNum = pixelToNumber(pageSize.height);
        return `${heightInNum + 128}px`;
      }
    }
  }
  return pageSize.height;
};
export const headerItemPos = (
  pageSize,
  position,
  pageOreintation,
  headerActive,
  footerActive
) => {
  const newPosY = percentToNumber(position);
  const newFullHeight = pixelToNumber(pageSize?.height);
  console.log(newFullHeight);
  const newHeight = ((128 * newPosY) / 100 / newFullHeight) * 100;
  console.log(newHeight);
  return `${newHeight}%`;

  // ((128 * top) / fullHeight) * 100
};
export const FooterItemPos = (
  pageSize,
  position,
  pageOreintation,
  headerActive,
  footerActive
) => {
  const newPosY = percentToNumber(position);
  const fullHeight = getOrginalHeight(
    pageSize,
    pageOreintation,
    headerActive,
    footerActive
  );
  let sizeWithOption;
  if (pageOreintation === "landscape") {
    sizeWithOption = pixelToNumber(pageSize.width);
  } else {
    sizeWithOption = pixelToNumber(pageSize.height);
  }

  if (headerActive) {
    sizeWithOption = sizeWithOption + 128;
  }
  const newFullHeight = pixelToNumber(fullHeight);
  console.log(newFullHeight);
  const newHeight = (128 * newPosY) / sizeWithOption;
  const tHeight = (sizeWithOption / newFullHeight) * 100;
  return `${newHeight + tHeight}%`;
};

export const isEditorEmpty = (editor) => {
  try {
    // debugger;
    if (!editor) {
      throw Error("No editor provided");
    }
    if (editor.getEditorState().isEmpty()) {
      return true;
    }
    let isEmpty = false;
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      // debugger;
      if(children.length === 0){
        isEmpty = true;
        // return;
      }
      if (children.length === 1) {
        if ($isParagraphNode(children[0])) {
          console.log(children);
          const paragraphChildren = children[0].getChildren();
          if (paragraphChildren.length === 0) {
            isEmpty =  true;
          }
        }
      }
    });
    return isEmpty;
  } catch (err) {
    console.log(err);
  }
};
export const isEditorStateEmpty = (editorState) => {
  try {
    // debugger;
    if (!editorState) {
      throw Error("No editor provided");
    }
    if (editorState.isEmpty()) {
      return true;
    }
    let isEmpty = false;
    editorState.read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      // debugger;
      if(children.length === 0){
        isEmpty = true;
        // return;
      }
      if (children.length === 1) {
        if ($isParagraphNode(children[0])) {
          console.log(children);
          const paragraphChildren = children[0].getChildren();
          if (paragraphChildren.length === 0) {
            isEmpty =  true;
          }
        }
      }
    });
    return isEmpty;
  } catch (err) {
    console.log(err);
  }
};


