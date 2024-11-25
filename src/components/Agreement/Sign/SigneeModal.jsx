import OtpF from "@/components/EnquiryPage/otpF";
import {
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import { generateOtp } from "@/Apis/login";
import { requestAadharOTP,verifyAadharOTP } from "@/Apis/aadhar";
import Otp from "@/components/Auth/Aadhar/OTP";
import { signAgreement } from "@/Apis/legalAgreement";
import PreviewRadioGroup from "./PreviewRadioGroup";

const SigneeModal = ({
  userType,
  signee,
  userDetails,
  setUserDetails,
  index,
  agreementId,
  handleUpdate,
  agreementUrl,
  previewIndex,
  handleChangeIndex,
  documents,
  agreementType,
}) => {
  const [otpStatus, setOtpStatus] = useState(false);
  const [aadharStatus, setAadharStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const { id} = router.query;
  const [buttonState, setButtonState] = useState(false)
  const [signingCompleted,setSigningCompleted] = useState(false);
  const [aadharRequestId,setAadharRequestId] = useState(null);
  const [taskId , setTaskId] = useState(null)
  const getCurrentlySelectedSignedStatus = () => {
    const doc = documents[previewIndex]
    let signeesArray
    const userIndex = id && id.includes("-") ? id.split("-")[1] : -1;
    if (userType === "party1"){
      signeesArray = doc.party1Signees
    } else {
      signeesArray = doc.party2Signees
    }
    if(signeesArray[userIndex]=== 0 ){
      return false 
    } else {
      return true
    }
  }

  useEffect(() => {
    if(getCurrentlySelectedSignedStatus()){
      setButtonState(true)
    } else {
      setButtonState(false)
    }
  }, [previewIndex])
  

  const verifyAadhar = () => {
    const requestAadhar = async(aadharNumber, taskId) => {
      setIsSubmitting(true)
      const res = await requestAadharOTP(aadharNumber, taskId)
      if(res?.response_message === "Valid Authentication" && res?.result?.is_otp_sent){
        setAadharRequestId(res?.request_id)
        setTaskId(res?.task_id)
        setAadharStatus("requested")
      }
      setIsSubmitting(false)
    }
    const taskId = `${documents[previewIndex]?._id}-${userType ==="party1"? "1" : "2"}-${index}`
    requestAadhar(aadhar,taskId)
  };
  const getOtp = async () => {
    console.log("clicked");
    const response = await generateOtp(user?.phone);
    console.log(response);
  };

  useEffect(() => {
    if(documents){
      let bool = true
      let signeesArray;
      const userIndex = id && id.includes("-") ? id.split("-")[1] : -1;
      for(const item of documents){
        if (userType === "party1") {
          signeesArray = item.party1Signees;
        } else {
          signeesArray = item.party2Signees;
        }
        if (signeesArray[userIndex] === 0) {
          bool = false;
        } 
      }
      setSigningCompleted(bool)
    }
  }, [documents])

  const completeSigning = async () => {
    try {
      if (!userType || !agreementId || !index) {
        throw Error("All params not provided");
      }
      setIsLoading(true);
      const documentId = documents[previewIndex]._id
      const response = await signAgreement(agreementId, userType, index,documentId );
      console.log(response);
      if (response) {
        onClose();
        // handleUpdate();
        router.reload();
        console.log("signed");
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(userDetails, parseInt(index));
    if (userDetails) {
      if (parseInt(index) !== -1) {
        setUser(userDetails[parseInt(index)]);
        setAadhar(userDetails[parseInt(index)]?.aadhar);
      }
    }
  }, []);

  // if (
  //   userDetails &&
  //   parseInt(index) !== -1 &&
  //   userDetails[index]?.isSigned === "1"
  // ) {
  //   return (
  //     <>
  //       <div className="border-solid border-2 rounded-md bg-green-200 border-green-400 text-green-600 text-center p-4 my-3">
  //         Thank you for completing the digital sign process
  //       </div>
  //       {agreementType === 'general'? 
  //       <div className="flex flex-col">
  //         {documents?.map((doc,index)=>{
  //         return <div className="w-full flex justify-between items-center my-2" key={index}>
  //           <span className="font-[700] text-[14px]">Agreement {index +1}</span>
  //         <a href={agreementUrl} download="Rental Agreement" target="_blank">
  //           <Button color="warning" variant="shadow" className="bg-logo-golden">
  //             Download Agreement
  //           </Button>
  //         </a>

  //         </div>
  //         })}
  //     </div>
  //       :
  //       <div className="flex justify-center">
  //         <a href={agreementUrl} download="Rental Agreement" target="_blank">
  //           <Button color="warning" variant="shadow" className="bg-logo-golden">
  //             Download Agreement
  //           </Button>
  //         </a>
  //       </div>
  //     }
  //     </>
  //   );
  // }

  return (
    <>
      <div className="grid w-full gap-x-4">
        <div className="p-2">
          {signingCompleted && (
            <div className="border-solid border-2 rounded-md bg-green-200 border-green-400 text-green-600 text-center p-4 my-3">
              You have signed all documents.{" "}
            </div>
          )}
          <span className="capitalize block text-[#fda178] text-[20px] font-[400] border-b-1 pb-2 border-gray-200 border-solid">
            {" "}
            {/* {userType} Details{" "} */}
            Signee Details
          </span>
          <span className="block  text-[16px] font-semibold pb-1">
            {userType ? userType.toUpperCase() : "Signee Type"}
          </span>
          <span className="block font-[400] text-[16px] pb-1">
            {user?.fullname}
          </span>
          <span className="block font-[400] text-[16px pb-1">{`******${user?.phone
            .toString()
            .slice(-4)}`}</span>
        </div>
      </div>
      {agreementType === "general" && (
        <PreviewRadioGroup
          index={previewIndex}
          handleChangeIndex={handleChangeIndex}
          documents={documents}
        />
      )}
      <div className="flex w-full justify-end mt-4">
        <Button
          variant="shadow"
          color="warning"
          onPress={() => {
            onOpen();
            getOtp();
          }}
          // isDisabled={buttonState}
          className="__variable_598ead !font-sans min-w-[150px] bg-[#fda178] "
        >
          {"e-Sign Agreement"}
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        placement="center"
      >
        <ModalContent className="__variable_598ead !font-sans">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sign Document
              </ModalHeader>
              <Divider />

              <ModalBody>
                {otpStatus ? (
                  aadharStatus === "requested" ? (
                    <Otp
                      aadharNumber={aadhar}
                      setAadharStatus={setAadharStatus}
                      fromSigning={true}
                      aadharRequestId={aadharRequestId}
                      taskId = {taskId}
                    />
                  ) : (
                    <>
                      <TextField
                        sx={{ mb: 0, mt: 2, width: "100%" }}
                        id="outlined-basic"
                        autoComplete="false"
                        label="Aadhar Number"
                        required
                        variant="outlined"
                        value={aadhar}
                        onChange={(event) => {
                          setAadhar(event.target.value);
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                          if (e.target.value.length > 0) {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 12);
                          }
                        }}
                        disabled={aadharStatus === "verified"}
                        InputProps={{
                          maxLength: 12,
                          endAdornment: (
                            <InputAdornment position="end">
                              {aadharStatus === "verified" ? (
                                <CheckCircleOutlineIcon className="text-success" />
                              ) : (
                                <Button
                                  type="button"
                                  size="md"
                                  radius="sm"
                                  className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
                                  onClick={verifyAadhar}
                                  isLoading={isSubmitting}
                                >
                                  Verify
                                </Button>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </>
                  )
                ) : (
                  <OtpF
                    otpStatus={otpStatus}
                    setOtpStatus={setOtpStatus}
                    phoneNumber={user.phone}
                    fromSigning={true}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                {aadharStatus === "verified" && (
                  <Button
                    className="bg-[#fda178] hover:bg-black hover:text-[white]"
                    onPress={completeSigning}
                    isLoading={isLoading}
                  >
                    Complete Signing
                  </Button>
                )}
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SigneeModal;
