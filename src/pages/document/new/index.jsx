import { createContact } from "@/Apis/contacts";
import { getUserProfile } from "@/Apis/login";
import NewDocumentPage from "@/components/Documents/NewDocuments/NewDocumentPage";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import Navbar from "@/components/Navbar/Navbar";
import SideNav from "@/components/Navbar/SideNav/Dashboard/SideNav";
import { MergePdf } from "@/lib/pdfs/mergedpdf";
import { ValidateEmail } from "@/lib/validators/emailValidator";
import { TextField } from "@mui/material";
import {
  Button,
  CircularProgress,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Edit, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import * as Yup from "yup";
const validation = Yup.object().shape({
  fullname: Yup.string().required("Full name is required").nullable(),
  email: Yup.string().email("Give a valid email address").nullable().required(),
});

const Index = ({ document }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ref, { x, y, width }] = useDimensions();
  const draftNameModal = useDisclosure();
  const [profileDetails, setProfileDetails] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [actions, setAction] = useState(null);
  const [clientEmail, setClientEmail] = useState(null);

  const [signingOrderActive, setSigningOrderActive] = useState(false);
  const queryParameters = useSearchParams();
  const [documentArray, setDocumentArray] = useState([]);
  const [draftName, setDraftName] = useState("");
  const [signers, setSigners] = useState([
    {
      fullname: "",
      signersEmail: "",
      signerRole: "Signer",
      lang: "en",
      emailError: false,
      emailHelperText: "",
      nameError: false,
      nameHelperText: "",
      aadhaarNo: "",
      aadhaarError: false,
      aadhaarHelperText: "",
    },
  ]);
  const [isInstance, setIsInstance] = useState(false);
  const [instanceId, setIsInstanceId] = useState(null);
  // console.log(signers);
  const [files, setFiles] = useState([]);
  const [documentDetail, setdocumentDetail] = useState({
    title: "Signature Requested on Document Added with Link",
    message: "",
  });
  const [textareaValue, setTextareaValue] = useState(documentDetail.message);
  const [documentSettings, setdocumnetSettings] = useState({
    autoReminder: true,
    requiredAllSigners: true,
    expires: "1d",
  });
  const [isStampRequired, setStampRequired] = useState(false);
  const [isSelectedStamp, setIsSelectedStamp] = useState(false);
  const [stampAmount, setStampAmount] = useState("0");
  const [stampFile, setStampFile] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [signMethod, setSignMethod] = useState({
    title: "email",

    icon: <Mail size={14} />,
  });
  const [isContactSave, setIsContactSave] = useState(true);
  const [editable, setEditable] = useState(false);

  const saveContacts = async (contacts) => {
    try {
      return (saved = await Promise.all(
        contacts.map(async (ele) => {
          const response = await createContact({
            signersEmail: ele.signersEmail,
            lang: "en",
            fullname: ele.fullname,
            signerRole: ele.signerRole,
            signerMethod: signMethod.title,
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

  async function handleMerge() {
    console.log("hey");
    let fileArrayForAPIFile = [];
    if (files.some((file) => file?.url)) {
      fileArrayForAPIFile = files.map((file) => {
        if (file?.url) {
          const response = fetch(file?.url)
            .then((response) => response)
            .catch((err) => console.log(err));
          const blob = response.blob();
          console.log(blob);
          const fileConverted = new File([blob], file?.name, {
            lastModified: new Date().getTime(),
            type: blob.type,
          });
          return fileConverted;
        }
        return file;
      });
    }

    const selectedFiles = stampFile
      ? fileArrayForAPIFile.length > 0
        ? [stampFile, ...fileArrayForAPIFile]
        : [stampFile, ...files]
      : [...files];
    if (selectedFiles.length < 2) {
      alert("Please select at least two PDF files to merge.");
      return;
    }
    const mergedFile = await MergePdf(selectedFiles);
    console.log(mergedFile, mergedFile.name);
    setFiles([mergedFile]);

    setStampFile(null);
    // setPreview([null]);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isActionValidated = () => {
    if (!actions) {
      setSnackbarOpen(true);
      setSnackbarMsg("Select the type of participants");
      return false;
    }
    if (actions === "me-only") {
      return false;
    }
    return true;
  };

  const isSignersValidated = () => {
    if (signers.length === 0) {
      return false;
    }
    // const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const nameRegex = /^[A-Za-z\s.'-]+$/;
    let flag = true;
    // for(let i=0;i<signers.length;i++){
    //   if(!signers[i].fullname||!emailRegex.test(signers[i].fullname)){
    //     setSigners((prev)=>{
    //       prev[i].emailError = true;
    //       prev[i].emailHelperText = "Enter Valid Email"
    //     return prev.map((ele)=>ele);
    //     })
    //     flag=false;
    //   }
    //   if(!signers[i].signersEmail||!nameRegex.test(signers[i].signersEmail)){
    //     setSigners((prev)=>{
    //       prev[i].nameError = true;
    //       prev[i].nameHelperText = "Enter Valid Name"
    //     return prev.map((ele)=>ele);
    //     })
    //     flag = false;
    //   }
    // }
    // if(!flag){
    //   setSnackbarMsg("Enter the Signees and CC details correctly");
    //   setSnackbarOpen(true);
    // }
    // return flag;
    const aadhaarRegex = /^[1-9][0-9]{11}$/;

    for (let i = 0; i < signers.length; i++) {
      console.log(signers[i]);
      if (!signers[i].fullname) {
        setSigners((prev) => {
          prev[i].nameError = true;
          prev[i].nameHelperText = "Name is required";
          return prev.map((ele) => ele);
        });
        flag = false;
        console.log("error", i);
      }
      if (!signers[i].signersEmail) {
        setSigners((prev) => {
          prev[i].emailError = true;
          prev[i].emailHelperText = "Email is required";
          return prev.map((ele) => ele);
        });
        console.log("error", i);
        flag = false;
      }
      if (!ValidateEmail(signers[i].signersEmail)) {
        setSigners((prev) => {
          prev[i].emailError = true;
          prev[i].emailHelperText = "Enter valid email";
          return prev.map((ele) => ele);
        });
        console.log("error", i);
        flag = false;
      }
      if (
        signers.some((ele, index) => {
          if (index === i) {
            return false;
          }
          return ele.signersEmail === signers[i].signersEmail;
        })
      ) {
        setSigners((prev) => {
          prev[i].emailError = true;
          prev[i].emailHelperText =
            "Email can't be same for multiple participants";
          return prev.map((ele) => ele);
        });
        console.log("error", i);
        flag = false;
      }
      if (
        signMethod.title === "aadhaar" &&
        signers[i].signerRole === "Signer"
      ) {
        if (!signers[i].aadhaarNo) {
          setSigners((prev) => {
            prev[i].aadhaarError = true;
            prev[i].aadhaarHelperText = "Aadhaar is required";
            return prev.map((ele) => ele);
          });
          console.log("error", i);
          flag = false;
        }
        if (signers[i].aadhaarNo && !aadhaarRegex.test(signers[i].aadhaarNo)) {
          setSigners((prev) => {
            prev[i].aadhaarError = true;
            prev[i].aadhaarHelperText = "Enter a valid Aadhaar number";
            return prev.map((ele) => ele);
          });
          console.log("error", i);
          flag = false;
        }
      }
    }
    return flag;
  };
  const isStampValidated = () => {
    const stampRegex = /^(?!0$)[1-9]\d*$/;
    if (isStampRequired && !stampFile && !stampRegex.test(stampAmount)) {
      return false;
    }
    return true;
  };

  const isValidated = (from) => {
    if (files.length === 0) {
      setSnackbarOpen(true);
      setSnackbarMsg("Add atleast one document");
      console.log(false);
      return false;
    }
    if (!isActionValidated()) {
      console.log(false);
      return false;
    }
    if (from !== "Save Draft" && !isSignersValidated()) {
      console.log(false);
      return false;
    }
    // if (from !== "Save Draft" && !isStampValidated()) {
    // 	setSnackbarOpen(true);
    // 	setSnackbarMsg("Give a valid stamp amount");
    // 	return false;
    // }
    return true;
  };

  const handleSubmitClick = (from) => {
    if (from !== "Save Draft") {
      handleSubmit(from);
    } else {
      draftNameModal.onOpen();
    }
  };
  const b64toBlob = async (b64Data) => {
    const url = b64Data;
    const res = await fetch(url);
    const message = await res.blob();
    return message;
  };

  async function profile() {
    const profile = await getUserProfile(Cookies.get("accessToken"));
    setProfileDetails(profile.data);
    const obj = profile.data;

    setdocumentDetail({
      ...documentDetail,
      message: `${
        profile.data.fullname ? profile.data.fullname : "User"
      } has requested your signature on document & it's ready for review and signing.\n\nKindly go through it and complete the signing process.\n\nClick on the link below to sign the document. Once all parties finish signing, You will receive a copy of the executed document`,
    });
  }

  async function handleSubmit(from) {
    if (isValidated(from)) {
      onOpen();
      if (isContactSave) {
        const isSaved = await saveContacts(signers);
        if (isSaved) {
          console.log("contacts saved");
        } else {
          console.log("error saving contacts");
        }
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${Cookies.get("accessToken")}`);
      myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
      myHeaders.append("Cache-Control", "");

      const formdata = new FormData();
      if (id) {
        formdata.append("documentId", id);
      }
      formdata.append("participants", actions);
      formdata.append(
        "signees",
        JSON.stringify(
          signers.map((signee) => {
            return {
              fullname: signee.fullname,
              signersEmail: signee.signersEmail,
              signerRole: signee.signerRole,
              aadhaarNo: signee.aadhaarNo,
            };
          })
        )
      );
      if (clientEmail) {
        formdata.append("userLogo", clientEmail);
      }
      formdata.append("signMethod", signMethod.title);
      files.map((e, i) => {
        {console.log(files)}
        if (e.type && !e.id) {
          formdata.append(`files`, files[i], `file${i}`);
        }
        if (e.id) {
          formdata.append("googleDriveData", e.id);
        }
      });
      formdata.append("emailTemplate", JSON.stringify(documentDetail));
      formdata.append("settings", JSON.stringify(documentSettings));
      if (isStampRequired) {
        if (stampFile) {
          formdata.append("stampFile", stampFile);
        }
        if (stampAmount) {
          formdata.append("stampAmount", stampAmount);
        }
      }
      if (documentArray) {
        formdata.append("document", JSON.stringify(documentArray));
      }
      if (draftName) {
        formdata.append("draftName", draftName);
      }
      formdata.append("isSigningOrder", signingOrderActive ? "1" : "0");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      let url = "https://api.lawinzo.com/node/legalAgreement/addAgreement";
      if (from === "Quick Send") {
        url = "https://api.lawinzo.com/node/legalAgreement/quickSend";
      }
      if (from === "Send") {
        url = "https://api.lawinzo.com/legalAgreement/send";
      }

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          const id = data.data._id;
          if (from === "Save Draft") {
            router.push("/dashboard");
          }
          if (from === "Prepare") {
            router.push(`/document/prepare?id=${id}`);
          }
          if (from === "Quick Send" || from === "Send") {
            router.push(`/document/preview?id=${id}`);
          }
          onClose();
        })
        .catch((error) => {
          onClose();
          setSnackbarOpen(true);
          setSnackbarMsg("Network Error");
          console.log("error", error);
        });
    }
  }
  useEffect(() => {
    // if (queryParameters.get("jwt")) {
    // 	Cookies.set("isLoggedIn", true);
    // 	Cookies.set("accessToken", queryParameters.get("jwt"));
    // 	router.replace("/document/new?id=" + queryParameters.get("id"));
    // }
    profile();
  }, []);

  if (isOpen) {
    return <LoadingPage />;
  }

  return (
    <section ref={ref} className="relative">
      <SideNav />
      <Navbar
        navbar={document.navBar}
        footer={document.footer}
        hideLogo={true}
        fromNewDocumentPage={!isInstance}
        handleSubmit={handleSubmitClick}
        content={{
          title: isInstance ? (
            editable ? (
              <input
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (event.currentTarget.value === "") {
                      return;
                    }
                    setDraftName(event.currentTarget.value);
                    setEditable(false);
                  }
                }}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                type="text"
                autoFocus={true}
                className="p-3 w-[130px] h-full text-sm font-medium bg-transparent active:border-none"
                placeholder="Rename"
              ></input>
            ) : (
              <>
                <p onDoubleClick={() => setEditable(true)}>{draftName}</p>
                <Edit size={18} color="#05686e" onClick={()=>setEditable((prev)=>!prev)}/>	
              </>
            )
          ) : draftName ? (
            `New 'Document: ${
              draftName
                ? draftName.length > 40
                  ? `${draftName.slice(0, 39)}...`
                  : draftName
                : ""
            }`
          ) : (
            "New Document"
          ),
          back: isInstance
            ? { title: "Edit Template", link: `/template/new?id=${instanceId}` }
            : { title: "Documents", link: "/document" },
          links: isInstance
            ? [
                {
                  title: "Save Draft",
                  action: "save-draft",
                  link: "/document/new?action=save-draft",
                },
                {
                  title: "Send",
                  action: "Send",
                  link: "Send",
                },
              ]
            : [
                {
                  title: "Save Draft",
                  action: "save-draft",
                  link: "/document/new?action=save-draft",
                },
                {
                  title: "Prepare",
                  action: "prepare",
                  link: "/document/new?action=prepare",
                },
                {
                  title: "Quick Send",
                  action: "quick-send",
                  link: "/document/new?action=quick-send",
                },
              ],
        }}
      />
      <NewDocumentPage
        width={width}
        profileDetails={profileDetails}
        setProfileDetails={setProfileDetails}
        textareaValue={textareaValue}
        setTextareaValue={setTextareaValue}
        handleSubmit={handleSubmitClick}
        actions={actions}
        setAction={setAction}
        signers={signers}
        setSigners={setSigners}
        files={files}
        setFiles={setFiles}
        documentDetail={documentDetail}
        setdocumentDetail={setdocumentDetail}
        documentSettings={documentSettings}
        setdocumnetSettings={setdocumnetSettings}
        isStampRequired={isStampRequired}
        setStampRequired={setStampRequired}
        isSelectedStamp={isSelectedStamp}
        setIsSelectedStamp={setIsSelectedStamp}
        stampAmount={stampAmount}
        setStampAmount={setStampAmount}
        stampFile={stampFile}
        setStampFile={setStampFile}
        documentArray={documentArray}
        setDocumentArray={setDocumentArray}
        handleSnackbarClose={handleSnackbarClose}
        snackbarOpen={snackbarOpen}
        snackbarMsg={snackbarMsg}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        signingOrderActive={signingOrderActive}
        setSigningOrderActive={setSigningOrderActive}
        setDraftName={setDraftName}
        signMethod={signMethod}
        setSignMethod={setSignMethod}
        isContactSave={isContactSave}
        setIsContactSave={setIsContactSave}
        setSnackbarMsg={setSnackbarMsg}
        setSnackbarOpen={setSnackbarOpen}
        isInstance={isInstance}
        setIsInstance={setIsInstance}
        setIsInstanceId={setIsInstanceId}
      />
      {/* <Modal
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				classNames={{
					closeButton: "hidden",
					base: "bg-[#fff00] border-0 shadow-none",
					wrapper: "shadow-none w-[100vw] h-[100vh]",
				}}
				isDismissable={false}
			>
				<ModalContent>
					<div className="flex flex-col p-10  gap-4 justify-center items-center">
						<p className="text-[14px] lg:text-[26px] font-bold text-[#05686e]">
							{id ? "Saving Changes" : "Saving"}
						</p>
						<CircularProgress color="secondary" />
					</div>
					<LoadingPage/>
				</ModalContent>
			</Modal> */}
      <Modal
        isOpen={draftNameModal.isOpen}
        onOpenChange={draftNameModal.onOpenChange}
        onClose={() => handleSubmit("Save Draft")}
      >
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader>Enter draft name</ModalHeader>
                <div className="py-4 px-6">
                  <TextField
                    fullWidth
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    label="Draft Name"
                    placeholder="Draft Name"
                  />
                  <div className="flex justify-end text-[12px] items-baseline mt-4 gap-2">
                    <p
                      onClick={() => draftNameModal.onClose()}
                      className="hover:cursor-pointer"
                    >
                      skip
                    </p>
                    <Button
                      // variant="bordered"
                      className="bg-[#05686e] text-background"
                      onPress={onClose}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const data = await fetch(
    "https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json",
    { cache: "no-store" }
  );
  const DocumentObject = await data.json();
  return { props: { document: DocumentObject } };
};
