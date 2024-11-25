import { Button, user } from '@nextui-org/react'
import { Loader, Save } from 'lucide-react'
import React from 'react'

const NavbarCta = ({ userDetails, onApproveHandler, cta, approverSelection, isEditorEmpty, onCreateHandler, data, isLoading, isDownloadLoading, handleTemplateUse, templateUseTitle, currentApprover, disabledApprover }) => {
    const isRecipient = data?.participants && data?.participants?.recipients && data?.participants?.recipients.some((ele) => ele?.email === userDetails?.data?.email);
  const isCollaborator = data?.participants && data?.participants?.collaborators && data?.participants?.collaborators.some((ele) => ele?.email === userDetails?.data?.email);
  const isApprover = data?.approvers && data?.approvers?.some((ele) => ele?.email === userDetails?.data?.email);
  const isCreatedBy = data?.createdByUser?.email === userDetails?.data?.email;
  // console.log(!(data.approverStatus === "approved" && (isCollaborator || isCreatedBy)))
  // console.log(data?.approvers?.every(obj => obj.status === 'approved'))

  // if (isApprover && !(data?.approvers?.every(obj => obj.status === 'approved') && (isCollaborator || isCreatedBy))) {
  if (isApprover && !(data?.approvers?.every(obj => obj.status === 'approved'))) {
    return <>
      <Button
        onPress={() => onApproveHandler('rejected')}
        className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
        isDisabled={currentApprover.status === 'approved'}
      >
        Reject
      </Button>
      <Button
        onPress={() => onApproveHandler('suggest')}
        className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
        isDisabled={currentApprover.status === 'approved'}
      >
        Suggest Changes
      </Button>
      <Button
        onPress={() => {
          // debugger;
          onApproveHandler('approved')
        }}
        className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
        isDisabled={currentApprover.status === 'approved'}
      >
        Approve
      </Button>
    </>
  } else {
    if (approverSelection) {
      if (data.approvalFlow) {
        // console.log("yay")
        return <>
          <Button
            onPress={() => onCreateHandler("use")}
            isDisabled={isLoading || isDownloadLoading}
            className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
            startContent={
              isLoading ? (
                <Loader color="#05686e" size={18} />
              ) : (
                <Save color="#05686e" size={18} />
              )
            }
          // isLoading={isLoading}
          >
            {isLoading ? 'Saving' : cta}
          </Button>
          <Button
            onPress={handleTemplateUse}
            isDisabled={isLoading}
            className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
          >
            {data?.scope === "global" ?  (data?.published==='1'?"Unpublish": "Publish")  :"Prepare For Sign"}
          </Button>
        </>
      } else {
        if (data.approverStatus === "sent"|| data.approverStatus === 'approved') {
          return <></>

        } else {
          return <>
            <Button
              onPress={() => onCreateHandler("use")}
              // isDisabled={isEditorEmpty}
              className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
              startContent={
                isLoading ? (
                  <Loader color="#05686e" size={18} />
                ) : (
                  <Save color="#05686e" size={18} />
                )
              }
            // isLoading={isLoading}
            >
              {isLoading ? 'Saving' : cta}
            </Button>
            <Button
              onPress={handleTemplateUse}
              className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
            >
              Send For Approval
            </Button>
          </>
        }
      }

    } else {
      {console.log("hi")}
      return <>
        <Button
          onPress={() => onCreateHandler("use")}
          isDisabled={isLoading || isDownloadLoading}
          className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
          startContent={
            isLoading ? (
              <Loader color="#05686e" size={18} />
            ) : (
              <Save color="#05686e" size={18} />
            )
          }
        // isLoading={isLoading}
        >
          {isLoading ? 'Saving' : cta}
        </Button>
        <Button
          onPress={handleTemplateUse}
          isDisabled={isLoading}
          className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
        >
                      {data?.scope === "global" ?  (data?.published==='1'?"Unpublish": "Publish")  :"Prepare For Sign"}
        </Button>
      </>

    }

  }

  if (!approverSelection || data.approverStatus !== "approved") {
    return <>
      <Button
        onPress={() => onCreateHandler("use")}
        className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
        startContent={
          isLoading ? (
            <Loader color="#05686e" size={18} />
          ) : (
            <Save color="#05686e" size={18} />
          )
        }
      // isLoading={isLoading}
      >
        {isLoading ? 'Saving' : cta}
      </Button>
      <Button
        onPress={handleTemplateUse}
        className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
      >
        {templateUseTitle}
      </Button>
    </>
  } else {
    if (data.approverStatus === "sent" && currentApprover) {
      return <>
        <Button
          onPress={() => onApproveHandler('rejected')}
          className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
          isDisabled={currentApprover.status === 'approved'}
        >
          Suggest Changes
        </Button>
        <Button
          onPress={() => onApproveHandler('approved')}
          className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
          isDisabled={currentApprover.status === 'approved'}
        >
          Approve
        </Button>
      </>

    } else {

      if (!currentApprover && data.approverStatus !== "approved") {

        return <></>
      }
      console.log(!isApprover && data.approverStatus === "sent")
      if (!isApprover && data.approverStatus === "sent") {
        return <></>

      }
      return <>
        <Button
          onPress={() => onCreateHandler("use")}
          className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
          startContent={
            isLoading ? (
              <Loader color="#05686e" size={18} />
            ) : (
              <Save color="#05686e" size={18} />
            )
          }
        // isLoading={isLoading}
        >
          {isLoading ? 'Saving' : cta}
        </Button>
        <Button
          onPress={handleTemplateUse}
          className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
        >
          {templateUseTitle}
        </Button>
      </>
    }


  }




  if (currentApprover?.status !== "approved" && approverSelection) {
    return <>
      <Button
        onPress={() => onApproveHandler('rejected')}
        className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
        isDisabled={currentApprover.status === 'approved'}
      >
        Suggest Changes
      </Button>
      <Button
        onPress={() => onApproveHandler('approved')}
        className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
        isDisabled={currentApprover.status === 'approved'}
      >
        Approve
      </Button>
    </>
  }
  if (data?.approverStatus === 'approved' || !approverSelection) {
    return <>
      <Button
        onPress={() => onCreateHandler("use")}
        className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
        startContent={
          isLoading ? (
            <Loader color="#05686e" size={18} />
          ) : (
            <Save color="#05686e" size={18} />
          )
        }
      // isLoading={isLoading}
      >
        {isLoading ? 'Saving' : cta}
      </Button>
      <Button
        onPress={handleTemplateUse}
        className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
      >
        {templateUseTitle}
      </Button>
    </>
  }


  console.log(data?.approverStatus === 'approved')

  // {data.approverStatus === 'approved' ? (
  //     <>
  //       <Button
  //         onPress={()=>onCreateHandler("use")}
  //         className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
  //         startContent={
  //           isLoading ? (
  //             <Loader color="#05686e" size={18} />
  //           ) : (
  //             <Save color="#05686e" size={18} />
  //           )
  //         }
  //         // isLoading={isLoading}
  //       >
  //         {isLoading ? 'Saving' : cta}
  //       </Button>
  //       <Button
  //         onPress={handleTemplateUse}
  //         className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
  //       >
  //         {templateUseTitle}
  //       </Button>
  //     </>
  //   ) : (
  //     <>
  //       <>
  //         {!currentApprover && !disabledApprover ? (
  //           <>
  //             <Button
  //               onPress={()=>onCreateHandler("use")}
  //               className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
  //               startContent={
  //                 isLoading ? (
  //                   <Loader color="#05686e" size={18} />
  //                 ) : (
  //                   <Save color="#05686e" size={18} />
  //                 )
  //               }
  //               // isLoading={isLoading}
  //             >
  //               {isLoading ? 'Saving' : cta}
  //             </Button>
  //             <Button
  //               onPress={handleTemplateUse}
  //               className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
  //             >
  //               {templateUseTitle}
  //             </Button>
  //           </>
  //         ) : (
  //           <>
  //             {currentApprover && (
  //               <>
  //                 <Button
  //                   onPress={() => onApproveHandler('rejected')}
  //                   className="hidden md:flex text-[#05686e] border border-[#05686e] rounded-full bg-inherit   w-max"
  //                   isDisabled={currentApprover.status === 'approved'}
  //                 >
  //                   Suggest Changes
  //                 </Button>
  //                 <Button
  //                   onPress={() => onApproveHandler('approved')}
  //                   className="hidden md:flex  rounded-full bg-[#05686E] text-background  w-max"
  //                   isDisabled={currentApprover.status === 'approved'}
  //                 >
  //                   Approve
  //                 </Button>
  //               </>
  //             )}
  //           </>
  //         )}
  //       </>
  //     </>
  //   )}
  return (
    <></>
  )
}

export default NavbarCta