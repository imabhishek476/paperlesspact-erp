import React from "react";
import TextFillableField from "../../../Template/FillableFields/TextFillableField";
import ImageFillableField from "../../../Template/FillableFields/ImageFillableField";
import RadioButtonFillableField from "../../../Template/FillableFields/RadioButtonFillableField";
import CheckboxFillableField from "../../../Template/FillableFields/CheckboxFillableField";
import DropdownFillableField from "../../../Template/FillableFields/DropdownFillableField";
import FileFillableField from "../../../Template/FillableFields/FileFillableField";
import PaymentFillableField from "../../../Template/FillableFields/PaymentFillableField";
import VideoFillableField from "../../../Template/FillableFields/VideoFillableField";
import InEditorImage from "../../../Template/FillableFields/InEditorImage";
import TextAreaField from "../../../Template/FillableFields/TextAreaField";
import ShapeField from "../../../Template/FillableFields/ShapeField";
import TableField from "../../../Template/FillableFields/TableField";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { createEditor } from "lexical";
import EditorTheme from "../../lexical-playground/src/themes/PlaygroundEditorTheme";
import { useDocItemStore } from "@/components/Template/stores/useDocItemStore";

const FillableFieldsRenderer = ({
  setMenuOpen,
  setItemClicked,
  itemClicked,
  setCopiedItem,
  setActiveRef,
  update,
  setUpdate,
  participants,
  serverData,
  sharedItems,
  updateSharedItem,
  item,
  handleDrop,
  setMenuItem,
  menuItem,
  pageOreintation,
  activeRef,
  activePageIndex,
  id
}) => {
  
  const {updateItem,deleteItem,setSelectedFieldItem,items,setSelectedItem,selectedItem}=useDocItemStore();
  switch (item.type) {
    case "text":
      return (
        <TextFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "image":
      return (
        <ImageFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "radio":
      return (
        <RadioButtonFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "checkbox":
      return (
        <CheckboxFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "dropdown":
      return (
        <DropdownFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "file":
      return (
        <FileFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "payment":
      return (
        <PaymentFillableField
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "video":
      return (
        <VideoFillableField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "inEditorImage":
      return (
        <InEditorImage
          setMenuOpen={setMenuOpen}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          setMenuItem={setMenuItem}
          pageOreintation={pageOreintation}
        />
      );
    case "textArea":
      return (
        <TextAreaField
        menuItem={menuItem}
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setActiveRef={setActiveRef}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
          activePageIndex={activePageIndex}
          pageIndex={id}
        />
      );
    case "shape":
      return (
        <ShapeField
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setActiveRef={setActiveRef}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      );
    case "table":
      return (
        <TableField
        menuItem={menuItem}
        activeRef={activeRef}
          setMenuOpen={setMenuOpen}
          setMenuItem={setMenuItem}
          setItemClicked={setItemClicked}
          itemClicked={itemClicked}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setActiveRef={setActiveRef}
          recipients={participants?.recipients}
          update={update}
          setUpdate={setUpdate}
          data={serverData}
          key={item.id}
          item={item}
          items={items}
          updateItem={updateItem}
          setSelectedFieldItem={setSelectedFieldItem}
          handleRemoveItem={deleteItem}
          handleDrop={handleDrop}
          sharedItems={sharedItems}
          updateSharedItem={updateSharedItem}
          pageOreintation={pageOreintation}
        />
      )

    default:
      return <></>;
  }
};

export default FillableFieldsRenderer;
