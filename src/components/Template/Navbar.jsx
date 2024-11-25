import { getUserProfile } from "@/Apis/login";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { Nunito } from "next/font/google";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import {
  $getRoot,
  $isParagraphNode,
  $nodesOfType,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import useModal from "../LexicalTemplatePlayground/lexical-playground/src/hooks/useModal";
import { mergeRegister } from "@lexical/utils";
import { renderToStaticMarkup } from "react-dom/server";
import { createContact } from "@/Apis/contacts";
import { getSVG } from "../../components/Template/shapes/shapeSvgConstants";

import {
  AtSign,
  Download,
  Eraser,
  File,
  HelpCircle,
  Loader,
  Lock,
  Mail,
  MessageCircleMore,
  MessageCircleOff,
  Mic,
  Plug,
  Save,
  Settings,
  Trash2,
  Unlock,
  Unplug,
  Upload,
} from "lucide-react";
import { SUPPORT_SPEECH_RECOGNITION } from "../LexicalTemplatePlayground/lexical-playground/src/plugins/SpeechToTextPlugin";
import { createPDF, handleApprover, sendTemplate } from "../../Apis/template";
import { downloadPDF, templateUse } from "../../Apis/folderStructure";
import { useEnv } from "../Hooks/envHelper/useEnv";
import { Alert, Snackbar } from "@mui/material";
import NavbarCta from "./NavbarCta";
import { useEditor } from "../LexicalTemplatePlayground/lexical-playground/src/context/EditorProvider";
import { prepareDocument } from "../../Apis/legalAgreement";
import {
  convertImageFromFileToLink,
  getPageHeight,
  getPageWidth,
  getShapeItemPreparedForPDFUpload,
  headerItemPos,
  isEditorStateEmpty,
  updateBorderFromPosition,
  updateHeaderFooterItemYPosition,
  updateItemYPos,
} from "../../lib/helpers/templateHelpers";
import { usePageDataStore } from "./stores/usePageDataStore";
import { useDocHistory } from "./stores/useDocHistoryStore";
import { useDocItemStore } from "./stores/useDocItemStore";
import { useTabsStore } from "./stores/useDocTabsStore";
import { MentionNode } from "../LexicalTemplatePlayground/lexical-playground/src/nodes/VariableNode";

// import Modal from "../LexicalTemplatePlayground/lexical-playground/src/ui/Modal";

const NavBar = ({
  isActiveUpload,
  setIsActiveUpload,
  data,
  setCurrentApprover,
  currentApprover,
  disabledApprover,
  approverSelection,
  title,
  cta,
  name,
  showComments,
  setShowComments,
  templateUseTitle,
  participants,
  isSigningOrder,
  signMethod,
  updateItemsWithCorrectPage,
  isPreparing,
  approverSequence,
  setApproverSelection,
  setApproverSequence,
  setIsPreparing,
  pagesData,
  // setItems,
  docDetails,
  setDocDetails,
  setServerData,
  updateDb,
  // stampFile,
  pageOreintation,
  pageSize,
  setIsContactSave,
  isContactSave,
}) => {
  // console.log(docDetails?.emailTemplate,docDetails?.settings)
  // // // console.log(pagesData[0]?.ref.current?.update);
  // const [editor] = useLexicalComposerContext();
  const [isSpeechToText, setIsSpeechToText] = useState(false);

  // const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  // console.log(docDetails.settings);
  const { pageSetup } = useTabsStore();
  const [details, setDetails] = useState(null);
  const [connected, setConnected] = useState(false);
  const [documentSettings, setdocumnetSettings] = useState({
    autoReminder: true,
    requiredAllSigners: true,
    expires: "1d",
  });
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  let item = null;
  let handleRemoveItem = null;
  const [modal, showModal] = useModal(item, handleRemoveItem);
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  const inDevEnvironment = useEnv();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownLoadLoading, setIsDownloadLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const {
    pages,
    updatePage,
    headerActive,
    footerActive,
    pageHeader,
    pageFooter,
    activeHeaderFooterPageHeight,
    headerPadding,
    footerPadding,
    showPageNo,
  } = usePageDataStore();
  const { items, setItems } = useDocItemStore();
  const { variables, stampFile } = useTabsStore();
  const saveContacts = async (contacts) => {
    let saved;
    try {
      return (saved = await Promise.all(
        contacts.map(async (ele) => {
          const response = await createContact({
            signersEmail: ele.signersEmail,
            lang: "en",
            fullname: ele.fullname,
            signerRole: ele.signerRole,
            signerMethod: "email",
          });
          return response;
        })
      )
        .then(() => true)
        .catch((err) => {
          console.log(err);
          return false;
        }));
    } catch (err) {
      console.log(err);
    }
  };
  const isEditorEmpty = pages?.some((ele) => ele?.isPageEmpty === true);
  // console.log(isEditorEmpty);
  useEffect(() => {
    // console.log(pagesData);
  }, [pages]);

  console.log(pagesData);
  const logOut = () => {
    if (inDevEnvironment) {
      Cookies.remove("accessToken");
      Cookies.remove("assignedRole");
      Cookies.remove("isLoggedIn");
      Cookies.remove("onbording");
      // console.log('in me');
    } else {
      Cookies.remove("accessToken", { domain: ".easedraft.com" });
      Cookies.remove("assignedRole", { domain: ".easedraft.com" });
      Cookies.remove("isLoggedIn", { domain: ".easedraft.com" });
      Cookies.remove("onbording", { domain: ".easedraft.com" });
      // console.log('in me');
    }
    router.reload();
  };
  const onApproveHandler = async (action) => {
    const res = await handleApprover({
      id: data?._id,
      approver: currentApprover,
      action: action,
    });
    if (res) {
      router.push("/dashboard");
    }
  };
  // console.log(currentApprover)
  // console.log(data.approverStatus);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(accessToken);
        setDetails(userProfile);
        console.log(userProfile)
        if (
          data?.approvers?.length > 0 &&
          data?.approvers?.some((el) => el.email === userProfile?.data?.email)
        ) {
          if (
            data.approverStatus === "sent" ||
            data.approverStatus === "approved" ||
            !data?.approvalFlow
          ) {
            // console.log("yay")
            setCurrentApprover(
              data?.approvers?.find(
                (el) => el.email === userProfile?.data?.email
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  // // console.log(currentApprover);
  // useEffect(() => {
  //   return editor.registerUpdateListener(
  //     ({ dirtyElements, prevEditorState, tags }) => {
  //       // If we are in read only mode, send the editor state
  //       // to server and ask for validation if possible.
  //       // if (
  //       //   !isEditable &&
  //       //   dirtyElements.size > 0 &&
  //       //   !tags.has('historic') &&
  //       //   !tags.has('collaboration')
  //       // ) {
  //       //   validateEditorState(editor);
  //       // }
  //       editor.getEditorState().read(() => {
  //         const root = $getRoot();
  //         const children = root.getChildren();

  //         if (children.length > 1) {
  //           setIsEditorEmpty(false);
  //         } else {
  //           if ($isParagraphNode(children[0])) {
  //             const paragraphChildren = children[0].getChildren();
  //             setIsEditorEmpty(paragraphChildren.length === 0);
  //           } else {
  //             setIsEditorEmpty(false);
  //           }
  //         }
  //       });
  //     }
  //   );
  // }, [editor, isEditable]);

  const isItemsValid = (from) => {
    console.log(items);
    const filteredItems = items.filter(
      (ele) =>
        ele?.type !== "inEditorImage" &&
        ele?.type !== "table" &&
        ele?.type !== "video" &&
        ele?.type !== "textArea" &&
        ele?.type !== "shape" &&
        ele?.type !== 'background'
    );
    if (typeof items === "object") {
      if (from === "use" && data?.scope !== "global") {
        if (participants?.recipients && participants.recipients.length > 0) {
          console.log(filteredItems);
          if (filteredItems && filteredItems.length === 0) {
            setSnackbarMsg("Add fillable fields to assign to recipients");
            setSnackbarOpen(true);
            return false;
          } else if (filteredItems && filteredItems.length > 0) {
            let isItemWithoutSignee = false;
            for (const item of filteredItems) {
              console.log(items);
              if (!item?.signee?.email) {
                isItemWithoutSignee = true;
                break;
              }
            }
            if (isItemWithoutSignee) {
              setSnackbarMsg("Assign recipient to respective fillable fields");
              setSnackbarOpen(true);
              return false;
            } else {
              for (const recipient of participants.recipients) {
                // console.log(recipient);
                if (
                  !filteredItems.some(
                    (ele) => ele?.signee?.email === recipient?.email
                  ) &&
                  recipient?.signerRole === "Signer"
                ) {
                  setSnackbarMsg(
                    "Assign atleast one fillable fields to all respective recipients"
                  );
                  setSnackbarOpen(true);
                  return false;
                }
              }
              return true;
            }
          }
        } else {
          if (filteredItems && filteredItems.length > 0) {
            setSnackbarMsg("Add recipients to assign to the fillable fields");
            setSnackbarOpen(true);
            return false;
          }
          setSnackbarMsg("Add recipients to prepare for signing");
          setSnackbarOpen(true);
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const isVariableValid = (from) => {
    let isVarWithoutValueUsed = false;
    if (from === "use" && variables.length > 0) {
      const variablesWithoutValue = new Set();
      variables.map((ele) => {
        if (!ele.value) {
          variablesWithoutValue.add(ele.name);
        }
      });
      for (const page of pages) {
        if (!page?.ref?.current) {
          throw Error(`Page: ${page} has no ref`);
        }
        console.log(page?.ref?.current);
        page?.ref?.current?.update(() => {
          const variableNodes = $nodesOfType(MentionNode);
          console.log(variablesWithoutValue);
          for (const variableNode of variableNodes) {
            console.log(variablesWithoutValue.has(variableNode.__varName));
            if (variablesWithoutValue.has(variableNode.__varName)) {
              isVarWithoutValueUsed = true;
              // debugger;
              break;
            }
          }
        });
      }
      for (const item of items) {
        if (
          (item?.type === "textArea" || item?.type === "table") &&
          item?.ref
        ) {
          item?.ref?.update(() => {
            const variableNodes = $nodesOfType(MentionNode);
            console.log(variablesWithoutValue);
            for (const variableNode of variableNodes) {
              console.log(variablesWithoutValue.has(variableNode.__varName));
              if (variablesWithoutValue.has(variableNode.__varName)) {
                isVarWithoutValueUsed = true;
                // debugger;
                break;
              }
            }
          });
        }
      }
      if (isVarWithoutValueUsed) {
        setSnackbarMsg("Assign value to all the variables in use");
        setSnackbarOpen(true);
      }
      return !isVarWithoutValueUsed;
    }
    return true;
  };

  const isValidated = (from) => {
    // console.log(from)
    // console.log()
    // console.log(participants);
    // console.log(items);
    if (data?.scope === "global") {
      return true;
    }
    console.log(isVariableValid(from));
    if (isItemsValid(from) && isVariableValid(from)) {
      return true;
    }
    // setSnackbarMsg('Assign recipients to respective fields and assign value to all variables');
    // setSnackbarOpen(true);
    return false;
  };

  const onCreateHandler = async (from) => {
    // // console.log(isValidated(from))
    let editorState = [];
    let pagesBackgrounds = [];
    console.log(items);
    // let pageSetup = pageSetupStore;

    try {
      setIsLoading(true);
      if (isActiveUpload && docDetails) {
        editorState = null;
      } else {
        // pageSetup = JSON.stringify(pageSetup);
        for (const page of pages) {
          if (!page?.ref || !page?.ref?.current) {
            throw Error(`ref not found ${page}`);
          }
          console.log(pageHeader, pageFooter);
          pagesBackgrounds.push({
            pageNo: page?.pageNo,
            pageBgColor: page?.bgColor ? page?.bgColor : "#FFFFFF",
          });
          const state = page?.ref?.current?.getEditorState();
          if (state.isEmpty() || state?.root?.children?.length === 0) {
            // console.log(state)
            editorState.push({
              pageBg: page?.bgColor ? page?.bgColor : "#FFFFFF",
              editorState: null,
              editorHeader:
                headerActive && pageHeader
                  ? pageHeader?.editorState?.toJSON()
                  : null,
              editorFooter:
                footerActive && pageFooter
                  ? pageFooter?.editorState?.toJSON()
                  : null,
            });
          } else {
            // console.log(state)
            console.log(headerActive, pageHeader , !pageHeader?.editorState?.isEmpty())
            editorState.push({
              pageBg: page?.bgColor ? page?.bgColor : "#FFFFFF",
              editorState: page?.ref?.current?.getEditorState().toJSON(),
              editorHeader:
                headerActive && pageHeader && !pageHeader?.editorState?.isEmpty()
                  ? pageHeader?.editorState?.toJSON()
                  : null,
              editorFooter:
                footerActive && pageFooter && !pageFooter?.editorState?.isEmpty()
                  ? pageFooter?.editorState?.toJSON()
                  : null,
            });
          }
        }
      }

      console.log(editorState);

      // console.log(pageColor)
      const updateData = {
        id: router.query.id,
        editorState: editorState,
        pageSetup: pageSetup,
        items: items.map((ele) => {
          if (ele?.type === "textArea" || ele?.type === "table") {
            console.log(ele);
            if (ele?.ref) {
              let state = ele?.ref?.getEditorState();
              if (state.isEmpty()) {
                state = null;
              } else {
                if (ele?.from) {
                  state = JSON.stringify(state.toJSON());
                } else {
                  state = state.toJSON();
                }
              }
              return {
                ...ele,
                editorState: state,
              };
            } else {
              return ele;
            }
          }
          return ele;
        }),
        pagesBackgrounds: pagesBackgrounds,
        settings:docDetails.settings,
        showPageNo:showPageNo
      };
      if (name) {
        updateData.name = name;
      }
      console.log(editorState);
      const res = await createPDF(updateData);
      // console.log(res);
      setServerData(res);
      setIsLoading(false);
      // setIsDownloadLoading(false)
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      // setIsDownloadLoading(false)
    }
  };
  const handleTemplateUse = async () => {
    // console.log('in use');
    await onCreateHandler("use");
    try {
      // onCreateHandler('use');
      console.log(items);
      const updateItems = [];
      for (const ele of items) {
        const refernceHeight = !ele?.from
          ? activeHeaderFooterPageHeight
          : "128px";
        const position = updateBorderFromPosition(
          true,
          { width: pageSetup?.size.width, height: refernceHeight },
          {
            x: ele?.left
              ? ele?.left
              : ele?.position?.x
              ? ele?.position.x
              : "10%",
            y: ele?.top ? ele?.top : ele?.position?.y ? ele?.position.y : "10%",
          },
          { x: 3, y: pageSetup?.orientation === "landscape" ? 3 : 3 }
        );
        let updatedPosEle = {
          ...ele,
          position: position,
          left: position.x,
          top: position.y,
        };
        console.log("updated ele", updatedPosEle);
        console.log("prev ele", ele);
        if (ele?.type === "textArea" || ele?.type === "table") {
          let state = ele?.ref?.getEditorState();
          if (state.isEmpty()) {
            state = null;
          } else {
            if (ele?.from) {
              state = JSON.stringify(state.toJSON());
            } else {
              state = state.toJSON();
            }
          }
          updatedPosEle = {
            ...updatedPosEle,
            editorState: state,
          };
        }
        console.log(updatedPosEle);
        if (ele?.type === "inEditorImage" && ele?.file) {
          updatedPosEle = await convertImageFromFileToLink(updatedPosEle, {
            width: getPageWidth(pageSetup),
            height: getPageHeight(pageSetup),
          });
        }
        console.log(updatedPosEle);
        updateItems.push(updatedPosEle);
      }
      if (isValidated("use")) {
        let editorState = [];
        let participantsType = "only-me";
        setIsPreparing(true);
        console.log(isContactSave);
        if (isActiveUpload && docDetails) {
          let signees =
            participants &&
            participants.recipients &&
            participants.recipients.length > 0
              ? participants.recipients.map((ele) => {
                  return {
                    signersEmail: ele.email,
                    signerRole: ele.signerRole,
                    signingMethod: ele.signingMethod,
                    fullname: ele.fullname,
                  };
                })
              : null;
          const updatedItems = [];
          for (const item of items) {
            let newItem = item;
            if (item?.type === "shape") {
              newItem = await getShapeItemPreparedForPDFUpload(item);
            }
            updatedItems.push(newItem);
          }
          // console.log()
          // console.log(docDetails?.documents?.documents[0])
          const res = await prepareDocument(
            docDetails?.documents?.documents[0],
            updatedItems,
            docDetails?.documents?._id,
            accessToken,
            JSON.stringify(signees),
            "email",
            JSON.stringify(docDetails?.emailTemplate),
            JSON.stringify(docDetails?.settings)
          );
          if (res) {
            // console.log(res)
            // console.log(res)
            router.push(`/document/preview?id=${res?._id}`);
            setIsLoading(false);
          }
          setIsPreparing(false);
        } else {
          for (let i = 0; i < pages.length; i++) {
            if (!pages[i]?.ref || !pages[i]?.ref?.current) {
              throw Error(`ref not found ${pages[i]}`);
            }
            // let html=null;
            // // console.log(page?.ref?.current instanceof LexicalEditor)
            pages[i]?.ref?.current?.update((editor) => {
              // console.log("call back",editor)
              let html = $generateHtmlFromNodes(pages[i]?.ref?.current, null);
              let pageHeaderHtml = pageHeader?.html ? pageHeader?.html : "";
              let pageFooterHtml = pageFooter?.html ? pageFooter?.html : "";
              html = html.replace(/(&quot\;)/g, "");
              console.log(html);
              const textareas = updateItems.filter(
                (ele) => ele?.pageIndex === i && !ele?.from
              );
              const textAreasHeaderFooter = updateItems.filter(
                (ele) => ele?.from
              );
              const shapes = items.filter(
                (ele) => ele?.pageIndex === i && ele.type === "shape"
              );
              const images = items.filter(
                (ele) => ele?.pageIndex === i && ele.type === "inEditorImage"
              );
              const imagesHeaderFooter = updateItems.filter(
                (ele) => ele?.from && ele?.type === "inEditorImage"
              );

              for (let i = 0; i < updateItems.length; i++) {
                const updateItem = updateItems[i];
                if (updateItem.type === 'shape') {
                    const correspondingItem = items.find(item => item.id === updateItem.id);
                    if (correspondingItem) {
                        updateItems[i] = correspondingItem;
                    }
                }
            }

              const pageItems = updateItems.filter((ele) => ele?.pageIndex === i);

              pageItems.map((ele, index) => {
                const refernceHeight = !ele?.from
                  ? activeHeaderFooterPageHeight
                  : "128px";
                const position = updateBorderFromPosition(
                  true,
                  { width: pageSetup?.size.width, height: refernceHeight },
                  {
                    x: ele?.left
                      ? ele?.left
                      : ele?.position?.x
                      ? ele?.position.x
                      : "10%",
                    y: ele?.top
                      ? ele?.top
                      : ele?.position?.y
                      ? ele?.position.y
                      : "10%",
                  },
                  { x: 3, y: pageSetup?.orientation === "landscape" ? 3 : 1 }
                );
                let updatedPosEle = {
                  ...ele,
                  position: position,
                  left: position.x,
                  top: position.y,
                };

                if (ele?.type === "textArea" || ele?.type === "table") {
                  let state = ele?.ref?.getEditorState();
                  if (state.isEmpty()) {
                    state = null;
                  } else {
                    if (ele?.from) {
                      state = JSON.stringify(state.toJSON());
                    } else {
                      state = state.toJSON();
                    }
                  }
                  updatedPosEle = {
                    ...updatedPosEle,
                    editorState: state,
                  };
                }
                if (ele?.type == "textArea" || ele?.type === "table")
                  ele = updatedPosEle;

                if (!ele?.from) {
                  if (ele?.ref) {
                    ele?.ref?.update((editor) => {
                      const textHtml = $generateHtmlFromNodes(ele?.ref, null);
                      html =
                        html +
                        `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                    });
                  }
                }

                if (ele?.type === "inEditorImage") {
                  const position = updateBorderFromPosition(
                    true,
                    {
                      width: pageSetup?.size.width,
                      height: activeHeaderFooterPageHeight,
                    },
                    {
                      x: ele?.left
                        ? ele?.left
                        : ele?.position?.x
                        ? ele?.position.x
                        : "10%",
                      y: ele?.top
                        ? ele?.top
                        : ele?.position?.y
                        ? ele?.position.y
                        : "10%",
                    },
                    {
                      x: pageSetup?.orientation === "landscape" ? 2 : 3,
                      y: pageSetup?.orientation === "landscape" ? 4 : 4,
                    }
                  );
                  ele = {
                    ...ele,
                    position: position,
                    left: position.x,
                    top: position.y,
                  };

                  const topOffset = 0;
                  const leftOffset = 0;
                  let top =
                    ele?.position.y && Number(ele?.position.y.split("%")[0]);
                  let left =
                    ele?.position.x && Number(ele?.position.x.split("%")[0]);
                  console.log(top, left);
                  if (top > 50) {
                    top = `${top - topOffset}%`;
                  } else {
                    top = `${top + topOffset}%`;
                  }
                  if (left > 50) {
                    left = `${left - leftOffset}%`;
                  } else {
                    left = `${left + leftOffset}%`;
                  }

                  if (ele.link) {
                    html =
                      html +
                      `<img src="${ele.link}" alt="${ele.name}" style="width:${
                        ele.size.width
                      }px; height:${
                        ele.size.height
                      }px;position:absolute;top:${top};left:${left};z-index:${
                        ele.layer || 0
                      };"/>`;
                  }
                }

                if (ele?.type === "shape") {
                  const position = updateBorderFromPosition(
                    true,
                    {
                      width: pageSetup?.size.width,
                      height: activeHeaderFooterPageHeight,
                    },
                    {
                      x: ele?.left
                        ? ele?.left
                        : ele?.position?.x
                        ? ele?.position.x
                        : "10%",
                      y: ele?.top
                        ? ele?.top
                        : ele?.position?.y
                        ? ele?.position.y
                        : "10%",
                    },
                    {
                      x: pageSetup?.orientation === "landscape" ? 2 : 3,
                      y: pageSetup?.orientation === "landscape" ? 4 : 4,
                    }
                  );
                  ele = {
                    ...ele,
                    position: position,
                    left: position.x,
                    top: position.y,
                  };
                  const topOffset = 0;
                  const leftOffset = 0;
                  let top =
                    ele?.position.y && Number(ele?.position.y.split("%")[0]);
                  let left =
                    ele?.position.x && Number(ele?.position.x.split("%")[0]);
                  console.log(top, left);
                  if (top > 50) {
                    top = `${top - topOffset}%`;
                  } else {
                    top = `${top + topOffset}%`;
                  }
                  if (left > 50) {
                    left = `${left - leftOffset}%`;
                  } else {
                    left = `${left + leftOffset}%`;
                  }

                  if (ele.svg) {
                    html =
                      html +
                      `<div style="position:absolute;top:${top};left:${left};z-index:${
                        ele?.layer || 0
                      };overflow:hidden;">
                    <div
                      style="transform: scale(0.7) rotate(${
                        ele?.options?.rotation || 0
                      }deg)"
                    >
                      ${ele.svg}
                    </div>
                  </div>`;
                  }
                }
              });

              // textareas.map((ele, index) => {
              //   if (ele?.ref) {
              //     ele?.ref?.update((editor) => {
              //       const textHtml = $generateHtmlFromNodes(ele?.ref, null);
              //       html =
              //         html +
              //         `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x};  width:${ele?.size?.width}px;overflow:hidden;">${textHtml}</div>`;
              //     });
              //   }
              // });
              textAreasHeaderFooter.map((ele) => {
                if (ele?.ref) {
                  ele?.ref?.update(() => {
                    const textHtml = $generateHtmlFromNodes(ele?.ref, null);
                    console.log(ele?.from === "EditorHeader");
                    if (ele?.from === "EditorHeader") {
                      console.log(pageHeaderHtml, textHtml);
                      pageHeaderHtml += `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                    } else {
                      pageFooterHtml += `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                    }
                  });
                }
              });
              // for (let i = 0; i < shapes.length; i++) {
              //   const position = updateBorderFromPosition(
              //     true,
              //     {
              //       width: pageSetup?.size.width,
              //       height: activeHeaderFooterPageHeight,
              //     },
              //     {
              //       x: shapes[i]?.left
              //         ? shapes[i]?.left
              //         : shapes[i]?.position?.x
              //         ? shapes[i]?.position.x
              //         : "10%",
              //       y: shapes[i]?.top
              //         ? shapes[i]?.top
              //         : shapes[i]?.position?.y
              //         ? shapes[i]?.position.y
              //         : "10%",
              //     },
              //     {
              //       x: pageSetup?.orientation === "landscape" ? 2 : 3,
              //       y: pageSetup?.orientation === "landscape" ? 4 : 4,
              //     }
              //   );
              //   shapes[i] = {
              //     ...shapes[i],
              //     position: position,
              //     left: position.x,
              //     top: position.y,
              //   };
              // }
              // shapes.forEach((shape) => {
              //   // const topOffset = 20 * 100 / 1080
              //   // const leftOffset = 25 * 100 /768
              //   const topOffset = 0;
              //   const leftOffset = 0;
              //   let top =
              //     shape?.position.y && Number(shape?.position.y.split("%")[0]);
              //   let left =
              //     shape?.position.x && Number(shape?.position.x.split("%")[0]);
              //   // console.log(top,left)
              //   if (top > 50) {
              //     top = `${top - topOffset}%`;
              //   } else {
              //     top = `${top + topOffset}%`;
              //   }
              //   if (left > 50) {
              //     left = `${left - leftOffset}%`;
              //   } else {
              //     left = `${left + leftOffset}%`;
              //   }
              //   // console.log(shape?.options?.rotation)

              //   if (shape.svg) {
              //     html =
              //       html +
              //       `<div style="position:absolute;top:${top};left:${left};z-index:${
              //         shape?.layer || 0
              //       };overflow:hidden;">
              //           <div
              //             style="transform: scale(0.7) rotate(${
              //               shape?.options?.rotation || 0
              //             }deg)"
              //           >
              //             ${shape.svg}
              //           </div>
              //         </div>`;
              //   }
              //   // items.splice(items.find)
              // });
              imagesHeaderFooter.forEach((ele) => {
                const topOffset = 0;
                const leftOffset = 0;
                let top = ele?.position.y && Number(ele?.position.y.split("%")[0]);
                let left = ele?.position.x && Number(ele?.position.x.split("%")[0]);
                console.log(top, left);
                if (top > 50) {
                  top = `${top - topOffset}%`;
                } else {
                  top = `${top + topOffset}%`;
                }
                if (left > 50) {
                  left = `${left - leftOffset}%`;
                } else {
                  left = `${left + leftOffset}%`;
                }
    
                if (ele.link) {
                  if (ele?.from === "EditorHeader") {
                    pageHeaderHtml =
                      pageHeaderHtml +
                      `<img src="${ele.link}" alt="${ele.name}" style="width:${
                        ele.size.width
                      }px; height:${
                        ele.size.height
                      }px;position:absolute;top:${top};left:${left};z-index:${
                        ele.layer || 0
                      };"/>`;
                  } else {
                    pageFooterHtml =
                      pageFooterHtml +
                      `<img src="${ele.link}" alt="${ele.name}" style="width:${
                        ele.size.width
                      }px; height:${
                        ele.size.height
                      }px;position:absolute;top:${top};left:${left};z-index:${
                        ele.layer || 0
                      };"/>`;
                  }
                }
              });
              let newHtml = `&nbsp`;
              if (
                html ===
                  `<p class="PlaygroundEditorTheme__paragraph"><br></p>` ||
                !html
              ) {
                html = "&nbsp;";
              }

              // if (html) {
              editorState.push({
                pageBg: pages[i]?.bgColor ? pages[i]?.bgColor : "#FFFFFF",
                content: `<body style="background-color:${
                  pages[i]?.bgColor
                }; margin:0; font-weight:400; line-height:1.7; font-size:16px;">
                  ${
                    headerActive
                      ? `<div style="overflow:hidden;height:128px;padding:${headerPadding};width:${getPageWidth(
                          pageSetup
                        )};position:relative;">
                    ${pageHeaderHtml}
                    </div>`
                      : ""
                  }
                    <div class="ContentEditable__root" style="width:${getPageWidth(
                      pageSetup
                    )}; height:${activeHeaderFooterPageHeight};  overflow:hidden;">
                    ${!html ? newHtml : html}
                    </div>
                    ${
                      footerActive
                        ? ` <footer style="height:128px;bottom:0px;overflow:hidden;padding:${footerPadding};width:${getPageWidth(
                            pageSetup
                          )};position:relative;">
                      ${pageFooterHtml}
                      </footer>`
                        : ""
                    }
                      ${
                        showPageNo
                          ? `<div style="position:absolute;bottom:5px;left:50%;">
                        ${i + 1}
                        </div>`
                          : ""
                      }
                    </body>`,
                // content: `<body style="padding:35px 50px 50px 50px;background-color:${pages[i]?.bgColor}">${!html?'':html}</body>`,
                editorState: pages[i]?.ref?.current?.getEditorState().toJSON(),
                editorHeader:
                  headerActive && pageHeader
                    ? pageHeader?.editorState?.toJSON()
                    : null,
                editorFooter:
                  footerActive && pageFooter
                    ? pageFooter?.editorState?.toJSON()
                    : null,
              });
              // }
            });
          }
          const itemsWithHeaderFooter = [];
          updateItems.forEach((ele) => {
            if (!ele?.from) {
              const updatedPosY = updateItemYPos(
                headerActive,
                ele?.position?.y,
                activeHeaderFooterPageHeight,
                getPageHeight(pageSetup),
                "128px"
              );
              itemsWithHeaderFooter.push({
                ...ele,
                top: updatedPosY,
                position: {
                  x: ele?.size?.x,
                  y: updatedPosY,
                },
              });
            } else {
              if (headerActive && ele?.from === "EditorHeader") {
                const updatedPosY = updateHeaderFooterItemYPosition(
                  true,
                  ele?.position.y,
                  "128px",
                  getPageHeight(pageSetup),
                  activeHeaderFooterPageHeight
                );
                itemsWithHeaderFooter.push({
                  ...ele,
                  top: updatedPosY,
                  position: {
                    x: ele?.size?.x,
                    y: updatedPosY,
                  },
                });
              }
              if (footerActive && ele?.from === "EditorFooter") {
                const updatedPosY = updateHeaderFooterItemYPosition(
                  false,
                  ele?.position.y,
                  "128px",
                  getPageHeight(pageSetup),
                  activeHeaderFooterPageHeight,
                  headerActive ? "128px" : "0px"
                );
                itemsWithHeaderFooter.push({
                  ...ele,
                  top: updatedPosY,
                  position: {
                    x: ele?.size?.x,
                    y: updatedPosY,
                  },
                });
              }
            }
          });
          const itemsWithoutBackground = itemsWithHeaderFooter.filter(
            (item) => item.type !== "background"
          );
          const body = {
            id: router.query.id,
            editorState: editorState,
            pageSetup: JSON.stringify(pageSetup),
            items: itemsWithoutBackground,
            showPageNo:showPageNo,
            signMethod: "email",
            settings: docDetails.settings || {
              "autoReminder": false,
              "expires": "1d",
              "isRenewed": "0"
          },
            participants: participantsType,
            signees:
              participants &&
              participants.recipients &&
              participants.recipients.length > 0
                ? participants.recipients.map((ele) => {
                    return {
                      signersEmail: ele.email,
                      signerRole: ele.signerRole,
                      signingMethod: ele.signingMethod,
                      fullname: ele.fullname,
                    };
                  })
                : null,
          };
          if (
            approverSelection &&
            data?.approverStatus !== "sent" &&
            data?.approverStatus !== "approved"
          ) {
            body.approverSequence = approverSequence;
            body.isApprover = true;
          }
          if (stampFile) {
            body.stampFile = stampFile;
          }
          const response = await templateUse(body);
          if (response?.data?._id) {
            if (response?.data?.approverStatus === "sent") {
              router.push(`/template/new?id=${response?.data?._id}`);
            } else {
              // router.push(`/document/new?id=${response?.data?._id}`);
              if(response?.data?.scope !== 'global'){
                console.log(docDetails);
                const res = await sendTemplate(
                  response?.data,
                  docDetails?.emailTemplate,
                  docDetails.settings || {
                    "autoReminder": false,
                    "expires": "1d",
                    "isRenewed": "0"
                },
                  isSigningOrder,
                  docDetails.clientFile
                );
                // console.log(res);
                if (res) {
                  router.push(`/document/preview?id=${response?.data?._id}`);
                } else {
                  setIsPreparing(false);
                }
              } else{
                router.push(`/template/new?id=${response?.data?._id}`);
              }
            }
          } else {
            for (const page of pages) {
              if (!page?.ref || !page?.ref?.current) {
                throw Error(`ref not found ${page}`);
              }
              let html = null;
              // // console.log(page?.ref?.current instanceof LexicalEditor)
              page?.ref?.current?.update((editor) => {
                // console.log("call back",editor)
                html = $generateHtmlFromNodes(page?.ref?.current, null);
                // console.log(html);
                if (html) {
                  editorState.push({
                    content: html,
                    editorState: page?.ref?.current?.getEditorState().toJSON(),
                  });
                }
              });
            }
            if (
              participants.recipients &&
              participants.recipients.length > 0 &&
              details
            ) {
              if (
                participants.recipients.some(
                  (ele) => ele.email === details?.data?.email
                )
              ) {
                if (participants.recipients.length === 1) {
                  participantsType = "only-me";
                } else {
                  participantsType = "me-others";
                }
              } else {
                participantsType = "others";
              }
            }

            setIsPreparing(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
      setIsPreparing(false);
    }
  };

  const getYOffset = () => {
    return pageSetup?.orientation === "landscape"
      ? headerActive
        ? 4 + 2
        : 4
      : headerActive
      ? 1 + 2 + 20
      : 1;
  };

  const downloadPDFFromServer = async () => {
    try {
      // onCreateHandler('use');
      console.log(items);
      let editorState = [];
      const updateItems = [];
      for (const ele of items) {
        // if (ele?.from === "EditorHeader") {
        //   const newPosY = updateHeaderFooterItemYPosition(true, position.y,'128px', getPageHeight(pageSetup), activeHeaderFooterPageHeight);
        //   updatedPosEle = {
        //     ...updatedPosEle,
        //     position: { x: position.x, y: newPosY },
        //     left: position.x,
        //     top: newPosY
        //   }
        // }
        const refernceHeight = !ele?.from
          ? activeHeaderFooterPageHeight
          : "128px";
        const position = updateBorderFromPosition(
          true,
          { width: pageSetup?.size.width, height: refernceHeight },
          {
            x: ele?.left
              ? ele?.left
              : ele?.position?.x
              ? ele?.position.x
              : "10%",
            y: ele?.top ? ele?.top : ele?.position?.y ? ele?.position.y : "10%",
          },
          { x: 3, y:3 }
        );
        let updatedPosEle = {
          ...ele,
          position: position,
          left: position.x,
          top: position.y,
        };

        if (ele?.type === "textArea" || ele?.type === "table") {
          let state = ele?.ref?.getEditorState();
          if (state.isEmpty()) {
            state = null;
          } else {
            if (ele?.from) {
              state = JSON.stringify(state.toJSON());
            } else {
              state = state.toJSON();
            }

            console.log(updatedPosEle);
            if(ele?.type === 'inEditorImage' && ele?.file){
              updatedPosEle =  await convertImageFromFileToLink(updatedPosEle,{
                width:getPageWidth(pageSetup),
                height:getPageHeight(pageSetup)
              });
            }
            console.log(updatedPosEle);
            updateItems.push(updatedPosEle);

          }
          updatedPosEle = {
            ...updatedPosEle,
            editorState: state,
          };
        }
        console.log(updatedPosEle);
        if(ele?.type === 'inEditorImage' && ele?.file){
          updatedPosEle =  await convertImageFromFileToLink(updatedPosEle,{
            width:getPageWidth(pageSetup),
            height:getPageHeight(pageSetup)
          });
        }
        console.log(updatedPosEle);
        updateItems.push(updatedPosEle);
      }
      for (let i = 0; i < pages.length; i++) {
        if (!pages[i]?.ref || !pages[i]?.ref?.current) {
          throw Error(`ref not found ${pages[i]},${i}`);
        }

        // let html=null;
        // // console.log(page?.ref?.current instanceof LexicalEditor)
        pages[i]?.ref?.current?.update((editor) => {
          // console.log("call back",editor)
          let html = $generateHtmlFromNodes(pages[i]?.ref?.current, null);
          let pageHeaderHtml = pageHeader?.html ? pageHeader?.html : "";
          let pageFooterHtml = pageFooter?.html ? pageFooter?.html : "";
          html = html.replace(/(&quot\;)/g, "");
          console.log(html);
          const textareas = updateItems.filter(
            (ele) => ele?.pageIndex === i && !ele?.from
          );
          const textAreasHeaderFooter = updateItems.filter((ele) => ele?.from);

          const shapes = items.filter((ele) => (ele?.pageIndex === i) && (ele.type === "shape"));
          const shapesHeaderFooter = items.filter((ele)=> (ele?.from)&& (ele?.type === 'shape'));
          const images = items.filter((ele) => (ele?.pageIndex === i) && (ele.type === "inEditorImage"));
          const imagesHeaderFooter = updateItems.filter((ele) => (ele?.from)&& (ele?.type === 'inEditorImage'));

          for (let i = 0; i < updateItems.length; i++) {
            const updateItem = updateItems[i];
            if (updateItem.type === 'shape') {
                const correspondingItem = items.find(item => item.id === updateItem.id);
                if (correspondingItem) {
                    updateItems[i] = correspondingItem;
                }
            }
        }

          const pageItems= updateItems.filter((ele)=>(ele?.pageIndex === i))
          console.log(items)
          console.log(updateItems)

          pageItems.map((ele,index)=>{

            const refernceHeight = !ele?.from ? activeHeaderFooterPageHeight : '128px';
              const position = updateBorderFromPosition(true,{width:pageSetup?.size.width,height:refernceHeight},{
                x:ele?.left ? ele?.left : ele?.position?.x ? ele?.position.x :'10%',
                y:ele?.top ? ele?.top : ele?.position?.y ? ele?.position.y :'10%'
              },{x:3,y:pageSetup?.orientation === 'landscape' ? 3 : 1});
              let updatedPosEle = {
                ...ele,
                position:position,
                left:position.x,
                top:position.y
              }


            if (ele?.type === "textArea" || ele?.type === "table") {
              let state = ele?.ref?.getEditorState();
              if (state.isEmpty()) {
                state = null;
              } else {
                if (ele?.from) {
                  state = JSON.stringify(state.toJSON());
                } else {
                  state = state.toJSON();
                }
              }
              if(ele?.type === 'textArea'){
                const position = updateBorderFromPosition(
                  true,
                  {
                    width: pageSetup?.size.width,
                    height: activeHeaderFooterPageHeight,
                  },
                  {
                    x: ele?.left
                      ? ele?.left
                      : ele?.position?.x
                      ? ele?.position.x
                      : "10%",
                    y: ele?.top
                      ? ele?.top
                      : ele?.position?.y
                      ? ele?.position.y
                      : "10%",
                  },
                  {
                    x: pageSetup?.orientation === "landscape" ? 2 : 0,
                    y: pageSetup?.orientation === "landscape" ? 4 : 0,
                  }
                );
                updatedPosEle = {
                  ...updatedPosEle,
                  left:position.x,
                  top:position.y,
                  position:position
                }
              }

              updatedPosEle = {
                ...updatedPosEle,
                editorState: state,
              };
            }
            if (ele?.type == "textArea" || ele?.type === "table")
              ele = updatedPosEle;

            if (!ele?.from) {
              if (ele?.ref) {
                ele?.ref?.update((editor) => {
                  const textHtml = $generateHtmlFromNodes(ele?.ref, null);
                  html =
                    html +
                    `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                });
              }
            }

            if (ele?.type === "inEditorImage") {
              const position = updateBorderFromPosition(
                true,
                {
                  width: pageSetup?.size.width,
                  height: activeHeaderFooterPageHeight,
                },
                {
                  x: ele?.left
                    ? ele?.left
                    : ele?.position?.x
                    ? ele?.position.x
                    : "10%",
                  y: ele?.top
                    ? ele?.top
                    : ele?.position?.y
                    ? ele?.position.y
                    : "10%",
                },
                {
                  x: pageSetup?.orientation === "landscape" ? 2 : 0,
                  y: pageSetup?.orientation === "landscape" ? 4 : 0,
                }
              );
              ele = {
                ...ele,
                position: position,
                left: position.x,
                top: position.y,
              };

              const topOffset = 0;
              const leftOffset = 0;
              let top =
                ele?.position.y && Number(ele?.position.y.split("%")[0]);
              let left =
                ele?.position.x && Number(ele?.position.x.split("%")[0]);
              console.log(top, left);
              if (top > 50) {
                top = `${top - topOffset}%`;
              } else {
                top = `${top + topOffset}%`;
              }
              if (left > 50) {
                left = `${left - leftOffset}%`;
              } else {
                left = `${left + leftOffset}%`;
              }

              if (ele.link) {
                html =
                  html +
                  `<img src="${ele.link}" alt="${ele.name}" style="width:${
                    ele.size.width
                  }px; height:${
                    ele.size.height
                  }px;position:absolute;top:${top};left:${left};z-index:${
                    ele.layer || 0
                  };"/>`;
              }
            }

            if (ele?.type === "shape") {
              const position = updateBorderFromPosition(
                true,
                {
                  width: pageSetup?.size.width,
                  height: activeHeaderFooterPageHeight,
                },
                {
                  x: ele?.left
                    ? ele?.left
                    : ele?.position?.x
                    ? ele?.position.x
                    : "10%",
                  y: ele?.top
                    ? ele?.top
                    : ele?.position?.y
                    ? ele?.position.y
                    : "10%",
                },
                {
                  x: pageSetup?.orientation === "landscape" ? 2 : 3,
                  y: pageSetup?.orientation === "landscape" ? 4 : 4,
                }
              );
              ele = {
                ...ele,
                position: position,
                left: position.x,
                top: position.y,
              };
              const topOffset = 0;
              const leftOffset = 0;
              let top =
                ele?.position.y && Number(ele?.position.y.split("%")[0]);
              let left =
                ele?.position.x && Number(ele?.position.x.split("%")[0]);
              console.log(top, left);
              if (top > 50) {
                top = `${top - topOffset}%`;
              } else {
                top = `${top + topOffset}%`;
              }
              if (left > 50) {
                left = `${left - leftOffset}%`;
              } else {
                left = `${left + leftOffset}%`;
              }

              if (ele.svg) {
                html =
                  html +
                  `<div style="position:absolute;top:${top};left:${left};z-index:${
                    ele?.layer || 0
                  };overflow:hidden;">
                    <div
                      style="transform: scale(0.7) rotate(${
                        ele?.options?.rotation || 0
                      }deg)"
                    >
                      ${ele.svg}
                    </div>
                  </div>`;
              }
            }
          });

          // textareas.map((ele, index) => {
          //   if (ele?.ref) {
          //     ele?.ref?.update((editor) => {
          //       const textHtml = $generateHtmlFromNodes(ele?.ref, null);
          //       html = html +
          //         `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`
          //     })
          //   }
          // });
          textAreasHeaderFooter.map((ele) => {
            if (ele?.ref) {
              ele?.ref?.update(() => {
                const textHtml = $generateHtmlFromNodes(ele?.ref, null);
                console.log(ele?.from === "EditorHeader");
                if (ele?.from === "EditorHeader") {
                  console.log(pageHeaderHtml, textHtml);
                  pageHeaderHtml += `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                } else {
                  pageFooterHtml += `<div style="position:absolute; top:${ele?.position.y};left:${ele?.position.x}; width:${ele?.size?.width}px;overflow:hidden; z-index:${ele?.layer};">${textHtml}</div>`;
                }
              });
            }
          });
          // for(let i=0;i<images.length;i++){
          //   // const refernceHeight = !shapes[i]?.from ? activeHeaderFooterPageHeight : '128px';
          //   const position = updateBorderFromPosition(true,{width:pageSetup?.size.width,height:activeHeaderFooterPageHeight},{
          //     x:images[i]?.left ? images[i]?.left : images[i]?.position?.x ? images[i]?.position.x :'10%',
          //     y:images[i]?.top ? images[i]?.top : images[i]?.position?.y ? images[i]?.position.y :'10%'
          //   },{x:pageSetup?.orientation === 'landscape' ? 2:3,y:pageSetup?.orientation === 'landscape'?4:4});
          //   images[i] = {
          //     ...images[i],
          //     position:position,
          //     left:position.x,
          //     top:position.y
          //   }
          // }
          // images.forEach((ele) => {
          //   console.log("ele",ele)
          //   // const topOffset = 20 * 100 / 1080
          //   // const leftOffset = 25 * 100 /768
          //   const topOffset = 0
          //   const leftOffset = 0
          //   let top = ele?.position.y && Number(ele?.position.y.split("%")[0])
          //   let left = ele?.position.x && Number(ele?.position.x.split("%")[0])
          //   console.log(top,left)
          //   if (top > 50) {
          //     top = `${top - topOffset}%`
          //   } else {
          //     top = `${top + topOffset}%`
          //   }
          //   if (left > 50) {
          //     left = `${left - leftOffset}%`
          //   } else {
          //     left = `${left + leftOffset}%`
          //   }

          //   if (ele.link) {

          //     html =
          //       html +
          //       `<div style="position:absolute;top:${top};left:${left};z-index:${ele.layer||0};overflow:hidden;">
          //       <div
          //         style="transform: scale(0.7) rotate(${ele?.options?.rotation || 0}deg)"
          //       >
          //         <img src="${ele.link}" alt="${ele.name}" style="width:${ele.size.width}px; height:${ele.size.height}px;"/>
          //       </div>
          //     </div>`;

          //   }
          //   // items.splice(items.find)
          // });

          // for(let i=0;i<shapes.length;i++){
          //   // const refernceHeight = !shapes[i]?.from ? activeHeaderFooterPageHeight : '128px';
          //   const position = updateBorderFromPosition(true,{width:pageSetup?.size.width,height:activeHeaderFooterPageHeight},{
          //     x:shapes[i]?.left ? shapes[i]?.left : shapes[i]?.position?.x ? shapes[i]?.position.x :'10%',
          //     y:shapes[i]?.top ? shapes[i]?.top : shapes[i]?.position?.y ? shapes[i]?.position.y :'10%'
          //   },{x:pageSetup?.orientation === 'landscape' ? 2:3,y:pageSetup?.orientation === 'landscape'?4:4});
          //   shapes[i] = {
          //     ...shapes[i],
          //     position:position,
          //     left:position.x,
          //     top:position.y
          //   }
          // }
          // shapes.forEach((shape) => {
          //   // const topOffset = 20 * 100 / 1080
          //   // const leftOffset = 25 * 100 /768
          //   const topOffset = 0
          //   const leftOffset = 0
          //   let top = shape?.position.y && Number(shape?.position.y.split("%")[0])
          //   let left = shape?.position.x && Number(shape?.position.x.split("%")[0])
          //   console.log(top,left)
          //   if (top > 50) {
          //     top = `${top - topOffset}%`
          //   } else {
          //     top = `${top + topOffset}%`
          //   }
          //   if (left > 50) {
          //     left = `${left - leftOffset}%`
          //   } else {
          //     left = `${left + leftOffset}%`
          //   }

          //   if (shape.svg) {
          //     html =
          //       html +
          //       `<div style="position:absolute;top:${top};left:${left};z-index:${shape?.layer || 0};overflow:hidden;">
          //           <div
          //             style="transform: scale(0.7) rotate(${shape?.options?.rotation || 0}deg)"
          //           >
          //             ${shape.svg}
          //           </div>
          //         </div>`;

          //   }
          //   // items.splice(items.find)
          // });
          imagesHeaderFooter.forEach((ele) => {
            const topOffset = 0;
            const leftOffset = 0;
            let top = ele?.position.y && Number(ele?.position.y.split("%")[0]);
            let left = ele?.position.x && Number(ele?.position.x.split("%")[0]);
            console.log(top, left);
            if (top > 50) {
              top = `${top - topOffset}%`;
            } else {
              top = `${top + topOffset}%`;
            }
            if (left > 50) {
              left = `${left - leftOffset}%`;
            } else {
              left = `${left + leftOffset}%`;
            }

            if (ele.link) {
              if (ele?.from === "EditorHeader") {
                pageHeaderHtml =
                  pageHeaderHtml +
                  `<img src="${ele.link}" alt="${ele.name}" style="width:${
                    ele.size.width
                  }px; height:${
                    ele.size.height
                  }px;position:absolute;top:${top};left:${left};z-index:${
                    ele.layer || 0
                  };"/>`;
              } else {
                pageFooterHtml =
                  pageFooterHtml +
                  `<img src="${ele.link}" alt="${ele.name}" style="width:${
                    ele.size.width
                  }px; height:${
                    ele.size.height
                  }px;position:absolute;top:${top};left:${left};z-index:${
                    ele.layer || 0
                  };"/>`;
              }
            }
          });
          shapesHeaderFooter.forEach((shape) => {
            const topOffset = 0;
            const leftOffset = 0;
            let top =
              shape?.position.y && Number(shape?.position.y.split("%")[0]);
            let left =
              shape?.position.x && Number(shape?.position.x.split("%")[0]);
            console.log(top, left);
            if (top > 50) {
              top = `${top - topOffset}%`;
            } else {
              top = `${top + topOffset}%`;
            }
            if (left > 50) {
              left = `${left - leftOffset}%`;
            } else {
              left = `${left + leftOffset}%`;
            }

            if (shape.svg) {
              if (shape?.from === "EditorHeader") {
                pageHeaderHtml =
                  pageHeaderHtml +
                  `<div style="position:absolute;top:${top};left:${left};z-index:${
                    shape?.layer || 0
                  };overflow:hidden;">
                      <div
                        style="transform: scale(0.7) rotate(${
                          shape?.options?.rotation || 0
                        }deg)"
                      >
                        ${shape.svg}
                      </div>
                    </div>`;
              } else {
                pageFooterHtml =
                  pageFooterHtml +
                  `<div style="position:absolute;top:${top};left:${left};z-index:${
                    shape?.layer || 0
                  };overflow:hidden;">
                      <div
                        style="transform: scale(0.7) rotate(${
                          shape?.options?.rotation || 0
                        }deg)"
                      >
                        ${shape.svg}
                      </div>
                    </div>`;
              }
            }
          });

          console.log(html);
          let newHtml = `&nbsp`;
          if (
            html === `<p class="PlaygroundEditorTheme__paragraph"><br></p>` ||
            !html
          ) {
            html = "&nbsp;";
          }

          // if (html) {
          // padding:35px 100px 50px 50px;
          editorState.push({
            content: `<body style="background-color:${
              pages[i]?.bgColor
            }; margin:0; font-weight:400; line-height:1.7; font-size:16px;">
              ${
                headerActive
                  ? `<div style="overflow:hidden;height:128px;padding:${headerPadding};width:${getPageWidth(
                      pageSetup
                    )};position:relative;">
                ${pageHeaderHtml}
                </div>`
                  : ""
              }
                <div class="ContentEditable__root" style="width:${getPageWidth(
                  pageSetup
                )}; height:${activeHeaderFooterPageHeight};  overflow:hidden;">
                ${!html ? newHtml : html}
                </div>
                ${
                  footerActive
                    ? ` <footer style="height:128px;bottom:0px;overflow:hidden;padding:${footerPadding};width:${getPageWidth(
                        pageSetup
                      )};position:relative;">
                  ${pageFooterHtml}
                  </footer>`
                    : ""
                }
                  ${
                    showPageNo
                      ? `<div style="position:absolute;bottom:5px;left:50%;">
                    ${i + 1}
                    </div>`
                      : ""
                  }
                </body>`,
            editorState: pages[i]?.ref?.current?.getEditorState().toJSON(),
            editorHeader:
              headerActive && pageHeader
                ? pageHeader?.editorState?.toJSON()
                : null,
            editorFooter:
              footerActive && pageFooter
                ? pageFooter?.editorState?.toJSON()
                : null,
            pageBg: pages[i]?.bgColor,
          });
          // }
        });
      }
      const itemsWithHeaderFooter = [];

      updateItems.forEach((ele)=>{
        if(!ele?.from){
            const updatedPosY = updateItemYPos(headerActive,ele?.position?.y,activeHeaderFooterPageHeight,getPageHeight(pageSetup),'128px');
            itemsWithHeaderFooter.push({
              ...ele,
              top:updatedPosY,
              position:{
                x:ele?.size?.x,
                y:updatedPosY
              }
            });
        }
        else{
          if(headerActive && ele?.from === 'EditorHeader'){
            const updatedPosY = updateHeaderFooterItemYPosition(true, ele?.position.y,'128px', getPageHeight(pageSetup), activeHeaderFooterPageHeight);

            itemsWithHeaderFooter.push({
              ...ele,
              top: updatedPosY,
              position: {
                x: ele?.size?.x,
                y: updatedPosY,
              },
            });
          }
          if (footerActive && ele?.from === "EditorFooter") {
            const updatedPosY = updateHeaderFooterItemYPosition(
              false,
              ele?.position.y,
              "128px",
              getPageHeight(pageSetup),
              activeHeaderFooterPageHeight,
              headerActive ? "128px" : "0px"
            );
            itemsWithHeaderFooter.push({
              ...ele,
              top: updatedPosY,
              position: {
                x: ele?.size?.x,
                y: updatedPosY,
              },
            });
          }
        }
      });
      const itemsWithoutBackground = itemsWithHeaderFooter.filter(
        (item) => item.type !== "background"
      );

      const body = {
        id: router.query.id,
        editorState: editorState,
        items: itemsWithoutBackground,
        pageSetup: pageSetup,
      };

      // setIsDownloadLoading(true)
      const res = await downloadPDF(body);
      console.log(res);
      if (res) {
        setIsDownloadLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsDownloadLoading(false);
    }
  };

  const id = router.query.id;
  const latestValuesRef = useRef({ items: null, pages: null, id: null,pageSetup:null,name:null });
  console.log(pagesData);
  useEffect(() => {
    latestValuesRef.current = { items, pages, id ,pageSetup,name};
  }, [items, pages, id,pageSetup,name]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { items,pages,id,pageSetup,name } = latestValuesRef.current;
      // if (id) {
      //   let editorState = [];
      //   let pagesBackgrounds = []
      //   try {
      //     setIsLoading(true);
      //     for (const page of pages) {
      //       if (!page?.ref || !page?.ref?.current) {
      //         throw Error(`ref not found ${page}`);
      //       }
      //       pagesBackgrounds.push({ pageNo: page?.pageNo, pageBgColor: page?.bgColor? page?.bgColor:"#FFFFFF" })
      //       const state = page?.ref?.current?.getEditorState();
      //       // console.log(state.isEmpty());
      //       if (state.isEmpty() || state?.root?.children?.length === 0) {
      //         // console.log(state)
      //         editorState.push({
      //          pageBg:page?.bgColor?page?.bgColor:"#FFFFFF",
      //           editorState: null
      //         })
      //       } else {
      //         // console.log(state)

      //         editorState.push({
      //          pageBg:page?.bgColor?page?.bgColor:"#FFFFFF",
      //           editorState: page?.ref?.current?.getEditorState().toJSON()
      //         })
      //       }
      //     }
      //     const updateData = {
      //       id: router.query.id,
      //       editorState,
      //       pageSetup: JSON.stringify({ size: pageSize, orientation: pageOreintation }),
      //       items: items.map((ele) => {
      //         if (ele?.type === 'textArea') {
      //           if (ele?.ref) {
      //             let state = ele?.ref?.getEditorState();
      //             if (state.isEmpty()) {
      //               state = null;
      //             } else {
      //               state = state.toJSON();
      //             }
      //             return {
      //               ...ele,
      //               editorState: state
      //             }
      //           }
      //           else {
      //             return ele;
      //           }
      //         }
      //         return ele;
      //       }),
      //       pagesBackgrounds:pagesBackgrounds
      //     }
      //     if (name) {
      //       updateData.name = name;
      //     }
      //     const res = await createPDF(updateData);
      //     // console.log(res);
      //     setServerData(res);
      //     setIsLoading(false);
      //     setIsDownloadLoading(false)

      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
      console.log("in interval");
      let editorState = [];
      let pagesBackgrounds = [];
      console.log(items);
      // let pageSetup = pageSetupStore;

      try {
        setIsLoading(true);
        if (isActiveUpload && docDetails) {
          editorState = null;
        } else {
          // pageSetup = JSON.stringify(pageSetup);
          for (const page of pages) {
            if (!page?.ref || !page?.ref?.current) {
              throw Error(`ref not found ${page}`);
            }
            pagesBackgrounds.push({
              pageNo: page?.pageNo,
              pageBgColor: page?.bgColor ? page?.bgColor : "#FFFFFF",
            });
            const state = page?.ref?.current?.getEditorState();
            if (state.isEmpty() || state?.root?.children?.length === 0 || isEditorStateEmpty(state)) {
              // console.log(state)
              editorState.push({
                pageBg: page?.bgColor ? page?.bgColor : "#FFFFFF",
                editorState: null,
                editorHeader:
                  headerActive && pageHeader
                    ? pageHeader?.editorState?.toJSON()
                    : null,
                editorFooter:
                  footerActive && pageFooter
                    ? pageFooter?.editorState?.toJSON()
                    : null,
              });
            } else {
              // console.log(state)
              editorState.push({
                pageBg: page?.bgColor ? page?.bgColor : "#FFFFFF",
                editorState: page?.ref?.current?.getEditorState().toJSON(),
                editorHeader:
                  headerActive && pageHeader
                    ? pageHeader?.editorState?.toJSON()
                    : null,
                editorFooter:
                  footerActive && pageFooter
                    ? pageFooter?.editorState?.toJSON()
                    : null,
              });
            }
          }
        }

        // console.log(pageColor)
        const updateData = {
          id: router.query.id,
          editorState: editorState,
          pageSetup: pageSetup,
          items: items.map((ele) => {
            if (ele?.type === "textArea" || ele?.type === "table") {
              console.log(ele);
              if (ele?.ref) {
                let state = ele?.ref?.getEditorState();
                if (state.isEmpty()) {
                  state = null;
                } else {
                  state = state.toJSON();
                }
                return {
                  ...ele,
                  editorState: state,
                };
              } else {
                return ele;
              }
            }
            return ele;
          }),
          pagesBackgrounds: pagesBackgrounds,
        };
        if (name) {
          updateData.name = name;
        }
        console.log(editorState);
        const res = await createPDF(updateData);
        // console.log(res);
        setServerData(res);
        setIsLoading(false);
        // setIsDownloadLoading(false)
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        // setIsDownloadLoading(false)
      }
    }, 30000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  // useEffect(()=>{
  //   if (pagesData && items) {
  //     if (!pagesData.some((ele) => ele?.isPageEmpty === true)) {
  //       onCreateHandler();
  //     }
  //   }
  // },[updateDb])

  // useEffect(() => {
  //   return mergeRegister(
  //     editor.registerEditableListener((editable) => {
  //       setIsEditable(editable);
  //     }),
  //     editor.registerCommand(
  //       CONNECTED_COMMAND,
  //       (payload) => {
  //         const isConnected = payload;
  //         // // console.log(isConnected);
  //         setConnected(isConnected);
  //         return false;
  //       },
  //       COMMAND_PRIORITY_EDITOR
  //     )
  //   );
  // }, [editor]);
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert severity="error">{snackbarMsg}</Alert>
      </Snackbar>
      <Navbar
        isBlurred={false}
        isBordered
        className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 lg:[&>header]:gap-4 "
        maxWidth="full"
      >
        <NavbarContent
          justify="start"
          className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end lg:pl-[60px] pl-[20px]"
        >
          <div className="flex flex-col gap-1">{title}</div>
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="align-center gap-0 lg:gap-1 me-2 lg:me-0 justify-end"
        >
          <div className="flex gap-2 mr-2">
            {/* {!disabledApprover && SUPPORT_SPEECH_RECOGNITION && (
              <Button
                isIconOnly
                className={
                  'action-button action-button-mic ' +
                  (isSpeechToText ? 'active' : '')
                }
                onPress={() => {
                  editor.dispatchCommand(
                    SPEECH_TO_TEXT_COMMAND,
                    !isSpeechToText
                  );
                  setIsSpeechToText(!isSpeechToText);
                  // console.log(!isSpeechToText);
                  // console.log(SUPPORT_SPEECH_RECOGNITION);
                }}
              >
                <Mic size={20} />
              </Button>
            )} */}
            {!disabledApprover && (
              <>
                {/* <Button
                  isIconOnly
                  className="action-button import"
                  onClick={() => importFile(editor)}
                  title="Import"
                  aria-label="Import editor state from JSON"
                >
                  <Upload size={20} />
                </Button>
                <Button
                  isIconOnly
                  className="action-button export"
                  onClick={() =>
                    exportFile(editor, {
                      fileName: `Playground ${new Date().toISOString()}`,
                      source: 'Playground',
                    })
                  }
                  title="Export"
                  aria-label="Export editor state to JSON"
                >
                  <Download size={20} />
                </Button> */}
                {!isActiveUpload && (
                  <Button
                    isIconOnly
                    className="action-button clear"
                    // isDisabled={isLoading}
                    onClick={() => {
                      showModal("Clear editor", (onClose) => (
                        <ShowClearDialog
                          pagesData={pages}
                          onClose={onClose}
                          setItems={setItems}
                          updatePage={updatePage}
                        />
                      ));
                    }}
                    title="Clear"
                    aria-label="Clear editor contents"
                  >
                    <Eraser size={20} />
                  </Button>
                )}
                {/* <Button
                  isIconOnly
                  className={`action-button ${!isEditable ? 'unlock' : 'lock'}`}
                  onClick={() => {
                    // Send latest editor state to commenting validation server
                    if (isEditable) {
                      // sendEditorState(editor);
                    }
                    editor.setEditable(!editor.isEditable());
                  }}
                  title="Read-Only Mode"
                  aria-label={`${
                    !isEditable ? 'Unlock' : 'Lock'
                  } read-only mode`}
                >
                  {isEditable ? <Lock size={20} /> : <Unlock size={20} />}
                </Button> */}
              </>
            )}
            {/* <Button
          isIconOnly
            className="action-button connect"
            onClick={() => {
              editor.dispatchCommand(TOGGLE_CONNECT_COMMAND, !connected);
            }}
            title={`${
              connected ? "Disconnect" : "Connect"
            } Collaborative Editing`}
            aria-label={`${
              connected ? "Disconnect from" : "Connect to"
            } a collaborative editing server`}
          >
            {connected?<Plug size={20}/>:<Unplug size={20}/>}
          </Button> */}
            {!isActiveUpload && (
              <>
                <Button
                  isIconOnly
                  className={`action-button `}
                  // startContent={showComments?<MessageCircleOff />:<MessageCircleMore />}
                  onClick={downloadPDFFromServer}
                  title={"Download PDF"}
                  isDisabled={isDownLoadLoading || isLoading}
                >
                  {/* {showComments?<MessageCircleOff />:<MessageCircleMore />} */}
                  <Download />
                </Button>
                <Button
                  isIconOnly
                  className={`action-button ${showComments ? "active" : ""}`}
                  // startContent={showComments?<MessageCircleOff />:<MessageCircleMore />}
                  onClick={() => setShowComments((prev) => !prev)}
                  isDisabled={isLoading || isDownLoadLoading}
                  title={showComments ? "Hide Comments" : "Show Comments"}
                >
                  {/* {showComments?<MessageCircleOff />:<MessageCircleMore />} */}
                  <AtSign />
                </Button>
              </>
            )}
          </div>
          <NavbarCta
            data={data}
            cta={cta}
            userDetails={details}
            approverSelection={approverSelection}
            disabledApprover={disabledApprover}
            currentApprover={currentApprover}
            onApproveHandler={onApproveHandler}
            onCreateHandler={onCreateHandler}
            handleTemplateUse={handleTemplateUse}
            isLoading={isLoading}
            isDownloadLoading={isDownLoadLoading}
            isEditorEmpty={isEditorEmpty}
          />
          {details?.data && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="border-3 rounded-full border-[#E8713C]"
                  classNames={{
                    base: "bg-[#05686E] text-white text-[16px]",
                  }}
                  name={
                    details?.data?.fullname
                      ? details?.data?.fullname.slice(0, 1)
                      : ""
                  }
                  size="md"
                  showFallback
                  src={details?.data?.userProfileImageLink}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection aria-label="Profile & Actions" showDivider>
                  <DropdownItem
                    isReadOnly
                    key="profile"
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      name={details?.data?.fullname}
                      description={details?.data?.phone}
                      classNames={{
                        name: "text-default-600",
                        description: "text-default-500",
                      }}
                      avatarProps={{
                        size: "lg",
                        src:
                          details?.data?.userProfileImageLink?.present &&
                          details?.data?.userProfileImageLink,
                        name: details?.data?.fullname
                          ? details?.data?.fullname.slice(0, 1)
                          : "",
                        className: "text-[18px]",
                        fallback:
                          details?.data?.fullname &&
                          details?.data?.fullname.slice(0, 1),
                      }}
                    />
                  </DropdownItem>
                </DropdownSection>

                <DropdownItem key="dashboard">
                  <NextLink href="/dashboard"> Dashboard</NextLink>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  onClick={() => logOut()}
                  // color="warning"
                  className="hover:!bg-[#E8713C] hover:!text-white"
                >
                  <p>Log Out</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {modal}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavBar;

function ShowClearDialog({ pagesData, onClose, setItems, updatePage }) {
  const { setPageFooter, setPageHeader, setHeaderActive, setFooterActive } =
    usePageDataStore();
  const { resetHistory} = useDocHistory();  
  const handleClearEditor = () => {
    pagesData.forEach((page, index) => {
      if (!page?.ref && !page?.ref?.current) {
        throw Error("NO ref");
      }
      page?.ref?.current?.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      updatePage(index, { bgColor: "#FFF" });
    });
    setPageFooter(null);
    setPageHeader(null);
    setHeaderActive(false);
    setFooterActive(false);
    onClose();
    setItems([]);
    resetHistory();
  };
  return (
    <>
      Are you sure you want to clear the editor and history?
      <div className="w-full flex gap-2 justify-end mt-2">
        <Button
          className="bg-white border border-[#05686e] text-[#05686e]"
          // onClick={() => {
          //   editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
          //   editor.focus();
          //   onClose();
          // }}
          onClick={() => handleClearEditor()}
        >
          Clear
        </Button>{" "}
        <Button
          className="bg-[#05686e] text-white"
          onClick={() => {
            // editor.focus();
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
