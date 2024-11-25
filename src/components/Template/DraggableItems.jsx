import { $createTableNode } from "@lexical/table";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical";
import {
  Banknote,
  BriefcaseIcon,
  Building,
  Calendar,
  CaseUpper,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  CircleDot,
  Columns,
  File,
  GripVertical,
  Image,
  ImagePlus,
  Minus,
  PenLine,
  PencilLine,
  Plus,
  ShoppingBag,
  Stamp,
  StickyNote,
  Table,
  Text,
  Type,
  TypeIcon,
  User,
  UserPlus,
  Video,
  Vote,
  WrapText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { $createStickyNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/StickyNode";
import { $createCollapsibleTitleNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { $createCollapsibleContainerNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { $createCollapsibleContentNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/CollapsiblePlugin/CollapsibleContentNode";
import InsertLayoutDialog from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/LayoutPlugin/InsertLayoutDialog";
import { InsertTableDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/TablePlugin";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createPageBreakNode } from "@/components/LexicalTemplatePlayground/lexical-playground/src/nodes/PageBreakNode";
import useModal from "@/components/LexicalTemplatePlayground/lexical-playground/src/hooks/useModal";
import { InsertImageDialog } from "@/components/LexicalTemplatePlayground/lexical-playground/src/plugins/ImagesPlugin";
import { Abc, Draw } from "@mui/icons-material";
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { CollaboratorModal, RecipientModal } from "./Participants";
import { useDocItemStore } from "./stores/useDocItemStore";
import { usePageDataStore } from "./stores/usePageDataStore";
import { useRouter } from "next/router";
import { useTabsStore } from "./stores/useDocTabsStore";
const contentItems = [
  {
    title: "Image",
    field: "inEditorImage",
    type: "inEditorImage",
    icon: <ImagePlus size={14} key={"videoIcon"} />,
    size: { height: 50, width: 250 },
    imageSize: {
      height: (300 / 1080) * 100,
      width: (300 / 768) * 100,
    },
    layer:1,
  },
  {
    title: "Table",
    type:"table",
    render:"table",
    size: { height: 220, width: 400 },
    icon: <Table size={14} />,
    layer:1,
  },
  {
    title: "Quote Builder",
    icon: <ShoppingBag size={14} />,
  },
  {
    title: "Video",
    field: "Video",
    type: "video",
    icon: <Video  size={14} key={"videoIcon"} />,
    size: { height: 50, width: 300 },
  },
  {
    title: "Free Textfield",
    field: "Text Area",
    type: "textArea",
    icon: <Type size={14} key={"freeTextfield"} />,
    size: { height: 50, width: 250 },
    layer:1,
  },
  // {
  //   title: "Page-Break",
  //   icon: <WrapText size={14} />,
  // },
  {
    title: "Horizontal Rule",
    icon: <Minus size={14} />,
    layer:1,
  },
  {
    title: "payment",
    field: "payment",
    type: "payment",
    size: { height: 80, width: 300 },
    icon: <Banknote size={14} key={"paymentIcon"} />,
    layer:1,
  },
  // {
  //   title: "Poll",
  //   icon: <Vote size={14} />,
  // },
  {
    title: "Columns Layout",
    type:"table",
    render:"column",
    size: { height: 76, width: 400 },
    icon: <Columns size={14} />,
    layer:1,
  },
  // {
  //   title: "Collapsible Container",
  //   icon: <ChevronsDownUp size={14} />,
  // },
  // {
  //   title: "Sticky Note",
  //   icon: <StickyNote size={14} />,
  // },
];
const userItems = [
  {
    title: "textfield",
    field: "Text",
    type: "text",
    placeholder: "",
    size: { height: 50, width: 250 },
    layer:1,
  },
  {
    title: "signature",
    field: "Signature",
    type: "image",
    size: { height: 70, width: 250 },
    layer:1,
  },
  {
    title: "initials",
    field: "Initials",
    size: { height: 70, width: 250 },
    type: "image",
    layer:1,
  },
  {
    title: "date",
    field: "Date Signed",
    type: "text",
    placeholder: "",
    size: { height: 50, width: 250 },
    layer:1,
  },
  {
    title: "radio buttons",
    field: "radio buttons",
    type: "radio",
    value: null,
    labels: ["Option 1", "Option 2"],
    size: { height: 100, width: 185 },
    layer:1,
  },
  {
    title: "check box",
    field: "check box",
    type: "checkbox",
    isSelected: false,
    size: { height: 50, width: 125 },
    layer:1,
  },
  {
    title: "stamp",
    field: "stamp",
    type: "image",
    size: { height: 70, width: 250 },
    layer:1,
  },
  {
    title: "dropdown",
    field: "dropdown",
    type: "dropdown",
    value: null,
    labels: ["Option 1", "Option 2"],
    size: { height: 80, width: 325 },
    layer:1,
  },
  {
    title: "file",
    field: "file",
    type: "file",
    size: { height: 70, width: 200 },
    layer:1,
  },
  {
    title: "payment",
    field: "payment",
    type: "payment",
    size: { height: 80, width: 300 },
    layer:1,
  },
  {
    title: "Company",
    field: "Company",
    placeholder: "Company",
    size: { height: 50, width: 250 },
    type: "text",
    layer:1,
  },
  {
    title: "Job Title",
    field: "Job Title",
    placeholder: "Job Title",
    type: "text",
    size: { height: 50, width: 250 },
    layer:1,
  },
  {
    title: "Fullname",
    field: "Fullname",
    placeholder: "Fullname",
    type: "text",
    size: { height: 50, width: 250 },
    layer:1,
  },
  {
    title: "Image",
    field: "Image",
    size: { height: 70, width: 250 },
    type: "image",
    layer:1,
  },
];

const userItemsIcons = [
  <TypeIcon size={14} key={"textIcon"} />,
  <PenLine size={14} key={"signatureIcon"} />,
  <CaseUpper size={14} key={"initialsIcon"} />,
  <Calendar size={14} key={"dateIcon"} />,
  <CircleDot size={14} key={"radioIcon"} />,
  <CheckSquare size={14} key={"checkIcon"} />,
  <Stamp size={14} key={"stampIcon"} />,
  <ChevronDown size={14} key={"dropdownIcon"} />,
  <File size={14} key={"fileIcon"} />,
  <Banknote size={14} key={"paymentIcon"} />,
  <Building size={14} key={"companyIcon"} />,
  <BriefcaseIcon size={14} key={"jobTitleIcon"} />,
  <User size={14} key={"fullnameIcon"} />,
  <Image size={14} key={"imageIcon"} />,
];
const DraggableItems = ({
  isDisabled,
  setOffsetX,
  setOffsetY,
  setSelectedFieldItem,
  selectedFieldItem,
  // selectedParticipant,
  // setSelectedParticipant,
  editorRef,
  recipients,
  disabledApprover,
  participants,
  setParticipants,
  doc
}) => {
  // console.log(selectedParticipant);
  const router=useRouter()
  const {id}=router.query
  const {serverData,isEditable}=usePageDataStore();
  console.log(serverData);
  const [hidden, setHidden] = useState(false);
  let itemFor=null
  let handleRemoveItem=null
  const [modal, showModal] = useModal(itemFor,handleRemoveItem);
  const [activeEditor, setActiveEditor] = useState(editorRef.current);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null);
  const {selectedParticipant,
    setSelectedParticipant,} = useDocItemStore();
  
  const handleDragStart = (e, field, index) => {
    if(!isEditable) return;
    console.log(field);
    const rect = e.target.getBoundingClientRect();
    setOffsetX(e.clientX - rect.x);
    setOffsetY(e.clientY - rect.y);
    console.log((index + e.clientX) * Math.floor(Math.random() * 100));
    console.log(field);
    setSelectedFieldItem({
      id:crypto.randomUUID(),
      signee: selectedParticipant,
      ...field,
    });
  };
  const handleDragEnd = (e, field, index) => {
    const rect = e.target.getBoundingClientRect();
    setOffsetX(e.clientX);
    setOffsetY(e.clientY);
    console.log(e.clientX - rect.x, e.clientY - rect.y);
    console.log((index + e.clientX) * Math.floor(Math.random() * 100));
    // setSelectedFieldItem({
    //   id: (index + e.clientX) * Math.floor(Math.random() * 100),
    //   field: field.name,
    //   signee: selectedParticipant,
    //   type: field.type && field.type,
    // });
    const editor = editorRef.current;
    const keys = editor
      .getEditorState()
      .read(() => $getRoot().getChildrenKeys());
    const elements = keys.map((key) => editor.getElementByKey(key));
    const distanceFromElements = elements.map((element) => {
      const { x, y } = element.getBoundingClientRect();
      const yC = (y - e.clientY) * (y - e.clientY);
      const xC = (x - e.clientX) * (x - e.clientX);
      console.log(Math.sqrt(yC + xC));
      return Math.sqrt(yC + xC);
    });
    const minIndex = distanceFromElements.reduce(function (
      minIndex,
      currentValue,
      currentIndex,
      array
    ) {
      return currentValue < array[minIndex] ? currentIndex : minIndex;
    },
    0);
    const targetKey = keys[minIndex];
    console.log(keys, targetKey);
    let targetNode = null;
    let targetEle = null;
    editorRef.current.update(() => {
      targetEle = editorRef.current.getElementByKey(targetKey);
      targetNode = $getNearestNodeFromDOMNode(targetEle);
      console.log(targetNode);
      console.log(keys, targetKey);
      if (targetNode) {
        const newNode = $createParagraphNode();
        console.log(selectedFieldItem);
        switch (selectedFieldItem.title) {
          case "text":
            newNode.append($createTextNode("Start Writing"));
            break;
          case "image":
            console.log("in image");
            showModal("Insert Image", (onClose) => (
              <InsertImageDialog
                activeEditor={activeEditor}
                onClose={onClose}
                fromEditor={true}
                targetNode={newNode}
              />
            ));
            break;
          case "table":
            console.log("in image");
            showModal("Insert Table", (onClose) => (
              <InsertTableDialog
                activeEditor={activeEditor}
                onClose={onClose}
                fromEditor={true}
                targetNode={newNode}
                setSize={null}
              />
            ));
            break;
          case "Columns Layout":
            console.log("in image");
            showModal("Insert Columns Layout", (onClose) => (
              <InsertLayoutDialog
                activeEditor={activeEditor}
                onClose={onClose}
                fromEditor={true}
                targetNode={targetNode}
              />
            ));
            break;
          case "Collapsible Container":
            const title = $createCollapsibleTitleNode();
            const paragraph = $createParagraphNode();
            newNode.insertAfter(
              $createCollapsibleContainerNode(true).append(
                title.append(paragraph),
                $createCollapsibleContentNode().append($createParagraphNode())
              )
            );
            break;
          case "Page-Break":
            newNode.append($createPageBreakNode());
            break;
          case "Horizontal Rule":
            newNode.append($createHorizontalRuleNode());
            break;
          case "Sticky Note":
            const root = $getRoot();
            const stickyNode = $createStickyNode(0, 0);
            console.log(root);
            root.append(stickyNode);
            break;

          default:
            newNode.append($createTextNode("Start Writing"));
            break;
        }

        // const elementNode =editorRef.current.getElementByKey(newNode.getKey())
        // console.lo
        targetNode.insertBefore(newNode);
        console.log(newNode);
      }
    });
  };

  const handleOpenModal = (modalType) => {
    if (modalType === 'recipient') {
      setModalType(
        <RecipientModal
          onClose={onClose}
          id={serverData?._id ?serverData?._id :id}
          participants={participants}
          setParticipants={setParticipants}
          doc={doc}
        />
      );
    }
    onOpen();
  };

  useEffect(() => {
    return editorRef?.current?.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editorRef.current]);
  return (
    <div
      className={`relative h-[calc(100vh-101px)] overflow-scroll flex flex-col transform-[width] ease-in `}
    >
      <div className={` ${hidden ? "hidden" : "flex"} flex-col pb-4 gap-3`}>
        <div className={`${isDisabled ? "hidden" : "block"} p-4 border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#05686E]">Content</span>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-12 px-2 gap-4 ${
            isDisabled ? "hidden" : "block"
          }`}
        >
          {contentItems &&
            contentItems.map((ele, index) => {
              if (ele?.type === "video") {
                return (
                  <div
                    key={ele.title}
                    draggable={isEditable}
                    onDragStart={(e) => handleDragStart(e, ele, index)}
                    onDragEnd={() => setSelectedFieldItem(null)}
                    className=" flex justify-between  items-center col-span-6 select-none bg-white  shadow-none h-[42px]  capitalize text-[10px]  hover:cursor-move rounded border border-[#05686e]"
                  >
                    <div className="flex items-center py-[10px] px-[2px]">
                      <GripVertical size={12} />
                      <p>{ele.title}</p>
                    </div>
                    <div className="flex items-center justify-center min-w-[24px] px-[9px] h-full bg-[#05686e] text-white rounded-r">
                      {ele?.icon}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={ele.title}
                  draggable={isEditable}
                  onDragStart={(e) => handleDragStart(e, ele, index)}
                  // onDragEnd={(e) => handleDragEnd(e, ele, index)}
                  className=" flex justify-between  items-center col-span-6  bg-white select-none shadow-none h-[42px]  capitalize text-[10px]  hover:cursor-move rounded border border-[#05686e]"
                >
                  <div className="flex items-center py-[10px] px-[2px]">
                    <GripVertical size={12} />
                    <p>{ele.title}</p>
                  </div>
                  <div className="flex items-center justify-center min-w-[24px] px-[9px] h-full bg-[#05686e] text-white rounded-r">
                    {ele.icon}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex flex-col gap-2 p-4 border-b border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#05686E]">
                Fillable Fields
              </span>
            </div>
            <div>
              <Chip
                radius="small"
                size="sm"
                classNames={{
                  base: "bg-[#fff] text-[#05686e] border border-[#05686e]",
                  content: "text-[#05686e] ",
                }}
              >
                To be filled by recipient
              </Chip>
            </div>
          </div>
          {serverData?.scope !== "global" &&
            <div className="flex justify-between">
              <Dropdown>
                <DropdownTrigger>
                  <Button isDisabled={!isEditable} className="rounded-full bg-white text-[#05686e] border border-[#05686e] px-2" endContent={<ChevronDown size={18}/>}>
                    <span className="truncate max-w-[200px]">
                      
                    {selectedParticipant ? selectedParticipant.fullname : "Select Recipient"}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Dynamic Actions"
                  items={recipients?.filter(
                    (recipient) => recipient.signerRole !== "CC"
                  )}
                >
                  {recipients
                    ?.filter((recipient) => recipient.signerRole !== "CC")
                    ?.map((participant) => {
                      return (
                        <DropdownItem
                          key={participant.email}
                          onClick={()=>{
                            setSelectedParticipant(participant);
                          }}
                        >
                          {participant.email}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </Dropdown>
                <Button isDisabled={disabledApprover} variant="light" color="success"  className='px-2'startContent={<Plus size={12} />} onClick={()=>{
                  handleOpenModal('recipient');
                }}>
                  <span className="text-[12px]">Invite</span>
                </Button>
              
            </div>
          }
        </div>

        <div className="grid grid-cols-12 px-2 gap-4">
          {userItems &&
            userItems.map((ele, index) => {
              return (
                <div
                  key={ele.title}
                  draggable={isEditable}
                  onDragStart={(e) => handleDragStart(e, ele, index)}
                  className=" flex justify-between  items-center col-span-6  bg-white select-none  shadow-none h-[42px]  capitalize text-[10px]  hover:cursor-move rounded border border-[#05686e]"
                >
                  <div className="flex items-center py-[10px] px-[2px]">
                    <GripVertical size={12} />
                    <p>{ele.title}</p>
                  </div>
                  <div className="flex items-center justify-center min-w-[24px] px-[9px] h-full bg-[#05686e] text-white rounded-r">
             {userItemsIcons[index]}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {modal}
      <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
          <ModalContent>{(onClose) => <>{modalType || <></>}</>}</ModalContent>
        </Modal>
    </div>
  );
};

export default DraggableItems;
