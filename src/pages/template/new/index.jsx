import NewTemplateComponent from "@/components/Template/NewTemplateComponent";
import React, { useEffect } from "react";
import CryptoJS from "crypto-js";
import { getTemplate, updateTemplate } from "@/Apis/template";
import { getUserProfile } from "../../../Apis/login";
import { getAncestorsForServer } from "../../../Apis/folderStructure";
import { useTabsStore } from "../../../components/Template/stores/useDocTabsStore";
import { useDocItemStore } from "../../../components/Template/stores/useDocItemStore";
import { usePageDataStore } from "../../../components/Template/stores/usePageDataStore";
import { useDocHistory } from "../../../components/Template/stores/useDocHistoryStore";

const NewTemplatePage = ({ document, roomId, data, ancestors, user, isApprove,userRole }) => {
  const { setApprover,resetTabStore } = useTabsStore();
  const { resetItem } = useDocItemStore();
  const { reset } = usePageDataStore();
  const {resetHistory}=useDocHistory()
//   useEffect(() => {
//     setApprover(isApprove)
//   }, [isApprove])
  useEffect(() => {
    return () => { resetItem(); reset();resetTabStore();resetHistory() }
  }, [])
  // console.log(data?.editorState?.length)
  console.log(data)
  return <NewTemplateComponent document={document} roomId={roomId} data={data} ancestors={ancestors} user={user} userRole={userRole} />;
};

export default NewTemplatePage;

export const getServerSideProps = async (ctx) => {
  let isApprove;
  const data = await fetch(
    "https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
    { cache: "no-store" }
  );
  const DocumentObject = await data.json();
  const accessToken = ctx.req.cookies['accessToken'];
  const id = ctx.query.id;
  const templateId = ctx.query.templateId;

  if (!id) {
    return {
      notFound: true,
    };
  }
  let profile = await getUserProfile(accessToken)
  let ref = await getTemplate(id, accessToken);

  let ancestors = null;
  if (templateId) {
    const reb64 = CryptoJS.enc.Hex.parse(templateId);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.AES.decrypt(bytes, "test");
    const plain = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    console.log(plain)
    if (!plain || !plain?.email) {
      // console.log(plain , plain?.key)
      return {
        notFound: true,
      };
    }
    const email = plain.email
    // console.log(email)

    if (email) {
      const participants = ref?.data?.ref?.participants
      if (participants?.collaborators?.some((el) => el.email === email)) {
        const newCollab = participants?.collaborators?.map((el) => {
          if (!el.hasAccepted && el.email === email) {
            return {
              ...profile.data,
              hasAccepted: true
            }
          } else {
            return el
          }
        })
        const folderRes = await updateTemplate(
          accessToken,
          {
            participants: {
              collaborators: newCollab,
              recipients: participants?.recipients && participants?.recipients
            },
          },
          ref?.data?.ref?._id
        );
        ref = await getTemplate(id, accessToken)
      }
    }

  }

  // console.log(parsedData?.length);
  const object = ref?.data?.ref;
  let userRole;
  if (object?._id) {
    try {
      const response = await getAncestorsForServer(accessToken, object?._id);
      // console.log(response );
      if (response) {
        ancestors = response;
      }
      let access = true;
      const userDetails = await getUserProfile(accessToken);
      if (userDetails) {
        const isRecipient = object?.participants && object?.participants?.recipients && object?.participants?.recipients.some((ele) => ele?.email === userDetails?.data?.email);
        const isCollaborator = object?.participants && object?.participants?.collaborators && object?.participants?.collaborators.some((ele) => ele?.email === userDetails?.data?.email);
        isApprove = object?.approvers && object?.approvers?.some((ele) => ele?.email === userDetails?.data?.email);
        const isCreatedBy = object?.createdByUser?.email === userDetails?.data?.email;
        const approver = object?.approvers?.find((el) => el?.email === userDetails?.data?.email);
        if (!isRecipient && !isCollaborator && !isCreatedBy && !isApprove) {
          access = false;
        }
        if(isRecipient){
          userRole = 'recipient';
        }
        if(isCreatedBy){
          userRole = 'owner';
        }
        if(isCollaborator){
          userRole = 'collaborator';
        }
        if(approver){
          userRole = 'approver';
        }
        // console.log(object?.approvers ,userDetails.email )

        if (!(isCollaborator || isCreatedBy) && (approver?.status === "approved" || approver?.status === "rejected" || approver?.status==="suggest")) {

          access = false
        }
        if (!access || !userRole) {
        return {
        notFound: true
        }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  // console.log(ancestors);
  const b64 = CryptoJS.SHA3(id).toString();

  return { props: { document: DocumentObject, roomId: b64, data: ref?.data?.ref, ancestors: ancestors, user: profile.data, isApprove: isApprove ,userRole:userRole} };
};
