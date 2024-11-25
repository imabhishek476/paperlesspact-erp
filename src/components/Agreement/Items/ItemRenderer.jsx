import React from 'react';
import Signature from './Signature';
import DateSign from './DateSign';
import RadioButton from './RadioButton';
import DropdownItem from './DropdownItem';
import CustomDropdownItem from './DropdownItem';
import ImageItem from './ImageItem';
import TextItem from './TextItem';
import VideoItem from './VideoItem';
import FileItem from './FileItem';
import CheckBoxItem from './CheckboxItem';

const colors = [
  {
    color: 'rgba(0, 112, 240,0.2)',
    variant: 'primary',
  },
  {
    color: 'rgba(245, 165, 36,0.2)',
    variant: 'warning',
  },
  {
    color: 'rgba(243, 83, 96,0.2)',
    variant: 'danger',
  },
];

const ItemRenderer = ({
  item,
  setSelectedFieldItem,
  selectedSignee,
  selectedFieldItem,
  signees,
  onOpen,
  setUpdate,
  setItems,
}) => {
  console.log(item.field);
  if (item.type === 'text' && item.field !== "Date Signed") {
    return (
      <TextItem
        item={item}
        setSelectedFieldItem={setSelectedFieldItem}
        selectedFieldItem={selectedFieldItem}
        setUpdate={setUpdate}
        selectedSignee={selectedSignee}
        setItems={setItems}
        signees={signees}
        colors={colors}
      />
    );
  }
  if (item.field === 'Image') {
    return (
      <ImageItem
        item={item}
        setSelectedFieldItem={setSelectedFieldItem}
        selectedFieldItem={selectedFieldItem}
        setUpdate={setUpdate}
        selectedSignee={selectedSignee}
        setItems={setItems}
        signees={signees}
        colors={colors}
      />
    );
  }

  switch (item.field) {
    case 'Signature':
      return (
        <Signature
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedSignee={selectedSignee}
          signees={signees}
          onOpen={onOpen}
          colors={colors}
        />
      );
    case 'file':
      return (
        <FileItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedSignee={selectedSignee}
          signees={signees}
          setItems={setItems}
          onOpen={onOpen}
          colors={colors}
        />
      );
    case 'Initials':
      return (
        <Signature
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedSignee={selectedSignee}
          signees={signees}
          onOpen={onOpen}
          colors={colors}
        />
      );
    case 'Video':
      return (
        <VideoItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'Date Signed':
      return (
        <DateSign
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'radio buttons':
      return (
        <RadioButton
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'dropdown':
      return (
        <CustomDropdownItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'image':
      return (
        <ImageItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedFieldItem={selectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'stamp':
      return (
        <ImageItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedFieldItem={selectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'text':
      return (
        <TextItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedFieldItem={selectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'Text':
      return (
        <TextItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedFieldItem={selectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    case 'check box':
      return (
        <CheckBoxItem
          item={item}
          setSelectedFieldItem={setSelectedFieldItem}
          selectedFieldItem={selectedFieldItem}
          setUpdate={setUpdate}
          selectedSignee={selectedSignee}
          setItems={setItems}
          signees={signees}
          colors={colors}
        />
      );
    default:
      return <></>;
  }
};

export default ItemRenderer;
